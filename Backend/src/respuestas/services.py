from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.respuestas.models import OpcionRespuesta
from src.respuestas import schemas, exceptions

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
