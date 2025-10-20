from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services
from typing import List

router = APIRouter(prefix="/materias", tags=["Materias"])

@router.get("/", response_model=List[schemas.Materia])
def leer_materias(db: Session = Depends(get_db)):
    """
    Lista todas las materias existentes en la base de datos.
    """
    return services.get_materias(db)


@router.get(
    "/{materia_id}/estadisticas", response_model=schemas.MateriaEstadisticas
)

def leer_estadisticas_materia(materia_id: int, db: Session = Depends(get_db)):
    """
    Obtiene la cantidad de inscriptos y la cantidad de encuestas
    procesadas (respondidas) para una materia específica.
    """
    estadisticas = services.get_estadisticas_materia(db=db, materia_id=materia_id)
    return estadisticas