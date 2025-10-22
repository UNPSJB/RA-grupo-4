from pydantic import BaseModel


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

class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    anio: int

    class Config:
     
        orm_mode = True
class MateriaAutocompletar(BaseModel):
    id_materia: int
    nombre: str
    anio: int
    id_docente: int
    cantidad_inscripciones: int