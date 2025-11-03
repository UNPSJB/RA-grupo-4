from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.departamentos.models import Departamento
from src.departamentos import schemas, exceptions, models


# operaciones CRUD para Departamento


def crear_departamento(db: Session, departamento: schemas.DepartamentoCreate) -> schemas.Departamento:
    _departamento = Departamento(**departamento.model_dump())
    db.add(_departamento)
    db.commit()
    db.refresh(_departamento)
    return _departamento


# def listar_departamentos(db: Session) -> List[schemas.Departamento]:
#     return db.scalars(select(Departamento)).all()
def listar_departamentos(db: Session):
    return db.query(models.Departamento).all()


def leer_departamento(db: Session, departamento_id: int) -> schemas.Departamento:
    db_departamento = db.scalar(select(Departamento).where(Departamento.id == departamento_id))
    if db_departamento is None:
        raise exceptions.DepartamentoNoEncontrada()
    return db_departamento


def modificar_departamento(
    db: Session, departamento_id: int, departamento: schemas.DepartamentoUpdate
) -> Departamento:
    db_departamento = leer_departamento(db, departamento_id)
    db.execute(update(Departamento).where(Departamento.id == departamento_id).values(**departamento.model_dump()))
    db.commit()
    db.refresh(db_departamento)
    return db_departamento


def eliminar_departamento(db: Session, departamento_id: int) -> schemas.DepartamentoDelete:
    db_departamento = leer_departamento(db, departamento_id)
    db.execute(
        delete(Departamento).where(Departamento.id == departamento_id)
    )
    db.commit()
    return db_departamento
