from pydantic import BaseModel, ConfigDict
from typing import Optional

class ActividadBase(BaseModel):
    integranteCatedra: Optional[str] = None
    capacitacion: Optional[str] = None
    investigacion: Optional[str] = None
    extension: Optional[str] = None
    gestion: Optional[str] = None
    observacionComentarios: Optional[str] = None

class ActividadCreate(ActividadBase):
    id_informeAC: int 

class ActividadOut(ActividadBase):
    id_actividades: int
    id_informeAC: int  

    model_config = {"from_attributes": True} 