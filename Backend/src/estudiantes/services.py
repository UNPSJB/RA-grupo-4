from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.estudiantes.models import Estudiante
from src.estudiantes import schemas, exceptions

# operaciones CRUD para Estudiantes

def listar_encuestas(db: Session, estudiante_id: int) -> schemas.Estudiante:
    db_estudiante = db.scalar(select(Estudiante).where(Estudiante.id == estudiante_id))
    if db_estudiante is None:
        raise exceptions.UsuarioNoEncontrado()
    return db_estudiante.encuestas

