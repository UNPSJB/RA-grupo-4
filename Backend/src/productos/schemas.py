from pydantic import BaseModel, field_validator
from src.productos.models import TipoMasa
from src.productos import exceptions
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class ProductoBase(BaseModel):
    nombre: str
    precio: float
    masa: TipoMasa


# ----Este metodo no es necesario, pydantic ya detecta la validacion en el tipo enumerado creado--------

    # @field_validator("masa", mode="before")
    # @classmethod
    # def is_valid_tipo_masa(cls, v: str) -> str:
    #     if v.lower() not in TipoMasa:
    #         raise exceptions.TipoMasaInvalido(list(TipoMasa))
    #     return v.lower()

class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(ProductoBase):
    pass


class Producto(ProductoBase):
    id: int

    # from_atributes=True permite que Pydantic trabaje con modelos SQLAlchemy
    # más info.: https://docs.pydantic.dev/latest/api/config/#pydantic.config.ConfigDict.from_attributes
    model_config = {"from_attributes": True}
