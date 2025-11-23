from __future__ import annotations
from pydantic import BaseModel, Field
from typing import List, Optional
from src.secciones.schemas import Seccion

class EncuestaBase(BaseModel):
    nombre: str 
    disponible: bool = Field(default=False)

class EncuestaCreate(EncuestaBase):
    secciones: Optional[List[Seccion]] = []

class EncuestaUpdate(EncuestaBase):
    secciones: Optional[List[Seccion]] = []

class Encuesta(EncuestaBase):
    id_encuesta: int
    secciones: List[Seccion] = []
    model_config = {"from_attributes": True}

class EncuestaDelete(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool

class EncuestaDisponible(BaseModel):
    id_encuesta: int
    nombre: str
    disponible: bool
    materia_id: int
    materia_nombre: str 
    inscripcion_id: int 
    model_config = {"from_attributes": True}

class OpcionRespuestaStat(BaseModel):
    descripcion: str
    cantidad: int
    porcentaje: float

class PreguntaStat(BaseModel):
    pregunta_id: int
    enunciado: str
    opciones: List[OpcionRespuestaStat] = []
    respuestas_abiertas: List[str] = []

class SeccionStat(BaseModel):
    seccion_id: int
    sigla: str
    descripcion: str
    preguntas: List[PreguntaStat]

class MateriaEstadisticas(BaseModel):
    materia_id: int
    nombre_materia: str
    total_inscriptos: int
    total_encuestas_procesadas: int
    secciones: List[SeccionStat]

class OpcionRespuestaDetalle(BaseModel):
    id: int
    descripcion: str

class PreguntaDetalle(BaseModel):
    id: int
    enunciado: str
    tipo_pregunta: str
    opciones: List[OpcionRespuestaDetalle] = []
    respuesta_seleccionada_id: Optional[int] = None
    respuesta_texto: Optional[str] = None

class SeccionDetalle(BaseModel):
    id: int
    enunciado: Optional[str] = None
    preguntas: List[PreguntaDetalle] = []

class HistorialDetalle(BaseModel):
    materia_nombre: str
    encuesta_nombre: str
    secciones: List[SeccionDetalle]

# --- REBUILDS ---
EncuestaCreate.model_rebuild()
EncuestaUpdate.model_rebuild()
Encuesta.model_rebuild()