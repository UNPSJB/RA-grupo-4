from pydantic import BaseModel, field_validator
from src.materias.models import Materias
from src.materias import exceptions


class MateriaBase(BaseModel):
    nombre: str
    id_materia: int


class MateriaCreate(MateriaBase):
    pass


class MateriaUpdate(MateriaBase):
    pass


class Materia(MateriaBase):
    id_materia: int
    model_config = {"from_attributes": True}
