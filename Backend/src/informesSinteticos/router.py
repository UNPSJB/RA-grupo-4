from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesSinteticos import schemas, services

router = APIRouter(prefix="/informes-sinteticos", tags=["Informes Sintéticos"])


@router.post("/", response_model=schemas.InformeSintetico)
def crear_informe_sintetico(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)


@router.get("/", response_model=List[schemas.InformeSintetico])
def leer_informesSinteticos(db: Session = Depends(get_db)):
    return services.listar_informesSinteticos(db)


@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def obtener_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    informe = services.obtener_informe_sintetico(db, informe_id)
    if not informe:
        raise HTTPException(status_code=404, detail="Informe Sintético no encontrado")
    return informe




