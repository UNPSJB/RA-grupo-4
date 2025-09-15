from pydantic import BaseModel
from typing import List, Optional
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class OpcionRespuestaBase(BaseModel):
    descripcion: str

class OpcionRespuestaCreate(OpcionRespuestaBase):
    pregunta_id: int

class OpcionRespuestaUpdate(OpcionRespuestaBase):
    pass

class OpcionRespuestaDelete(BaseModel):
    id: int
    Pregunta_id: int

class OpcionRespuesta(OpcionRespuestaBase):
    id: int
    pregunta_id: int
    pregunta_enunciado: str

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}