from pydantic import BaseModel
from typing import Optional, List # Importación de List

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
    necesidades_equipamiento: List[str]
    necesidades_bibliografia: List[str]

    #Hdu consignar porcentaje horas
    porcentaje_teoricas: Optional[int] = None
    porcentaje_practicas: Optional[int] = None
    justificacion_porcentaje: Optional[str] = None 
    
    #Hdu completar proceso de aprendizaje
    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None



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

    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None

    class Config:
        orm_mode = True