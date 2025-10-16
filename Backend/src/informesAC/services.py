from typing import List
from sqlalchemy.orm import Session
from src.informesAC.models import InformesAC
from src.informesAC import exceptions, models

def listar_todos_los_informes(db: Session):
    return db.query(models.InformesAC).all()

def filtrar_informes(
    db: Session,
    id_docente: int | None = None,
    id_materia: int | None = None,
    id_carrera: int | None = None
):
    query = db.query(InformesAC)

    if id_docente is not None:
        query = query.filter(InformesAC.id_docente == id_docente)

    if id_materia is not None:
        query = query.filter(InformesAC.id_materia == id_materia)
        
    if id_carrera is not None:
        query = query.filter(InformesAC.id_carrera == id_carrera)

    return query.all()
