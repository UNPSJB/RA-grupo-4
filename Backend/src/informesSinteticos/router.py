from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from typing import List
from src.informesSinteticos.models import InformeSintetico
from src.informesSinteticos import schemas, services

router = APIRouter(prefix="/informesSinteticos", tags=["informesSinteticos"])

# Rutas para Informes Sinteticos

@router.get("/{informeSintetico_id}/informesSinteticos", response_model=List[schemas.InformeSintetico])
def leer_informesSinteticos(db: Session = Depends(get_db)):
    return services.listar_informesSinteticos(db)


