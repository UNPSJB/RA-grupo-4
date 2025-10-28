from pydantic import BaseModel, Field 
from typing import List, Optional 


class MateriaBase(BaseModel):
    nombre: str
    id_materia: int
    codigoMateria: str  

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
    codigoMateria: str  
    model_config = {"from_attributes": True}

class MateriaAutocompletar(BaseModel):
    id_materia: int
    nombre: str
    codigoMateria: str 
    anio: int
    id_docente: int
    cantidad_inscripciones: int


class MateriaEstadisticas(BaseModel):
    total_inscriptos: int
    total_encuestas_procesadas: int
    model_config = {"from_attributes": True}


class MateriaEstadisticaItem(BaseModel):
    id_materia: int
    nombre_materia: str
    codigoMateria: str  
    total_inscriptos: int
    total_encuestas_procesadas: int

class EstadisticasDocenteOut(BaseModel):
    estadisticas: List[MateriaEstadisticaItem]