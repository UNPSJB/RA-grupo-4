from pydantic import BaseModel
from datetime import date

class MateriaBase(BaseModel):
    nombre: str
    id_materia: int

class MateriaCreate(MateriaBase):
    anio:int

class MateriaUpdate(MateriaBase):
    anio: int  

class Materia(MateriaBase):
    anio: int  
    model_config = {"from_attributes": True}

