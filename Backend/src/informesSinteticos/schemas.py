from __future__ import annotations
from pydantic import BaseModel, field_validator, ConfigDict
from enum import Enum
from typing import List, Optional, Dict

# --- ESQUEMAS PARA LA GESTIÓN DEL INFORME SINTÉTICO ---

class SedeEnum(str, Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSinteticoBase(BaseModel):
    descripcion: str
    periodo: str
    sede: SedeEnum
    integrantes: str
    departamento_id: int

class InformeSinteticoCreate(InformeSinteticoBase):
    pass

class InformeSinteticoUpdate(InformeSinteticoBase):
    pass

class InformeSintetico(InformeSinteticoBase):
    id: int
    departamento: "Departamento" 

    class Config:
        from_attributes = True

class InformeSinteticoResponse(InformeSinteticoBase):
    id: int
    departamento_nombre: str

    class Config:
        orm_mode = True


class ActividadParaInformeRow(BaseModel):
    """
    Representa UNA SOLA fila de la tabla de actividades.
    No se consolida, se muestra CADA actividad registrada.
    """
    # Datos de la Materia (Espacio Curricular)
    codigoMateria: str
    nombreMateria: str
    
    # Datos del Docente
    integranteCatedra: str 
    
    # Datos de las actividades 
    capacitacion: Optional[str] = None 
    investigacion: Optional[str] = None 
    extension: Optional[str] = None 
    gestion: Optional[str] = None 
    
    observacionComentarios: Optional[str] = None 

    model_config = ConfigDict(from_attributes=True) 


class InformeSinteticoActividades(BaseModel):
    """
    La respuesta final del endpoint de actividades.
    Es una lista de filas individuales.
    """
    registros: List[ActividadParaInformeRow]

# --- CORRECCIÓN IMPORTACIÓN CIRCULAR ---
from src.departamentos.schemas import Departamento 

InformeSintetico.model_rebuild()