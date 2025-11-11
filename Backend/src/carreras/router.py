from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services, models
from typing import List

router = APIRouter(prefix="/carreras", tags=["Carreras"])


@router.get("/listar")
def listar_carreras(db: Session = Depends(get_db)):
    return db.query(models.Carreras).all()