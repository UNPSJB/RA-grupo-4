from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum

class SedeEnum(str, Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSinteticoBase(BaseModel):
    periodo: str
    sede: SedeEnum
    integrantes: Optional[str] = None
    departamento_id: int
    # Campos opcionales que podrían venir llenos desde el front al crear
    comentarios: Optional[str] = None
    resumen_general: Optional[List[Dict[str, Any]]] = None
    resumen_necesidades: Optional[List[Dict[str, Any]]] = None
    valoracion_miembros: Optional[List[Dict[str, Any]]] = None
    observaciones_actividades: Optional[List[Dict[str, Any]]] = None

class InformeSinteticoCreate(InformeSinteticoBase):
    pass


class InformeSinteticoUpdate(InformeSinteticoBase):
    pass


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
