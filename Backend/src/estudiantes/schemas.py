from pydantic import BaseModel
from typing import List, Optional

# --- Esquema para la respuesta de encuestas disponibles ---
class EncuestaDisponibleOut(BaseModel):
    inscripcion_id: int 
    encuesta_id: int
    nombre_encuesta: str
    nombre_materia: str

    class Config:
        orm_mode = True 



class EstudianteBase(BaseModel):
    nombre: str
    

class Estudiante(EstudianteBase):
    id: int

    class Config:
        orm_mode = True

