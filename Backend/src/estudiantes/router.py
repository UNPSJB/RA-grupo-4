from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.estudiantes import schemas, services
from src.encuestas.schemas import Encuesta  

router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])

# Rutas para Estudiantes

@router.get("/{estudiante_id}/encuestas", response_model=list[Encuesta])
def leer_encuestas_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return services.listar_encuestas(db, estudiante_id)


