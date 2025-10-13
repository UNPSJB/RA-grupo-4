from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services, models  

from typing import List

router = APIRouter(prefix="/docentes", tags=["Docentes"])

@router.get("/todos")
def listar_docentes(db: Session = Depends(get_db)):
    return db.query(models.Docentes).all()
