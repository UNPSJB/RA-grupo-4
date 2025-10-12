from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.estudiantes import schemas, services
from src.encuesta.schemas import Encuesta
from typing import List

router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])

# Rutas para Estudiantes
    
@router.get("/{estudiante_id}/encuestas", response_model=List[Encuesta])
def leer_encuestas_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return services.listar_encuestas(db, estudiante_id)


@router.get("/{estudiante_id}/encuestas/{encuesta_id}/preguntas", response_model=Encuesta)
def ver_preguntas_encuesta_estudiante(estudiante_id: int, encuesta_id: int, db: Session = Depends(get_db)):
    encuesta = services.obtener_preguntas_de_encuesta_estudiante(db, estudiante_id, encuesta_id)
    return encuesta

