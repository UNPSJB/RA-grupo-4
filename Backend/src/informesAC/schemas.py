from pydantic import BaseModel
from typing import Optional

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

class InformeACCreate(BaseModel):
    id_docente: int
    id_materia: int
    sede: str
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None

class InformeAC(BaseModel):
    id_informesAC: int
    sede: str
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None

    docente: DocenteOut
    materia: MateriaOut

    class Config:
        orm_mode = True