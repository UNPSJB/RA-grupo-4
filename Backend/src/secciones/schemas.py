from pydantic import BaseModel
from typing import List, Optional 
from src.preguntas.schemas import Pregunta
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class SeccionBase(BaseModel):
    enunciado: str


class SeccionCreate(SeccionBase):
    encuesta_id: int

class SeccionUpdate(SeccionBase):
    pass

class SeccionDelete(BaseModel):
    id: int


class Seccion(SeccionBase):
    id: int
    encuesta_id: int
    preguntas: Optional[List[Pregunta]] = []

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}


