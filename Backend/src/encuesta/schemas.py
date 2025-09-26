from pydantic import BaseModel, Field

# Base comun para Encuesta
class EncuestaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    disponible: bool = Field(default=False)

# Crear Encuesta
class EncuestaCreate(EncuestaBase):
    pass

# Actualizar Encuesta
class EncuestaUpdate(EncuestaBase):
    pass

# Leer Encuesta
class Encuesta(EncuestaBase):
    id_encuesta: int

    model_config = {"from_attributes": True}

# Eliminar Encuesta
class EncuestaDelete(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool