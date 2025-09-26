from pydantic import BaseModel, Field
from typing import List, Optional
from src.preguntas.schemas import Pregunta
# Base común para Encuesta
class EncuestaBase(BaseModel):
    nombre: str #= Field(..., min_length=1, max_length=100)
    disponible: bool = Field(default=False)

# Crear Encuesta
class EncuestaCreate(EncuestaBase):
    preguntas: Optional[List[Pregunta]]  = []



# Actualizar Encuesta
class EncuestaUpdate(EncuestaBase):
    preguntas: Optional[List[Pregunta]]  = []


# Leer Encuesta (respuesta completa)
class Encuesta(EncuestaBase):
    id_encuesta: int
    preguntas: List[Pregunta] = []

    model_config = {"from_attributes": True}

# Eliminar Encuesta
class EncuestaDelete(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool