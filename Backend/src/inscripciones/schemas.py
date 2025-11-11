from pydantic import BaseModel, field_validator
from typing import Optional, List
from src.inscripciones.models import Inscripciones
from src.inscripciones import exceptions
from src.respuestas.schemas import Respuesta

class InscripcionBase(BaseModel):
    id_materia: int


class InscripcionCreate(InscripcionBase):
    pass


class InscripcionUpdate(InscripcionBase):
    pass


class Inscripcion(InscripcionBase):
    estudiante_id: int
    respuestas: Optional[List[Respuesta]] = []
    model_config = {"from_attributes": True}
