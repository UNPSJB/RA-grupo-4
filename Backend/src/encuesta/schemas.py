from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional
from src.secciones.schemas import Seccion



class EncuestaBase(BaseModel):
    nombre: str 
    disponible: bool = Field(default=False)

# Crear Encuesta
class EncuestaCreate(EncuestaBase):
    secciones: Optional[List[Seccion]] = []


# Actualizar Encuesta
class EncuestaUpdate(EncuestaBase):
    secciones: Optional[List[Seccion]] = []


# Leer Encuesta 
class Encuesta(EncuestaBase):
    id_encuesta: int
    secciones: List[Seccion] = []

    model_config = {"from_attributes": True}

# Eliminar Encuesta
class EncuestaDelete(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool

class EncuestaDisponible(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool
    materia_id: int
    materia_nombre: str 

    model_config = {"from_attributes": True}


EncuestaCreate.model_rebuild()
EncuestaUpdate.model_rebuild()
Encuesta.model_rebuild()