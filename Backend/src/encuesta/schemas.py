from pydantic import BaseModel, Field
from typing import List, Optional
from src.preguntas.schemas import Pregunta


class EncuestaBase(BaseModel):
    nombre: str 
    disponible: bool = Field(default=False)

# Crear Encuesta
class EncuestaCreate(EncuestaBase):
    preguntas: Optional[List[Pregunta]] = []


# Actualizar Encuesta
class EncuestaUpdate(EncuestaBase):
    preguntas: Optional[List[Pregunta]] = []


# Leer Encuesta 
class Encuesta(EncuestaBase):
    id_encuesta: int
    preguntas: List[Pregunta] = []

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