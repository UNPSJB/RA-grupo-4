from __future__ import annotations
from pydantic import BaseModel
from typing import Optional, List
# Los imports de 'InformeSintetico' y 'Materia' se mueven al final
# para romper la dependencia circular.

# ------------------------------------------------------------
# Departamento
# ------------------------------------------------------------

class DepartamentoBase(BaseModel):
    nombre: str
    id: int

    model_config = {"from_attributes": True}
    
class DepartamentoCreate(DepartamentoBase):
    pass


class DepartamentoUpdate(DepartamentoBase):
    pass


# ✅ Evitamos ciclo: las materias se representan con MateriaOut (sin subreferencias)
class Departamento(BaseModel):
    id: int
    nombre: str
    materias: Optional[List["MateriaOut"]] = None
    #informesSinteticos: Optional[List["InformeSinteticoOut"]] = None

    model_config = {"from_attributes": True}


class DepartamentoDelete(DepartamentoBase):
    id: int

#Schema de santi, verificar como funciona para conectar todo. borrar despues
class DepartamentoSimple(BaseModel):
    id: int
    nombre: str
    model_config = {"from_attributes": True}


from src.informesSinteticos.schemas import InformeSintetico  #se podria borrar
from src.materias.schemas import MateriaOut
Departamento.model_rebuild()