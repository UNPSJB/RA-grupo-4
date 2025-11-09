from typing import List, Any
from sqlalchemy.orm import Session
from src.materias.models import Materias
from src.actividades.models import Actividades
from src.informesAC.models import InformesAC
from src.informesSinteticos import schemas, models
from src.informesSinteticos.models import InformeSintetico
from src.docentes.models import Docentes

# --- FUNCIONES CRUD BÁSICAS ---
def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate):
    nuevo_informe = models.InformeSintetico(**informe.dict())
    db.add(nuevo_informe)
    db.commit()
    db.refresh(nuevo_informe)
    # mandar los autocompletar para crear
    return nuevo_informe

def listar_informesSinteticos(db: Session) -> List[models.InformeSintetico]:
    return db.query(models.InformeSintetico).all()

def obtener_informe_sintetico(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()

def listar_actividades_para_informe(db: Session) -> schemas.InformeSinteticoActividades:
    """
    Obtiene cada registro de actividad individual junto con los datos
    de la materia a la que pertenece (Código y Nombre).
    Marca con 'X' las actividades completadas.
    """
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
            .order_by(
                Materias.codigoMateria,
                Actividades.integranteCatedra
            )
            .all()
        )
    except Exception as e:
        print(f"Error en la consulta a la base de datos: {e}")
        return schemas.InformeSinteticoActividades(registros=[])

    registros: List[schemas.ActividadParaInformeRow] = []

    # 🔹 Función auxiliar: devuelve "X" si hay texto, o vacío si no
    def marcar_con_x(valor: Any) -> str:
        if valor and str(valor).strip():  # hay al menos un carácter no vacío
            return "X"
        return ""

    # 🔹 Procesa cada fila de resultados
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

# =========================================
# === FUNCIONES AUXILIARES DE BÚSQUEDA ===
# (Usadas para Previews y Autocompletado)
# =========================================

def _get_informes_ac_periodo(db: Session, departamento_id: int, anio: int):
    """Helper privado para no repetir la misma query base."""
    return (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        # Si necesitas datos del docente, asegúrate de hacer join o eager load
        .join(Docentes, InformesAC.id_docente == Docentes.id_docente) 
        .filter(Materias.id_departamento == departamento_id)
        .filter(InformesAC.ciclo_lectivo == anio)
        .all()
    )

def obtener_resumen_general_periodo(db: Session, departamento_id: int, anio: int) -> List[dict]:
    resumen = []
    # Nota: Para el resumen general a veces es mejor iterar Materias y buscar su InformeAC
    materias = db.query(Materias).filter(Materias.id_departamento == departamento_id).all()
    
    for materia in materias:
        # Buscamos si esta materia tiene informe en este año
        informe_ac = next((inf for inf in materia.informesAC if str(inf.ciclo_lectivo) == str(anio)), None)
        if informe_ac:
             resumen.append({
                "codigo": materia.codigoMateria,
                "nombre": materia.nombre,
                "alumnos_inscriptos": informe_ac.cantidad_alumnos_inscriptos or 0,
                "comisiones_teoricas": informe_ac.cantidad_comisiones_teoricas or 0,
                "comisiones_practicas": informe_ac.cantidad_comisiones_practicas or 0
            })
    return resumen

def obtener_necesidades_periodo(db: Session, departamento_id: int, anio: int) -> List[dict]:
    resumen = []
    materias = db.query(Materias).filter(Materias.id_departamento == departamento_id).all()

    for materia in materias:
        informe_ac = next((inf for inf in materia.informesAC if str(inf.ciclo_lectivo) == str(anio)), None)
        # Solo agregamos si existe informe Y tiene alguna necesidad cargada
        if informe_ac and (informe_ac.necesidades_equipamiento or informe_ac.necesidades_bibliografia):
            resumen.append({
                "codigo_materia": materia.codigoMateria,
                "nombre_materia": materia.nombre,
                "necesidades_equipamiento": informe_ac.necesidades_equipamiento or [],
                "necesidades_bibliografia": informe_ac.necesidades_bibliografia or [],
            })
    return resumen

def obtener_miembros_periodo(db: Session, departamento_id: int, anio: int) -> List[dict]:
    """
    Recupera las valoraciones de auxiliares realizadas por los docentes
    en sus InformesAC para mostrarlas consolidadas al Departamento.
    """
    valoraciones_consolidadas = []

    informes_ac = (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        .filter(Materias.id_departamento == departamento_id)
        .filter(InformesAC.ciclo_lectivo == anio)
        .all()
    )

    for informe in informes_ac:
        # Verificamos si el docente cargó valoraciones de auxiliares
        if informe.valoracion_auxiliares:
            for val in informe.valoracion_auxiliares:
                 valoraciones_consolidadas.append({
                    # ID único temporal para el frontend (ya que el auxiliar no tiene ID propio en esta tabla)
                    "id_docente": f"{informe.id_informesAC}-{val.get('nombre_auxiliar')}",
                    "nombre_docente": val.get('nombre_auxiliar', 'Desconocido'),
                    "materia": informe.materia.nombre,
                    "codigo_materia": informe.materia.codigoMateria,
                    "valoracion": val.get('calificacion'),
                    "justificacion": val.get('justificacion')
                })

    return valoraciones_consolidadas

def obtener_auxiliares_periodo(db: Session, departamento_id: int, anio: int) -> List[dict]:
    """
    Recupera los auxiliares cargados en los InformesAC individuales.
    """
    lista_auxiliares = []
    informes_ac = _get_informes_ac_periodo(db, departamento_id, anio)

    for informe in informes_ac:
        # Verificamos si este docente cargó auxiliares en su informe
        if informe.valoracion_auxiliares:
            # valoracion_auxiliares es una lista de dicts (según tu modelo)
            for aux in informe.valoracion_auxiliares:
                lista_auxiliares.append({
                    # Datos de contexto (quién lo reportó y en qué materia)
                    "materia_reportante": informe.materia.nombre,
                    "docente_responsable": informe.docente.nombre,
                    # Datos del auxiliar (extraídos del JSON guardado por el docente)
                    "nombre_auxiliar": aux.get("nombre_auxiliar"),
                    "calificacion_docente": aux.get("calificacion"),
                    "justificacion_docente": aux.get("justificacion")
                })
    return lista_auxiliares

# =========================================
# === FUNCIONES DE AUTOCOMPLETADO (POST) ===
# (Usan las auxiliares con un informe ya creado)
# =========================================

def generar_resumen_informe_general(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_resumen_general_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo))

def generar_resumen_necesidades(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_necesidades_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo))

def generar_valoracion_miembros(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    return obtener_miembros_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo))

# (Opcional) Si quisieras guardar también los auxiliares en el informe sintético:
# def generar_valoracion_auxiliares(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
#      return obtener_auxiliares_periodo(db, informe_sintetico.departamento_id, int(informe_sintetico.periodo))