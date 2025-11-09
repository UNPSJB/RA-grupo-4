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


# --- MODIFICADO (Campos obligatorios "Todo o Nada") ---
class InformeACCreate(BaseModel):
    # --- OBLIGATORIOS ---
    id_docente: int
    id_materia: int
    sede: SedeEnum
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: int
    cantidad_comisiones_teoricas: int
    cantidad_comisiones_practicas: int

    porcentaje_teoricas: int = Field(..., ge=0, le=100)
    porcentaje_practicas: int = Field(..., ge=0, le=100)
    
    porcentaje_contenido_abordado: int = Field(..., ge=0, le=100)

    opinionSobreResumen: str = Field(..., min_length=1)
    resumenSecciones: List[SeccionResumen]
    
    valoracion_auxiliares: List[ValoracionAuxiliarBase] = Field(..., min_length=1)

    aspectos_positivos_enseñanza: str = Field(..., min_length=1)
    aspectos_positivos_aprendizaje: str = Field(..., min_length=1)
    obstaculos_enseñanza: str = Field(..., min_length=1)
    obstaculos_aprendizaje: str = Field(..., min_length=1)
    estrategias_a_implementar: str = Field(..., min_length=1)
    resumen_reflexion: str = Field(..., min_length=1)

    actividades: List[ActividadBase] = Field(..., min_length=1)

    # --- OPCIONALES (Tus 3 excepciones) ---
    necesidades_equipamiento: Optional[List[str]] = None
    necesidades_bibliografia: Optional[List[str]] = None
    justificacion_porcentaje: Optional[str] = None


# --- MODIFICADO (Quitado Optional y 'completado') ---
class InformeAC(BaseModel):
    id_informesAC: int
    # 'completado' ya no está en este modelo
    sede: SedeEnum
    ciclo_lectivo: int
    cantidad_alumnos_inscriptos: int
    cantidad_comisiones_teoricas: int
    cantidad_comisiones_practicas: int

    docente: DocenteOut
    materia: MateriaOut # Materia tendrá la bandera 'informeACCompletado'

    # Opcionales
    necesidades_equipamiento: Optional[List[str]] = None
    necesidades_bibliografia: Optional[List[str]] = None
    justificacion_porcentaje: Optional[str] = None

    # Obligatorios
    porcentaje_teoricas: int
    porcentaje_practicas: int
    porcentaje_contenido_abordado: int
    valoracion_auxiliares: List[ValoracionAuxiliar]
    aspectos_positivos_enseñanza: str
    aspectos_positivos_aprendizaje: str
    obstaculos_enseñanza: str
    obstaculos_aprendizaje: str
    estrategias_a_implementar: str
    resumen_reflexion: str
    actividades: List[ActividadOut]
    opinionSobreResumen: str
    resumenSecciones: List[SeccionResumen]

    model_config = {"from_attributes": True}