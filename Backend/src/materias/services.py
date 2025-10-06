from sqlalchemy.orm import Session
from typing import List
from . import models


def get_materias(db: Session) -> List[models.Materias]:

    #Obtiene y retorna una lista de todas las materias existentes.

    return db.query(models.Materias).all()

