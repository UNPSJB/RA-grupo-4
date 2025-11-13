from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.periodos import schemas, services

router = APIRouter(prefix="/periodos", tags=["periodos"])

# Rutas para Periodos

@router.post("/", response_model=schemas.Periodo)
def create_periodo(periodo: schemas.PeriodoCreate, db: Session = Depends(get_db)):
    return services.crear_periodo(db, periodo)


@router.get("/", response_model=list[schemas.Periodo])
def read_periodos(db: Session = Depends(get_db)):
    return services.listar_periodos(db)


@router.get("/{periodo_id}", response_model=schemas.Periodo)
def read_periodo(periodo_id: int, db: Session = Depends(get_db)):
    return services.leer_periodo(db, periodo_id)
