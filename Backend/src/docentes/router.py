from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db 
from . import schemas, services 
from typing import List

router = APIRouter(prefix="/docentes", tags=["Docentes"])


