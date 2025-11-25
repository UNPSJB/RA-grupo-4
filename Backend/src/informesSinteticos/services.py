from typing import List, Any
import json
import datetime
from sqlalchemy.orm import Session
from src.materias.models import Materias
from src.actividades.models import Actividades
from src.informesAC.models import InformesAC
from src.informesSinteticos import schemas, models
from src.informesSinteticos.models import InformeSintetico
from src.docentes.models import Docentes
from src.informesAC.schemas import InformeACParaInformeSintetico, InformeAC as informeACSchema

# --- IMPORTACIONES ---
from src.models import HistorialInformeSintetico
from src.departamentos.models import Departamento 
from src.periodos.models import Periodo            

# =======================================================
# === LOGICA DEL HISTORIAL (SNAPSHOT) ===
# =======================================================
# (Definimos esto antes para poder llamarlo desde crear_informe_sintetico)

def crear_snapshot_historico(db: Session, departamento_id: int, periodo_id: int, usuario: str):
    """Genera una copia estática de los datos actuales."""
    depto = db.query(Departamento).filter(Departamento.id == departamento_id).first()
    periodo = db.query(Periodo).filter(Periodo.id == periodo_id).first()
    
    nombre_depto = depto.nombre if depto else f"Depto {departamento_id}"
    anio = periodo.ciclo_lectivo if periodo else 0
    cuatrimestre = periodo.cuatrimestre if periodo else "-"

    datos_snapshot = {
        "metadata": {
            "departamento": nombre_depto,
            "anio": anio,
            "cuatrimestre": cuatrimestre,
            "fecha_corte": str(datetime.datetime.now())
        },
        "resumen_general": obtener_resumen_general_periodo(db, departamento_id, periodo_id),
        "necesidades": obtener_necesidades_periodo(db, departamento_id, periodo_id),
        "valoracion_miembros": obtener_miembros_periodo(db, departamento_id, periodo_id),
        "valoracion_auxiliares": obtener_auxiliares_periodo(db, departamento_id, periodo_id),
        "porcentajes": [
            {
                "codigo": p.get("codigoMateria"),
                "nombre": p.get("nombreMateria"),
                "abordado": p.get("porcentaje_contenido_abordado"),
                "teoricas": p.get("porcentaje_teoricas"),
                "practicas": p.get("porcentaje_practicas"),
                "justificacion": p.get("justificacion_porcentaje")
            } for p in get_porcentajes_informeSintetico(db, departamento_id, periodo_id)
        ],
        "aspectos_obstaculos": [
            {
                "codigo": a.get("codigoMateria"),
                "nombre": a.get("nombreMateria"),
                "positivos_enseñanza": a.get("aspectosPositivosEnsenianza"),
                "positivos_aprendizaje": a.get("aspectosPositivosAprendizaje"),
                "obstaculos_enseñanza": a.get("ObstaculosEnsenianza"),
                "obstaculos_aprendizaje": a.get("obstaculosAprendizaje"),
                "estrategias": a.get("estrategiasAImplementar")
            } for a in get_aspectos_positivo_y_obstaculos__informeSintetico(db, departamento_id, periodo_id)
        ]
    }

    nuevo_historial = HistorialInformeSintetico(
        anio_lectivo=anio,
        cuatrimestre=str(cuatrimestre), 
        departamento_id=departamento_id,
        nombre_departamento=nombre_depto,
        usuario_generador=usuario,
        datos_json=json.dumps(datos_snapshot, default=str)
    )

    db.add(nuevo_historial)
    db.commit()
    db.refresh(nuevo_historial)
    return nuevo_historial

def listar_historial(db: Session):
    return db.query(HistorialInformeSintetico).order_by(HistorialInformeSintetico.fecha_generacion.desc()).all()

def obtener_historial_por_id(db: Session, historial_id: int):
    return db.query(HistorialInformeSintetico).filter(HistorialInformeSintetico.id == historial_id).first()


# --- FUNCIONES CRUD PRINCIPALES ---

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate):
    # 1. Crear el informe oficial ("vivo")
    nuevo_informe = models.InformeSintetico(**informe.dict())
    db.add(nuevo_informe)
    db.commit()
    db.refresh(nuevo_informe)
    
    # 2. AUTOMATIZACIÓN: Generar Snapshot Histórico INMEDIATAMENTE
    try:
        crear_snapshot_historico(
            db, 
            departamento_id=nuevo_informe.departamento_id, 
            periodo_id=nuevo_informe.periodo_id,
            usuario="Generado Automáticamente" # Se puede mejorar si pasas el usuario
        )
    except Exception as e:
        print(f"Advertencia: No se pudo generar el historial automático: {e}")
        # No interrumpimos el flujo principal si falla el historial

    return nuevo_informe

def listar_informesSinteticos(db: Session) -> List[models.InformeSintetico]:
    return db.query(models.InformeSintetico).all()

def obtener_informe_sintetico(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()

# --- RESTO DE FUNCIONES DE RECOLECCION DE DATOS (Sin cambios) ---

def listar_actividades_para_informe(db: Session) -> schemas.InformeSinteticoActividades:
    try:
        resultados_tuplas = (
            db.query(
                Materias.codigoMateria,
                Materias.nombre,
                Actividades.integranteCatedra,
                Actividades.capacitacion,
                Actividades.investigacion,
                Actividades.extension,
                Actividades.gestion,
                Actividades.observacionComentarios
            )
            .join(InformesAC, Actividades.id_informeAC == InformesAC.id_informesAC)
            .join(Materias, InformesAC.id_materia == Materias.id_materia)
            .order_by(Materias.codigoMateria, Actividades.integranteCatedra)
            .all()
        )
    except Exception as e:
        print(f"Error: {e}")
        return schemas.InformeSinteticoActividades(registros=[])

    registros: List[schemas.ActividadParaInformeRow] = []

    def marcar_con_x(valor: Any) -> str:
        return "X" if valor and str(valor).strip() else ""

    for row in resultados_tuplas:
        registro_fila = schemas.ActividadParaInformeRow(
            codigoMateria=row[0],
            nombreMateria=row[1],
            integranteCatedra=row[2],
            capacitacion=marcar_con_x(row[3]),
            investigacion=marcar_con_x(row[4]),
            extension=marcar_con_x(row[5]),
            gestion=marcar_con_x(row[6]),
            observacionComentarios=row[7] or ""
        )
        registros.append(registro_fila)

    return schemas.InformeSinteticoActividades(registros=registros)

# ... HELPERS DE BÚSQUEDA (obtener_resumen..., etc.) SE MANTIENEN IGUAL ...
# Solo me aseguro de incluir las definiciones para que el código no se rompa

def _get_informes_ac_periodo(db: Session, departamento_id: int, periodo_id: int):
    return (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        .join(Docentes, InformesAC.id_docente == Docentes.id_docente) 
        .filter(Materias.id_departamento == departamento_id)
        .filter(Materias.id_periodo == periodo_id)  
        .all()
    )

def obtener_resumen_general_periodo(db: Session, departamento_id: int, periodo_id: int) -> List[dict]:
    resumen = []
    materias =  db.query(Materias).filter(Materias.id_departamento == departamento_id).filter(Materias.id_periodo == periodo_id).all()
    for materia in materias:
        informe_ac = materia.informesAC[0] if materia.informesAC else None
        if informe_ac:
            resumen.append({
                "codigo": materia.codigoMateria,
                "nombre": materia.nombre,
                "alumnos_inscriptos": informe_ac.cantidad_alumnos_inscriptos or 0,
                "comisiones_teoricas": informe_ac.cantidad_comisiones_teoricas or 0,
                "comisiones_practicas": informe_ac.cantidad_comisiones_practicas or 0
            })
    return resumen

def obtener_necesidades_periodo(db: Session, departamento_id: int, periodo_id: int) -> List[dict]:
    resumen = []
    materias = db.query(Materias).filter(Materias.id_departamento == departamento_id).filter(Materias.id_periodo == periodo_id).all()
    for materia in materias:
        informe_ac = materia.informesAC[0] if materia.informesAC else None
        if informe_ac and (informe_ac.necesidades_equipamiento or informe_ac.necesidades_bibliografia):
            resumen.append({
                "codigo_materia": materia.codigoMateria,
                "nombre_materia": materia.nombre,
                "necesidades_equipamiento": informe_ac.necesidades_equipamiento or [],
                "necesidades_bibliografia": informe_ac.necesidades_bibliografia or [],
            })
    return resumen

def obtener_miembros_periodo(db: Session, departamento_id: int, periodo_id: int) -> List[dict]:
    valoraciones_consolidadas = []
    informes_ac = db.query(InformesAC).join(Materias, InformesAC.id_materia == Materias.id_materia).filter(Materias.id_departamento == departamento_id).filter(Materias.id_periodo == periodo_id).all()
    for informe in informes_ac:
        if informe.valoracion_auxiliares:
            for val in informe.valoracion_auxiliares:
                valoraciones_consolidadas.append({
                    "id_docente": f"{informe.id_informesAC}-{val.get('nombre_auxiliar')}",
                    "nombre_docente": val.get('nombre_auxiliar', 'Desconocido'),
                    "materia": informe.materia.nombre,
                    "codigo_materia": informe.materia.codigoMateria,
                    "valoracion": val.get('calificacion'),
                    "justificacion": val.get('justificacion')
                })
    return valoraciones_consolidadas

def obtener_auxiliares_periodo(db: Session, departamento_id: int, periodo_id: int) -> List[dict]:
    lista_auxiliares = []
    informes_ac = _get_informes_ac_periodo(db, departamento_id, periodo_id)
    for informe in informes_ac:
        if informe.valoracion_auxiliares:
            for aux in informe.valoracion_auxiliares:
                lista_auxiliares.append({
                    "materia_reportante": informe.materia.nombre,
                    "docente_responsable": informe.docente.nombre,
                    "nombre_auxiliar": aux.get("nombre_auxiliar"),
                    "calificacion_docente": aux.get("calificacion"),
                    "justificacion_docente": aux.get("justificacion")
                })
    return lista_auxiliares

# --- FUNCIONES AUTOCOMPLETADO ---
def generar_resumen_informe_general(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_resumen_general_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo_id))

def generar_resumen_necesidades(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_necesidades_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo_id))

def generar_valoracion_miembros(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_miembros_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo_id))

def get_informesAC_asociados_a_informeSintetico(db: Session, departamento_id: int, periodo_id: int):
    return db.query(InformesAC).join(Materias).filter(Materias.id_departamento == departamento_id).filter(Materias.id_periodo == periodo_id).all()

def get_porcentajes_informeSintetico(db: Session, departamento_id: int, periodo_id: int)-> List[InformeACParaInformeSintetico]:
    informesAC = get_informesAC_asociados_a_informeSintetico(db, departamento_id, periodo_id)
    if not informesAC: return []
    resultado = []
    for informe in informesAC:
        materia = informe.materia  
        resultado.append({
            "id_informeAC": informe.id_informesAC,
            "codigoMateria": getattr(materia, "codigoMateria", None),
            "nombreMateria": getattr(materia, "nombre", None),
            "resumenSecciones": informe.resumenSecciones, 
            "opinionSobreResumen": informe.opinionSobreResumen,
            "porcentaje_contenido_abordado": informe.porcentaje_contenido_abordado,
            "porcentaje_teoricas": informe.porcentaje_teoricas,
            "porcentaje_practicas": informe.porcentaje_practicas,
            "justificacion_porcentaje": informe.justificacion_porcentaje,
        })
    return resultado

def get_aspectos_positivo_y_obstaculos__informeSintetico(db: Session, departamento_id: int, periodo_id: int)-> List[InformeACParaInformeSintetico]:
    informesAC = get_informesAC_asociados_a_informeSintetico(db, departamento_id, periodo_id)
    resultado = []
    for informe in informesAC:
        materia = informe.materia  
        resultado.append({
            "id_informeAC": informe.id_informesAC,
            "codigoMateria": getattr(materia, "codigoMateria", None),
            "nombreMateria": getattr(materia, "nombre", None),
            "aspectosPositivosEnsenianza": informe.aspectos_positivos_enseñanza,
            "aspectosPositivosAprendizaje": informe.aspectos_positivos_aprendizaje,
            "ObstaculosEnsenianza": informe.obstaculos_enseñanza,
            "obstaculosAprendizaje": informe.obstaculos_aprendizaje,
            "estrategiasAImplementar": informe.estrategias_a_implementar,            
        })
    return resultado

def get_by_id(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()