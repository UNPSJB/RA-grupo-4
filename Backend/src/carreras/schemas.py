from pydantic import BaseModel
from typing import List
from src.materias.schemas import Materia

class CarrerasBase(BaseModel):
    nombre: str

class CarrerasCreate(CarrerasBase):
    pass

class CarrerasUpdate(CarrerasBase):
    pass

class Carreras(CarrerasBase):
    id_carrera: int
    materias: List[Materia] = []
    model_config = {"from_attributes": True}
