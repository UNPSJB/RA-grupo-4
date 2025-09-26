from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.encuesta.models import Encuesta
from src.encuesta import schemas, exceptions

#Crear Encuesta
def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> Encuesta:
    _encuesta = Encuesta(
        nombre=encuesta.nombre,
        disponible=encuesta.disponible  
    )
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta


#Listar todas las encuestas
def listar_encuestas(db: Session) -> List[Encuesta]:
    return db.scalars(select(Encuesta)).all()

# Listar solo encuestas disponibles
def listar_encuestas_disponibles(db: Session) -> List[Encuesta]:
    return db.scalars(
        select(Encuesta).where(Encuesta.disponible == True)
    ).all()

#Leer una encuesta por ID
def leer_encuesta(db: Session, id_encuesta: int) -> Encuesta:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta


#Modificar encuesta
def modificar_encuesta(
    db: Session, id_encuesta: int, encuesta: schemas.EncuestaUpdate
) -> Encuesta:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(
        update(Encuesta)
        .where(Encuesta.id_encuesta == id_encuesta)
        .values(**encuesta.model_dump(exclude_unset=True))
    )
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta


#Eliminar encuesta
def eliminar_encuesta(db: Session, id_encuesta: int) -> schemas.EncuestaDelete:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(delete(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    db.commit()
    return db_encuesta