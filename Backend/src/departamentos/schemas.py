from __future__ import annotations
from pydantic import BaseModel
from src.departamentos import exceptions
from typing import Optional, List
# Los imports de 'InformeSintetico' y 'Materia' se mueven al final
# para romper la dependencia circular.


class DepartamentoBase(BaseModel):
    nombre: str


class DepartamentoCreate(DepartamentoBase):
    pass

class DepartamentoUpdate(DepartamentoBase):
    pass


class Departamento(DepartamentoBase):
    id: int
    informesSinteticos: List["InformeSintetico"] = []
    materias: List["Materia"] = []

    model_config = {"from_attributes": True}


class DepartamentoDelete(DepartamentoBase):
    id: int

# --- NUEVO SCHEMA PARA SOLUCIONAR ERROR 500 (RECURSIÓN) ---
# Se añade este schema simple. El endpoint GET /departamentos/
# (que es para el dropdown del frontend) solo necesita id y nombre.
# Usar 'schemas.Departamento' completo (como estaba antes) causa el bucle de recursión
# (Departamento -> Materias -> Departamento).
class DepartamentoSimple(BaseModel):
    id: int
    nombre: str
    model_config = {"from_attributes": True}


from src.informesSinteticos.schemas import InformeSintetico  
from src.materias.schemas import Materia 


Departamento.model_rebuild()