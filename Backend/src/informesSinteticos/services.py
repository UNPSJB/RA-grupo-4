from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.informesSinteticos import schemas 
from src.informesSinteticos.models import InformeSintetico


def listar_informesSinteticos(db: Session,) -> List[schemas.InformeSintetico]:
    return db.query(InformeSintetico).all()
