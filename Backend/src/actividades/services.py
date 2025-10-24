from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas 

def create_actividad(db: Session, actividad: schemas.ActividadCreate) -> models.Actividades:
    db_actividad = models.Actividades(**actividad.model_dump())
    
    db.add(db_actividad)
    db.commit()
    db.refresh(db_actividad)
    return db_actividad

