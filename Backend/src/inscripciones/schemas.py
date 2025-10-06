from pydantic import BaseModel, field_validator
from src.inscripciones.models import Inscripciones
from src.inscripciones import exceptions


class InscripcionBase(BaseModel):
    id_materia: int


class InscripcionCreate(InscripcionBase):
    pass


class InscripcionUpdate(InscripcionBase):
    pass


class Inscripcion(InscripcionBase):
    id_materia: int
    model_config = {"from_attributes": True}
