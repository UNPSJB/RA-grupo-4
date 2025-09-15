from pydantic import BaseModel, Field
from typing import List, Optional

# Base común para Encuesta
class EncuestaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)



# Crear Encuesta
class EncuestaCreate(EncuestaBase):
    preguntas: List[str] = Field(default_factory=list)
   


# Actualizar Encuesta
class EncuestaUpdate(EncuestaBase):
    preguntas: Optional[List[str]] = None
 

# Leer Encuesta (respuesta completa)
class Encuesta(EncuestaBase):
    id_encuesta: int
    preguntas: List["Pregunta"]

    model_config = {"from_attributes": True}


# Eliminar Encuesta
class EncuestaDelete(BaseModel):
    id_encuesta: int
    nombre: str


# Schema para Pregunta
class Pregunta(BaseModel):
    id: int
    texto: str

    model_config = {"from_attributes": True}
