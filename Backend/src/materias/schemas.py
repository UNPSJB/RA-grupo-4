from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional

# ------------------------------------------------------------
# Materia (Base y derivadas)
# ------------------------------------------------------------

class MateriaBase(BaseModel):
    nombre: str
    id_materia: int
    codigoMateria: str

class MateriaCreate(MateriaBase):
    anio: int

class MateriaUpdate(MateriaBase):
    anio: int


class MateriaSimple(MateriaBase):
    anio: int
    id_departamento: int
    id_docente: int
    cantidad_inscripciones: int
    model_config = {"from_attributes": True}

class Materia(BaseModel):
    id_materia: int
    nombre: str
    anio: int
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
    anio: int
    id_docente: int
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