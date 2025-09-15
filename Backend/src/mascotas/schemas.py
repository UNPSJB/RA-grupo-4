from pydantic import BaseModel, field_validator
from src.mascotas.models import TipoMascota
from src.mascotas import exceptions

# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class MascotaBase(BaseModel):
    nombre: str
    tipo: TipoMascota  # solo permitiremos valores de este tipo.

    @field_validator("tipo", mode="before")
    @classmethod
    def is_valid_tipo_mascota(cls, v: str) -> str:
        if v.lower() not in TipoMascota:
            raise exceptions.TipoMascotaInvalido(list(TipoMascota))
        return v.lower()


class MascotaCreate(MascotaBase):
    tutor_id: int


class MascotaUpdate(MascotaBase):
    pass


class Mascota(MascotaBase):
    id: int
    tipo: TipoMascota
    tutor_id: int
    nombre_tutor: str

    model_config = {"from_attributes": True}


class MascotaDelete(MascotaBase):
    id: int
    tutor_id: int
