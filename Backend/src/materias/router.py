from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services 
from typing import List

router = APIRouter(prefix="/materias", tags=["Materias"])


@router.get("/", response_model=List[schemas.Materia])
def leer_materias(db: Session = Depends(get_db)):
    return services.get_materias(db)

@router.get("/todos")
def listar_materias(db: Session = Depends(get_db)):
    return db.query(models.Materias).all()


