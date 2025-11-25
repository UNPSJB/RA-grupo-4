from __future__ import annotations
from pydantic import BaseModel, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime  # <--- AGREGADO: Necesario para las fechas del historial
from src.periodos.schemas import Periodo as PeriodoSchema

class SedeEnum(str, Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSinteticoBase(BaseModel):
    descripcion: str
    periodo_id: int
    sede: SedeEnum
    integrantes: Optional[str] = None
    departamento_id: int
    # Campos opcionales que podrían venir llenos desde el front al crear
    comentarios: Optional[str] = None
    resumen_general: Optional[List[Dict[str, Any]]] = None
    resumen_necesidades: Optional[List[Dict[str, Any]]] = None
    valoracion_miembros: Optional[List[Dict[str, Any]]] = None
    #observaciones_actividades: Optional[List[Dict[str, Any]]] = None

class InformeSinteticoCreate(InformeSinteticoBase):
    pass

class InformeSinteticoUpdate(InformeSinteticoBase):
    pass

class InformeSintetico(InformeSinteticoBase):
#class InformeSintetico(BaseModel):
    id: int
    descripcion: str
    periodo_id: int
    periodo: PeriodoSchema
    #periodo: str
    sede: SedeEnum
    integrantes: str
    departamento_id: int
    departamento_nombre: Optional[str] = None
    #departamento: "Departamento"    #genera importacion circular, si se necesita cambiarlo por un schema alterno de departamento, que no incluya informeSintetico

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


#schema para previzualizacion
class InformeSinteticoDetail(BaseModel):
    id: int
    descripcion: str
    periodo_id: int
    periodo: PeriodoSchema
    sede: SedeEnum
    integrantes: Optional[str] = None
    departamento_id: int
    # Campo calculado o unido (asegúrate de que tu servicio/modelo lo llene)
    departamento_nombre: Optional[str] = None 
    # Campos de contenido largo (JSON en la BD)
    comentarios: Optional[str] = None
    resumen_general: Optional[List[Dict[str, Any]]] = None
    resumen_necesidades: Optional[List[Dict[str, Any]]] = None
    valoracion_miembros: Optional[List[Dict[str, Any]]] = None
    # Si tienes más campos JSON, agrégalos aquí

    model_config = ConfigDict(from_attributes=True)

# Schema para recibir la petición de generar snapshot
class GenerarSnapshotRequest(BaseModel):
    departamento_id: int
    periodo_id: int
    usuario: Optional[str] = "Sistema"

# Schema para mostrar en la lista del historial 
class HistorialInformeSinteticoOut(BaseModel):
    id: int
    fecha_generacion: datetime
    anio_lectivo: int
    cuatrimestre: str
    departamento_id: int
    nombre_departamento: Optional[str] = None
    usuario_generador: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# Schema para ver el detalle completo (con el JSON)
class HistorialInformeSinteticoDetalle(HistorialInformeSinteticoOut):
    datos_json: str 


# --- CORRECCIÓN IMPORTACIÓN CIRCULAR ---
from src.departamentos.schemas import Departamento 

InformeSintetico.model_rebuild()