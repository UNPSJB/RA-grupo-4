from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional
from src.periodos.schemas import Periodo as PeriodoSchema 

# ------------------------------------------------------------
# Materia (Base y derivadas)
# ------------------------------------------------------------

class MateriaBase(BaseModel):
    nombre: str
    id_materia: int
    codigoMateria: str

class MateriaCreate(MateriaBase):
    pass

class MateriaUpdate(MateriaBase):
    pass


class MateriaSimple(MateriaBase):
    periodo: PeriodoSchema
    id_departamento: int
    id_docente: int
    cantidad_inscripciones: int
    model_config = {"from_attributes": True}

class Materia(BaseModel):
    id_materia: int
    nombre: str
    periodo: PeriodoSchema
    codigoMateria: str
    id_departamento: int

    class Config:
        from_attributes = True


class MateriaOut(Materia):
    pass


class MateriaAutocompletar(BaseModel):
    id_materia: int
    nombre: str
    codigoMateria: str
    id_periodo: int
    ciclo_lectivo: int
    cuatrimestre: str
    id_docente: int
    informeACCompletado: bool
    cantidad_inscripciones: int


class MateriaEstadisticas(BaseModel):
    total_inscriptos: int
    total_encuestas_procesadas: int

    class Config:
        from_attributes = True


class MateriaEstadisticaItem(BaseModel):
    id_materia: int
    nombre_materia: str
    total_inscriptos: int
    total_encuestas_procesadas: int


class EstadisticasDocenteOut(BaseModel):
    estadisticas: List[MateriaEstadisticaItem]

class NecesidadMateriaSchema(BaseModel):
    id_materia: int
    nombre_materia: str
    codigo_materia: str
    necesidad_equipamiento: Optional[str] = None
    necesidad_bibliografia: Optional[str] = None

    class Config:
        from_attributes = True

class MateriaPendiente(BaseModel): 
    id_materia: int
    nombre: str
    codigoMateria: str
    periodo: PeriodoSchema
    
    class Config:
        from_attributes = True
