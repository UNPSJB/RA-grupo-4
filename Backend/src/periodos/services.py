from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.periodos.models import Periodo, CuatrimestreEnum
from src.periodos import schemas, exceptions

# operaciones CRUD para Periodoes

def crear_periodo(db: Session, periodo: schemas.PeriodoCreate) -> schemas.Periodo:
    
    # Validar si ya existe periodo de mismo ciclo y cuatrimestre
    existe = db.execute(
        select(Periodo).where(
            Periodo.ciclo_lectivo == periodo.ciclo_lectivo,
            Periodo.cuatrimestre == periodo.cuatrimestre
        )
    ).scalar_one_or_none()

    if existe:
        raise exceptions.PeriodoYaExiste
    
    _periodo = Periodo(**periodo.model_dump())
    db.add(_periodo)
    db.commit()
    db.refresh(_periodo)
    return _periodo


def listar_periodos(db: Session) -> List[schemas.Periodo]:
    return db.scalars(select(Periodo)).all()


def leer_periodo(db: Session, periodo_id: int) -> schemas.Periodo:
    db_periodo = db.scalar(select(Periodo).where(Periodo.id == periodo_id))
    if db_periodo is None:
        raise exceptions.PeriodoNoEncontrado()
    return db_periodo














