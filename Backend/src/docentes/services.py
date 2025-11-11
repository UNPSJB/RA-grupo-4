from sqlalchemy.orm import Session
from typing import List
from . import models

def get_all_docentes(db: Session) -> List[models.Docentes]:
    return db.query(models.Docentes).all()