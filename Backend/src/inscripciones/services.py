from sqlalchemy.orm import Session
from typing import List
from . import models


def get_inscripciones(db: Session) -> List[models.Inscripciones]:

    #Obtiene y retorna una lista de todas las materias existentes.

    return db.query(models.Inscripciones).all()

