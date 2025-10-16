from pydantic import BaseModel
from datetime import date

class DocenteOut(BaseModel):
    id_docente: int
    nombre: str


    class Config:
        orm_mode = True

class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    anio: int

    class Config:
        orm_mode = True

class InformeAC(BaseModel):
    id_informesAC: int
    docente: DocenteOut
    materia: MateriaOut

    class Config:
        orm_mode = True
