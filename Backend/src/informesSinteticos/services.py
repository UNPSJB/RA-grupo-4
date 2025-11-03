from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.informesSinteticos import schemas, models
from src.informesSinteticos.models import InformeSintetico

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate):
    nuevo_informe = models.InformeSintetico(**informe.dict())
    db.add(nuevo_informe)
    db.commit()
    db.refresh(nuevo_informe)
    return nuevo_informe

def listar_informesSinteticos(db: Session,) -> List[schemas.InformeSintetico]:
    return db.query(InformeSintetico).all()

def obtener_informe_sintetico(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()
