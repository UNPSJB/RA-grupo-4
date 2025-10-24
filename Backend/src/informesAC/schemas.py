from pydantic import BaseModel, Field 
from typing import Optional, List
from src.actividades.schemas import ActividadOut

class DocenteOut(BaseModel):
    id_docente: int
    nombre: str

    class Config:
        orm_mode = True 
class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    anio: int 

    class Config:
        orm_mode = True
        # model_config = {"from_attributes": True}

class InformeACCreate(BaseModel):
    #Hdu completar datos generales
    id_docente: int
    id_materia: int
    sede: str
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None
    
    #Hdu completar necesidades
    necesidades_equipamiento: Optional[List[str]] = None # Hacer opcional si puede no venir
    necesidades_bibliografia: Optional[List[str]] = None # Hacer opcional si puede no venir

    #Hdu consignar porcentaje horas
    porcentaje_teoricas: Optional[int] = Field(None, ge=0, le=100) # Validar 0-100
    porcentaje_practicas: Optional[int] = Field(None, ge=0, le=100) # Validar 0-100
    justificacion_porcentaje: Optional[str] = None 
    
    #Hdu consignar porcentaje abordado
    porcentaje_contenido_abordado: Optional[int] = Field(None, ge=0, le=100) # Validar 0-100

    #Hdu completar proceso de aprendizaje
    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None

    #Hdu consignar actividades
    actividades: List[ActividadOut] = []


class InformeAC(BaseModel):
    id_informesAC: int
    sede: str
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None

    docente: DocenteOut
    materia: MateriaOut
    
    necesidades_equipamiento: Optional[List[str]] = None
    necesidades_bibliografia: Optional[List[str]] = None

    porcentaje_teoricas: Optional[int] = None
    porcentaje_practicas: Optional[int] = None
    justificacion_porcentaje: Optional[str] = None

    # --- AÑADIDO PARA HDU 3 ---
    porcentaje_contenido_abordado: Optional[int] = None

    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None

    #Hdu consignar actividades
    actividades: List[ActividadOut] = []

    class Config:
        orm_mode = True
        # model_config = {"from_attributes": True}