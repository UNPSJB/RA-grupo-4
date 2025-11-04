from __future__ import annotations
from pydantic import BaseModel
from enum import Enum

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


# ✅ solo mostramos el id + nombre del departamento, no todo el objeto
class InformeSintetico(BaseModel):
    id: int
    descripcion: str
    periodo: str
    sede: SedeEnum
    integrantes: str
    departamento_id: int
    departamento_nombre: Optional[str] = None

    class Config:
        from_attributes = True


class InformeSinteticoResponse(InformeSinteticoBase):
    id: int
    departamento_nombre: str

    class Config:
        orm_mode = True
