from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.respuestas.models import OpcionRespuesta
from src.respuestas import models, schemas, exceptions
from src.inscripciones.models import Inscripciones
from src.encuesta.models import Encuesta
from src.preguntas.models import Pregunta
from fastapi import HTTPException
# --- AÑADIDO: Importar Seccion ---
from src.secciones.models import Seccion

# --- Tus servicios de OpcionRespuesta (sin cambios) ---

def crear_opcionRespuesta(db: Session, opcionRespuesta: schemas.OpcionRespuestaCreate) -> schemas.OpcionRespuesta:
    # _opcionRespuesta = OpcionRespuesta(**opcionRespuesta.model_dump()) # Pydantic V2
    _opcionRespuesta = OpcionRespuesta(**opcionRespuesta.dict()) # Pydantic V1
    db.add(_opcionRespuesta)
    db.commit()
    db.refresh(_opcionRespuesta)
    return _opcionRespuesta


def listar_opcionRespuestas(db: Session) -> List[schemas.OpcionRespuesta]:
    return db.query(OpcionRespuesta).all()


def leer_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = db.query(OpcionRespuesta).filter(OpcionRespuesta.id == opcionRespuesta_id).first()
    if db_opcionRespuesta is None:
        raise exceptions.OpcionRespuestaNoEncontrada()
    return db_opcionRespuesta


def modificar_opcionRespuesta(
    db: Session, opcionRespuesta_id: int, opcionRespuesta: schemas.OpcionRespuestaUpdate
) -> OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    # db.query(OpcionRespuesta).filter(OpcionRespuesta.id == opcionRespuesta_id).update(opcionRespuesta.model_dump(exclude_unset=True)) # Pydantic V2
    db.query(OpcionRespuesta).filter(OpcionRespuesta.id == opcionRespuesta_id).update(opcionRespuesta.dict(exclude_unset=True)) # Pydantic V1
    db.commit()
    db.refresh(db_opcionRespuesta)
    return db_opcionRespuesta


def eliminar_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    # if hasattr(db_opcionRespuesta, 'opciones_respuestas') and len(db_opcionRespuesta.opciones_respuestas) > 0:
    #     raise exceptions.OpcionRespuestaTieneOpcionRespuesta()
    db.query(OpcionRespuesta).filter(OpcionRespuesta.id == opcionRespuesta_id).delete()
    db.commit()
    return db_opcionRespuesta

# --- FUNCIÓN CREAR_RESPUESTAS (MODIFICADA) ---
def crear_respuestas(db: Session, respuestas_recibidas: list[schemas.RespuestaCreate]) -> list[models.Respuesta]:

    if not respuestas_recibidas:
        return []

    inscripcion_id_actual = respuestas_recibidas[0].inscripcion_id

    try:
        # Obtenemos la inscripción y verificamos si ya está procesada PRIMERO
        inscripcion = db.get(Inscripciones, inscripcion_id_actual)
        if not inscripcion:
             raise HTTPException(status_code=404, detail=f"No se encontró la inscripción con id {inscripcion_id_actual}")

        if inscripcion.encuesta_procesada:
            raise HTTPException(status_code=400, detail="Esta encuesta ya ha sido respondida y no puede modificarse.")

        # Creamos los objetos Respuesta
        respuestas_a_crear = []
        for r in respuestas_recibidas:
            # respuesta_obj = models.Respuesta(**r.model_dump()) # Pydantic V2
            respuesta_obj = models.Respuesta(**r.dict()) # Pydantic V1
            db.add(respuesta_obj)
            respuestas_a_crear.append(respuesta_obj)

        # Obtenemos la encuesta asociada a la inscripción
        if not inscripcion.materia or not inscripcion.materia.encuesta:
             raise Exception("La inscripción no está asociada a una materia con encuesta.")
        encuesta_actual = inscripcion.materia.encuesta

        # --- CORRECCIÓN: Contamos preguntas obligatorias uniendo Pregunta y Seccion ---
        total_preguntas_obligatorias = (
            db.query(Pregunta)
            .join(Seccion, Pregunta.seccion_id == Seccion.id) # Unimos Pregunta con Seccion
            .filter(
                Seccion.encuesta_id == encuesta_actual.id_encuesta, # Filtramos por encuesta_id en Seccion
                Pregunta.obligatoria == True
            )
            .count()
        )
        # --- FIN CORRECCIÓN ---

        db.flush()

        # Contamos respuestas obligatorias (esta consulta ya era correcta)
        total_respuestas_obligatorias = (
            db.query(models.Respuesta)
            .join(Pregunta, models.Respuesta.pregunta_id == Pregunta.id)
            .filter(models.Respuesta.inscripcion_id == inscripcion_id_actual, Pregunta.obligatoria == True)
            .count()
        )

        # Actualizamos estado si es necesario
        if total_preguntas_obligatorias > 0 and total_respuestas_obligatorias >= total_preguntas_obligatorias:
            inscripcion.encuesta_procesada = True
            db.add(inscripcion)

        # Commit único
        db.commit()

        # Refrescar objetos
        for r in respuestas_a_crear:
            db.refresh(r)
        if 'inscripcion' in locals() and db.object_session(inscripcion):
             db.refresh(inscripcion)

        return respuestas_a_crear

    except HTTPException as http_exc:
        db.rollback()
        raise http_exc
    except Exception as e:
        db.rollback()
        print(f"Error en crear_respuestas: {e}")
        # Re-lanzamos el error original para ver el traceback completo en la consola
        raise e
        # Opcionalmente, lanzar una HTTPException genérica:
        # raise HTTPException(status_code=500, detail=f"Error interno al procesar respuestas.")

