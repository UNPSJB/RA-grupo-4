from __future__ import annotations
from pydantic import BaseModel, field_validator
from enum import Enum
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class SedeEnum(str, Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSinteticoBase(BaseModel):
    descripcion: str
    periodo: str
    sede: SedeEnum
    integrantes: str
    departamento_id: int

class InformeSinteticoCreate(InformeSinteticoBase):
    pass


class InformeSinteticoUpdate(InformeSinteticoBase):
    pass


class InformeSintetico(InformeSinteticoBase):
    id: int
    departamento: Departamento

    class Config:
        from_attributes = True


class InformeSinteticoResponse(InformeSinteticoBase):
    id: int
    departamento_nombre: str

    class Config:
        orm_mode = True

from src.departamentos.schemas import Departamento  
InformeSintetico.model_rebuild()