from pydantic import BaseModel, field_validator
#from src.departamentos.schemas import Departamento

# from src.departamentos.schemas import Departamento
# Los siguientes schemas contienen atributos sin muchas restricciones de tipo.
# Podemos crear atributos con ciertas reglas mediante el uso de un "Field" adecuado.
# https://docs.pydantic.dev/latest/concepts/fields/


class InformeSinteticoBase(BaseModel):
    pass



class InformeSinteticoCreate(InformeSinteticoBase):
    pass


class InformeSinteticoUpdate(InformeSinteticoBase):
    pass


class InformeSintetico(InformeSinteticoBase):
    id: int
    descripcion: str
    departamento_id: int
#    departamento: Departamento     # genera importacion circular 

    model_config = {"from_attributes": True}
