from pydantic import BaseModel
from typing import List, Optional
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class OpcionRespuestaBase(BaseModel):
    descripcion: str

class OpcionRespuestaCreate(OpcionRespuestaBase):
    pass
class OpcionRespuestaUpdate(OpcionRespuestaBase):
    pass

class OpcionRespuestaDelete(BaseModel):
    id: int
    Pregunta_id: int

class OpcionRespuesta(OpcionRespuestaBase):
    id: int
    pregunta_id: int

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}




class RespuestaBase(BaseModel):
    pregunta_id: int
    inscripcion_id: int
    opcion_respuesta_id: Optional[int] = None
    respuesta_abierta: Optional[str] = None

class RespuestaCreate(RespuestaBase):
    pass

class RespuestaUpdate(BaseModel):
    opcion_respuesta_id: Optional[int] = None
    respuesta_abierta: Optional[str] = None

class RespuestaDelete(BaseModel):
    pass

class Respuesta(RespuestaBase):
    id: int
    
    model_config = {"from_attributes": True}