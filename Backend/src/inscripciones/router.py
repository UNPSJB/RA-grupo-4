from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services 
from typing import List

router = APIRouter(prefix="/inscripciones", tags=["Inscripciones"])


@router.get("/", response_model=List[schemas.Inscripcion])
def leer_materias(db: Session = Depends(get_db)):
    return services.get_inscripciones(db)


