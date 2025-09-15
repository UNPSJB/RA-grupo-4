from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.preguntas.models import Pregunta, TipoPregunta
from src.preguntas import schemas, exceptions

from src.respuestas.models import OpcionRespuesta
from src.respuestas.exceptions import OpcionRespuestaNoEncontrada

# operaciones CRUD para Preguntas

def crear_pregunta(db: Session, pregunta: schemas.PreguntaCreate) -> schemas.Pregunta:
    _pregunta = Pregunta(**pregunta.model_dump())
    db.add(_pregunta)
    db.commit()
    db.refresh(_pregunta)
    return _pregunta


def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    return db.scalars(select(Pregunta)).all()


def leer_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta


def modificar_pregunta(
    db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate
) -> Pregunta:
    db_pregunta = leer_pregunta(db, pregunta_id)
    db.execute(
        update(Pregunta).where(Pregunta.id == pregunta_id).values(**pregunta.model_dump())
    )
    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta


def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = leer_pregunta(db, pregunta_id)
    if len(db_pregunta.opciones_respuestas) > 0:
        raise exceptions.PreguntaTieneOpcionRespuesta()
    db.execute(delete(Pregunta).where(Pregunta.id == pregunta_id))
    db.commit()
    return db_pregunta






def agregar_opcion_respuesta(db: Session, pregunta_id: int, opcion: schemas.OpcionRespuestaCreate) -> OpcionRespuesta:
    
    db_pregunta = leer_pregunta(db, pregunta_id)

    if db_pregunta.tipo != TipoPregunta.CERRADA:
        raise exceptions.PreguntaNoEsCerrada()

    _opcion = OpcionRespuesta(
        descripcion=opcion.descripcion,
        pregunta_id=db_pregunta.id,
    )
    db.add(_opcion)
    db.commit()
    db.refresh(_opcion)
    return _opcion

def eliminar_opcion_respuesta(db: Session, pregunta_id: int, opcion: schemas.OpcionRespuestaDelete) -> OpcionRespuesta:
    
    db_pregunta = leer_pregunta(db, pregunta_id)
    if db_pregunta.tipo != TipoPregunta.CERRADA:
        raise exceptions.PreguntaNoEsCerrada()
    
    db_opcion = db.scalar(
                        select(OpcionRespuesta).where(
                            OpcionRespuesta.id == opcion.id,
                            OpcionRespuesta.pregunta_id == pregunta_id
                            )
                        )
    if db_opcion is None:
        raise OpcionRespuestaNoEncontrada()     

    db.delete(db_opcion)
    db.commit()
    return db_opcion

