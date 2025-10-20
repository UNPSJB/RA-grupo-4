from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.respuestas.models import OpcionRespuesta
from src.respuestas import models, schemas, exceptions
from src.inscripciones.models import Inscripciones
from src.encuesta.models import Encuesta
from src.preguntas.models import Pregunta


# operaciones CRUD para Respuestas

def crear_opcionRespuesta(db: Session, opcionRespuesta: schemas.OpcionRespuestaCreate) -> schemas.OpcionRespuesta:
    _opcionRespuesta = OpcionRespuesta(**opcionRespuesta.model_dump())
    db.add(_opcionRespuesta)
    db.commit()
    db.refresh(_opcionRespuesta)
    return _opcionRespuesta


def listar_opcionRespuestas(db: Session) -> List[schemas.OpcionRespuesta]:
    return db.scalars(select(OpcionRespuesta)).all()


def leer_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = db.scalar(select(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id))
    if db_opcionRespuesta is None:
        raise exceptions.OpcionRespuestaNoEncontrada()
    return db_opcionRespuesta


def modificar_opcionRespuesta(
    db: Session, opcionRespuesta_id: int, opcionRespuesta: schemas.OpcionRespuestaUpdate
) -> OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    db.execute(
        update(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id).values(**opcionRespuesta.model_dump())
    )
    db.commit()
    db.refresh(db_opcionRespuesta)
    return db_opcionRespuesta


def eliminar_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    if len(db_opcionRespuesta.opciones_respuestas) > 0:
        raise exceptions.OpcionRespuestaTieneOpcionRespuesta()
    db.execute(delete(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id))
    db.commit()
    return db_opcionRespuesta

#servicios de Respuesta
def _actualizar_estado_encuesta(db: Session, inscripcion_id: int):
    """
    Función helper para verificar y actualizar el estado 
    de la encuesta de una inscripción.
    """
    
    # 1. Obtener la inscripción
    inscripcion = db.get(Inscripciones, inscripcion_id)
    if not inscripcion or inscripcion.encuesta_procesada:
        return

    # 2. Contar el N° de preguntas OBLIGATORIAS (N)
    primera_encuesta = db.query(Encuesta).first()
    if not primera_encuesta:
        return # No hay encuestas en el sistema

    total_preguntas_obligatorias = (
        db.query(Pregunta)
        .filter(
            Pregunta.encuesta_id == primera_encuesta.id_encuesta,
            Pregunta.obligatoria == True
        )
        .count()
    )

    if total_preguntas_obligatorias == 0:
        return # No hay preguntas obligatorias, no se puede "completar"

    # 3. Contar el N° de respuestas OBLIGATORIAS (R) que ha dado ESE estudiante
    total_respuestas_obligatorias = (
        db.query(models.Respuesta)
        .join(Pregunta, models.Respuesta.pregunta_id == Pregunta.id)
        .filter(
            models.Respuesta.inscripcion_id == inscripcion_id,
            Pregunta.obligatoria == True
        )
        .count()
    )

    # 4. Comparar y actualizar
    if total_respuestas_obligatorias == total_preguntas_obligatorias:
        inscripcion.encuesta_procesada = True
        db.add(inscripcion)


def crear_respuestas(db: Session, respuestas_recibidas: list[schemas.RespuestaCreate]) -> list[models.Respuesta]:
    
    respuestas = []

    if not respuestas_recibidas: #Chequeo de lista vacía
        return [] 

    inscripcion_id_actual = respuestas_recibidas[0].inscripcion_id 

    for r in respuestas_recibidas:
        respuesta = models.Respuesta(
            pregunta_id=r.pregunta_id,
            inscripcion_id=r.inscripcion_id,
            opcion_respuesta_id=r.opcion_respuesta_id,
            respuesta_abierta=r.respuesta_abierta,
        )
        respuestas.append(respuesta)
        db.add(respuesta)

    # Guardamos todas las respuestas en la base de datos
    db.commit() 
    _actualizar_estado_encuesta(db, inscripcion_id_actual)
    db.commit()

    for r in respuestas:
        db.refresh(r)

    return respuestas