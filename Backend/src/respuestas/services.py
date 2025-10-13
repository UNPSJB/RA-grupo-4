from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.respuestas.models import OpcionRespuesta
from src.respuestas import models, schemas, exceptions

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

def crear_respuestas(db: Session, respuestas_recibidas: list[schemas.RespuestaCreate]) -> list[models.Respuesta]:
    
    respuestas = []

    for r in respuestas_recibidas:
        respuesta = models.Respuesta(
            pregunta_id=r.pregunta_id,
            inscripcion_id=r.inscripcion_id,
            opcion_respuesta_id=r.opcion_respuesta_id,
            respuesta_abierta=r.respuesta_abierta,
        )
        respuestas.append(respuesta)
        db.add(respuesta)

    db.commit()
    for r in respuestas:
        db.refresh(r)

    return respuestas

