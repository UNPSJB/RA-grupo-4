from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services 
from typing import List

router = APIRouter(prefix="/carreras", tags=["Carreras"])


@router.get("/todos")
def listar_carreras(db: Session = Depends(get_db)):
    return db.query(models.Carreras).all()