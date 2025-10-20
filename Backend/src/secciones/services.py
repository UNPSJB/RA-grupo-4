from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.secciones.models import Seccion
from src.secciones import schemas, exceptions

from src.encuesta.models import Encuesta
from src.preguntas.models import Pregunta, TipoPregunta
from src.preguntas.schemas import Pregunta as PreguntaSchema
from src.preguntas.exceptions import PreguntaNoEncontrada
from src.respuestas.models import OpcionRespuesta
# operaciones CRUD para Secciones

def crear_seccion(db: Session, seccion: schemas.SeccionCreate) -> schemas.Seccion:
    _seccion = Seccion(**seccion.model_dump())
    db.add(_seccion)
    db.commit()
    db.refresh(_seccion)
    return _seccion


def listar_seccions(db: Session) -> List[schemas.Seccion]:
    return db.scalars(select(Seccion)).all()


def leer_seccion(db: Session, seccion_id: int) -> schemas.Seccion:
    db_seccion = db.scalar(select(Seccion).where(Seccion.id == seccion_id))
    if db_seccion is None:
        raise exceptions.SeccionNoEncontrada()
    return db_seccion


def modificar_seccion(
    db: Session, seccion_id: int, seccion: schemas.SeccionUpdate
) -> Seccion:
    db_seccion = leer_seccion(db, seccion_id)
    db.execute(
        update(Seccion).where(Seccion.id == seccion_id).values(**seccion.model_dump())
    )
    db.commit()
    db.refresh(db_seccion)
    return db_seccion


def eliminar_seccion(db: Session, seccion_id: int) -> schemas.Seccion:
    db_seccion = leer_seccion(db, seccion_id)
    if len(db_seccion.opciones_respuestas) > 0:
        raise exceptions.SeccionTienePreguntas()
    db.execute(delete(Seccion).where(Seccion.id == seccion_id))
    db.commit()
    return db_seccion


















def agregar_pregunta_a_seccion(db: Session, seccion_id: int, pregunta: PreguntaSchema) -> Pregunta:
    db_seccion = leer_seccion(db, seccion_id)

    nueva_pregunta = Pregunta(
        enunciado=pregunta.enunciado,
        tipo=pregunta.tipo,
        obligatoria=pregunta.obligatoria,
        seccion_id=db_seccion.id
    )
    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)

    # Si tiene opciones (para preguntas cerradas)
    if pregunta.tipo == TipoPregunta.CERRADA and pregunta.opciones_respuestas:
        for opcion in pregunta.opciones_respuestas:
            nueva_opcion = OpcionRespuesta(
                descripcion=opcion.descripcion,
                valor=getattr(opcion, "valor", None),
                pregunta_id=nueva_pregunta.id,
            )
            db.add(nueva_opcion)
        db.commit()
        db.refresh(nueva_pregunta)

    return nueva_pregunta


def eliminar_pregunta_de_seccion(db: Session, seccion_id: int, pregunta_id: int) -> Pregunta:
    db_seccion = leer_seccion(db, seccion_id)

    db_pregunta = db.scalar(
        select(Pregunta).where(
            Pregunta.id == pregunta_id,
            Pregunta.seccion_id == seccion_id
        )
    )
    if db_pregunta is None:
        raise PreguntaNoEncontrada()

    db.delete(db_pregunta)
    db.commit()
    return db_pregunta
