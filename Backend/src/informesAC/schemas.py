from pydantic import BaseModel
from typing import Optional, List # Importación de List

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
    
    necesidades_equipamiento: List[str]
    necesidades_bibliografia: List[str]




class InformeAC(BaseModel):
    id_informesAC: int
    sede: str
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None

    docente: DocenteOut
    materia: MateriaOut
    
    # Estos campos se poblarán desde el modelo
    necesidades_equipamiento: Optional[List[str]] = None
    necesidades_bibliografia: Optional[List[str]] = None

    class Config:
        orm_mode = True