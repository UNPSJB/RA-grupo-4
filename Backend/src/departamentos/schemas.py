from pydantic import BaseModel
from src.departamentos import exceptions
from typing import Optional, List
from src.informesSinteticos.schemas import InformeSintetico
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class DepartamentoBase(BaseModel):
    nombre: str


class DepartamentoCreate(DepartamentoBase):
    pass

class DepartamentoUpdate(DepartamentoBase):
    pass


class Departamento(DepartamentoBase):
    id: int
    informesSinteticos: List[InformeSintetico] = []

    model_config = {"from_attributes": True}


class DepartamentoDelete(DepartamentoBase):
    id: int
