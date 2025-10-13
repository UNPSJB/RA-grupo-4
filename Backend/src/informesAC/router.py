from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services

router = APIRouter(prefix="/informesAC", tags=["InformesAC"])


@router.get("/", response_model=List[schemas.InformeAC])
def listar_informes(db: Session = Depends(get_db)):
    #Devuelve el historial completo de informes curriculares.
    service = services.InformeACService(db)
    return service.obtener_historial_completo()


@router.get("/docente/{id_docente}", response_model=List[schemas.InformeAC])
def listar_informes_por_docente(id_docente: int, db: Session = Depends(get_db)):
    #Devuelve todos los informes curriculares asociados a un docente específico.
    service = services.InformeACService(db)
    return service.obtener_informes_por_docente(id_docente)
