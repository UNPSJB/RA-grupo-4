from pydantic import BaseModel, Field
from typing import Optional, List, Literal, Dict
from src.actividades.schemas import ActividadOut, ActividadBase 
from src.informesAC.models import SedeEnum #importo el enum

# --- Definición de la Calificación (para validación) ---
CalificacionAuxiliar = Literal["E", "MB", "B", "R", "I"]


class DocenteOut(BaseModel):
    id_docente: int
    nombre: str
    
    model_config = {
        "from_attributes": True  
    }


class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    codigoMateria: str
    anio: int 

    model_config = {
        "from_attributes": True  
    }


# schema para valores de encuesta
class SeccionResumen(BaseModel):
    id: int
    sigla: str
    nombre: str
    porcentajes_opciones: Dict[str, float]  # {"Muy de acuerdo": 42.0, ...}


class ValoracionAuxiliarBase(BaseModel):
    nombre_auxiliar: str = Field(..., min_length=1) # Campo obligatorio
    calificacion: CalificacionAuxiliar # Usamos el tipo Literal para validar
    justificacion: str = Field(..., min_length=1) # Campo obligatorio

class ValoracionAuxiliar(ValoracionAuxiliarBase):
    # Podríamos añadir un ID si se guardaran en tabla separada, pero como JSON no es necesario
    pass


class ValoracionAuxiliarBase(BaseModel):
    nombre_auxiliar: str = Field(..., min_length=1) # Campo obligatorio
    calificacion: CalificacionAuxiliar # Usamos el tipo Literal para validar
    justificacion: str = Field(..., min_length=1) # Campo obligatorio

class ValoracionAuxiliar(ValoracionAuxiliarBase):
    # Podríamos añadir un ID si se guardaran en tabla separada, pero como JSON no es necesario
    pass



class InformeACCreate(BaseModel):
    #Hdu completar datos generales
    id_docente: int
    id_materia: int
    sede: SedeEnum
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: Optional[int] = None
    cantidad_comisiones_teoricas: Optional[int] = None
    cantidad_comisiones_practicas: Optional[int] = None

    #Hdu completar necesidades
    necesidades_equipamiento: Optional[List[str]] = None
    necesidades_bibliografia: Optional[List[str]] = None

    #Hdu consignar porcentaje horas
    porcentaje_teoricas: Optional[int] = Field(None, ge=0, le=100)
    porcentaje_practicas: Optional[int] = Field(None, ge=0, le=100)
    justificacion_porcentaje: Optional[str] = None

    # HDU 3
    porcentaje_contenido_abordado: Optional[int] = Field(None, ge=0, le=100)

    #Hdu Consignar Valores resumen encuesta 
    opinionSobreResumen: Optional[str] = None
    resumenSecciones: Optional[List[SeccionResumen]] = None
    
    # --- AÑADIDO PARA HDU 4 ---
    valoracion_auxiliares: Optional[List[ValoracionAuxiliarBase]] = None 

    #Hdu completar proceso de aprendizaje
    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None


    #Hdu consignar actividades
    actividades: List[ActividadBase] = []


class InformeAC(BaseModel):
    id_informesAC: int
    sede: SedeEnum
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

    porcentaje_contenido_abordado: Optional[int] = None # HDU 3

    # --- AÑADIDO PARA HDU 4 ---
    valoracion_auxiliares: Optional[List[ValoracionAuxiliar]] = None # Lista de valoraciones

    aspectos_positivos_enseñanza: Optional[str] = None
    aspectos_positivos_aprendizaje: Optional[str] = None
    obstaculos_enseñanza: Optional[str] = None
    obstaculos_aprendizaje: Optional[str] = None
    estrategias_a_implementar: Optional[str] = None
    resumen_reflexion: Optional[str] = None

    #Hdu consignar actividades
    actividades: List[ActividadOut] = []

    #consignar resumen encuesta
    opinionSobreResumen: Optional[str] = None
    resumenSecciones: List[SeccionResumen]  # JSON convertido a lista de objetos

    model_config = {
        "from_attributes": True  
    }

