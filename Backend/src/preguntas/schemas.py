from pydantic import BaseModel
from typing import List, Optional
from src.preguntas.models import TipoPregunta
from src.respuestas.schemas import OpcionRespuesta, OpcionRespuestaCreate, OpcionRespuestaDelete
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class PreguntaBase(BaseModel):
    enunciado: str


class PreguntaCreate(PreguntaBase):
    tipo: TipoPregunta
    obligatoria: bool
    opciones_respuestas: Optional[List[OpcionRespuestaCreate]]


class PreguntaUpdate(PreguntaBase):
    pass

class PreguntaDelete(BaseModel):
    id: int
    opciones_respuestas: Optional[List[OpcionRespuesta]]



class Pregunta(PreguntaBase):
    id: int
    tipo: TipoPregunta
    obligatoria: bool
    opciones_respuestas: Optional[List[OpcionRespuesta]]

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}


