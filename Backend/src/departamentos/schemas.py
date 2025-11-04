from __future__ import annotations
from pydantic import BaseModel
from typing import List, Optional

# ------------------------------------------------------------
# Departamento
# ------------------------------------------------------------

class DepartamentoBase(BaseModel):
    nombre: str


class DepartamentoCreate(DepartamentoBase):
    pass


class DepartamentoUpdate(DepartamentoBase):
    pass


# ✅ Evitamos ciclo: las materias se representan con MateriaOut (sin subreferencias)
class Departamento(BaseModel):
    id: int
    nombre: str
    materias: Optional[List["MateriaOut"]] = None

    class Config:
        from_attributes = True


class DepartamentoDelete(DepartamentoBase):
    id: int

from src.materias.schemas import MateriaOut
Departamento.model_rebuild()
