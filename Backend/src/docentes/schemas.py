from pydantic import BaseModel
from typing import List, Optional, Dict
from src.materias.schemas import MateriaBase

class DocenteBase(BaseModel):
    nroLegajo: int
    nombre: str

class DocenteCreate(DocenteBase):
    pass


class Docente(DocenteBase):
    id_docente: int
    class Config:
        from_attributes = True


class PromedioPeriodo(BaseModel):
    periodo: str       
    promedio: Optional[float]
    totalMaterias: int
    valores: Dict[str, int]
class DocenteEstadisticaPromedio(BaseModel):
    id_docente: int
    nombre: str
    nroLegajo: int

    cantidadMateriasDictadas: int
    
    primerPeriodoDictado: Optional[str]
    
    ultimoPeriodoDictado: Optional[str]
    promedioUltimoPeriodo: Optional[float]

    promedioGeneral: Optional[float]

    promedioPeriodos: List[PromedioPeriodo]

    class Config:
        from_attributes = True   