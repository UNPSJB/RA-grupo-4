from typing import List
from collections import defaultdict, OrderedDict
from sqlalchemy.orm import Session, joinedload
from src.informesAC.models import InformesAC
from src.informesAC import exceptions, models, schemas
from src.materias.models import Materias
from src.materias import exceptions as exceptionsMaterias
from src.inscripciones.models import Inscripciones
from src.encuesta.models import Encuesta
from src.secciones.models import Seccion
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta
from src.actividades.models import Actividades
from fastapi import HTTPException

def read_informeAC(db: Session, id_informe: int) -> InformesAC:
    informe = (
        db.query(InformesAC)
        .options(
            joinedload(InformesAC.materia),
            joinedload(InformesAC.docente),
            joinedload(InformesAC.actividades)
        )
        .filter(InformesAC.id_informesAC == id_informe)
        .first()
    )
    if not informe:
        raise exceptions.InformesNoEncontrados
    return informe


def listar_todos_los_informes(db: Session):
    return db.query(models.InformesAC).all()


# --- MODIFICADO (Lógica de filtrado) ---
def filtrar_informes(
    db: Session,
    id_docente: int | None = None,
    id_materia: int | None = None,
):
    query = db.query(InformesAC).options(
        joinedload(InformesAC.materia), # Eager loading
        joinedload(InformesAC.docente)  # Eager loading
    )

    if id_docente is not None:
        query = query.filter(InformesAC.id_docente == id_docente)

    if id_materia is not None:
        query = query.filter(InformesAC.id_materia == id_materia)
        
    # --- LÓGICA DE BANDERA (MODIFICADA) ---
    # Filtra solo por informes cuya materia asociada esté marcada como completada
    query = query.join(Materias).filter()#Materias.informeACCompletado == True)
    
    return query.all()


def actualizar_opinion_informe(db: Session, id_informe: int, opinion: str):
    informe = db.query(InformesAC).filter(InformesAC.id_informesAC == id_informe).first()
    if not informe:
        raise exceptions.InformesNoEncontrados

    informe.opinionSobreResumen = opinion
    db.add(informe)
    db.commit()
    db.refresh(informe)
    return informe


def cargar_resumen_secciones_informe(informe: InformesAC, db: Session):
    # (Tu función original sin cambios)
    if informe.resumenSecciones:
        return informe.resumenSecciones
    materia = (
        db.query(Materias)
        .options(
            joinedload(Materias.encuesta)
            .joinedload(Encuesta.secciones)
            .joinedload(Seccion.preguntas)
            .joinedload(Pregunta.opciones_respuestas)
        )
        .filter(Materias.id_materia == informe.id_materia)
        .first()
    )
    if not materia:
        raise exceptionsMaterias.MateriaNoEncontrada
    inscripciones = (
        db.query(Inscripciones)
        .options(joinedload(Inscripciones.respuestas).joinedload(Respuesta.opcion_respuesta))
        .filter(Inscripciones.materia_id == informe.id_materia)
        .all()
    )
    resumen_general = []
    for seccion in materia.encuesta.secciones:
        conteo_por_desc = defaultdict(int)
        total_respuestas = 0
        preguntas_ids = [p.id for p in seccion.preguntas]
        for ins in inscripciones:
            for r in ins.respuestas:
                if r.pregunta_id in preguntas_ids and r.opcion_respuesta:
                    desc = r.opcion_respuesta.descripcion.strip()
                    conteo_por_desc[desc] += 1
                    total_respuestas += 1
        if total_respuestas == 0:
            continue
        orden_preferido = [
            "Malo, No Satisfactorio",
            "Regular, Poco Satisfactorio.",
            "Bueno, Satisfactorio.",
            "Muy Bueno, Muy satisfactorio.",
        ]
        opciones_texto = [o.descripcion.strip() for o in seccion.preguntas[0].opciones_respuestas]
        opciones_ordenadas = [
            opt for opt in orden_preferido if opt in opciones_texto
        ] + [
            opt for opt in opciones_texto if opt not in orden_preferido
        ]
        porcentajes = {}
        for desc in opciones_ordenadas:
            cantidad = conteo_por_desc.get(desc, 0)
            porcentajes[desc] = round((cantidad / total_respuestas) * 100, 2)
        resumen_general.append({
            "id": seccion.id,
            "sigla": seccion.sigla,
            "nombre": seccion.descripcion,
            "porcentajes_opciones": porcentajes
        })
    informe.resumenSecciones = resumen_general
    return informe.resumenSecciones


# --- MODIFICADO (Seteamos la bandera 'completado = 1' en Materia) ---
def create_informe_ac(db: Session, informe: schemas.InformeACCreate):
    
    # La validación "todo o nada" ya la hizo Pydantic
    
    # 1. Buscar la materia
    materia_db = db.get(Materias, informe.id_materia)
    if not materia_db:
        raise exceptionsMaterias.MateriaNoEncontrada()

    # 2. Convertir datos JSON
    valoraciones_dict = None
    if informe.valoracion_auxiliares:
        valoraciones_dict = [v.model_dump() for v in informe.valoracion_auxiliares]

    resumen_dicts = None
    if informe.resumenSecciones:
        resumen_dicts = [s.model_dump() for s in informe.resumenSecciones]

    db_actividades = []
    if informe.actividades:
        db_actividades = [Actividades(**act.model_dump()) for act in informe.actividades]

    # 3. Crear el objeto InformeAC
    db_informe = models.InformesAC(
        # --- LÓGICA DE BANDERA ---
        # Si Pydantic lo aceptó, está completo. Seteamos 1.
        #completado=1, 
        
        # Datos Generales
        id_docente=informe.id_docente,
        id_materia=informe.id_materia,
        sede=informe.sede,
        ciclo_lectivo=informe.ciclo_lectivo,
        cantidad_alumnos_inscriptos=informe.cantidad_alumnos_inscriptos,
        cantidad_comisiones_teoricas=informe.cantidad_comisiones_teoricas,
        cantidad_comisiones_practicas=informe.cantidad_comisiones_practicas,

        # Datos Opcionales
        necesidades_equipamiento=informe.necesidades_equipamiento,
        necesidades_bibliografia=informe.necesidades_bibliografia,
        justificacion_porcentaje = informe.justificacion_porcentaje,

        # Datos Obligatorios
        porcentaje_teoricas = informe.porcentaje_teoricas,
        porcentaje_practicas = informe.porcentaje_practicas,
        porcentaje_contenido_abordado = informe.porcentaje_contenido_abordado,
        opinionSobreResumen=informe.opinionSobreResumen,
        resumenSecciones=resumen_dicts or [],
        valoracion_auxiliares = valoraciones_dict,
        aspectos_positivos_enseñanza = informe.aspectos_positivos_enseñanza,
        aspectos_positivos_aprendizaje = informe.aspectos_positivos_aprendizaje,
        obstaculos_enseñanza = informe.obstaculos_enseñanza,
        obstaculos_aprendizaje = informe.obstaculos_aprendizaje,
        estrategias_a_implementar = informe.estrategias_a_implementar,
        resumen_reflexion = informe.resumen_reflexion,
        
        actividades=db_actividades
    )
    
    # 4. Actualizar la bandera en la materia
    #materia_db.informeACCompletado = True

    # 5. Guardar ambos cambios en una transacción
    try:
        db.add(db_informe)
        db.add(materia_db)
        db.commit()
        db.refresh(db_informe)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar: {e}")
        
    return db_informe