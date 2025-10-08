from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services

router = APIRouter(prefix="/informesAC", tags=["InformesAC"])

@router.get("/", response_model=List[schemas.InformeAC])
def listar_informes(db: Session = Depends(get_db)):
    service = services.InformeACService(db)
    return service.obtener_historial_completo()
