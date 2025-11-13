from pydantic import BaseModel
from datetime import date
from src.periodos.models import CuatrimestreEnum
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class PeriodoBase(BaseModel):
    pass

class PeriodoCreate(PeriodoBase):
    ciclo_lectivo: int
    cuatrimestre: CuatrimestreEnum
    fecha_apertura_encuestas: date
    fecha_cierre_encuestas: date
    fecha_apertura_informesAC: date
    fecha_cierre_informesAC: date
    
    pass

class PeriodoUpdate(PeriodoBase):
    pass

class PeriodoDelete(BaseModel):
    id: int


class Periodo(PeriodoBase):
    id: int
    ciclo_lectivo: int
    cuatrimestre: CuatrimestreEnum
    fecha_apertura_encuestas: date
    fecha_cierre_encuestas: date
    fecha_apertura_informesAC: date
    fecha_cierre_informesAC: date
    
    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}


