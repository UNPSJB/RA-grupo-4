from sqlalchemy import Integer, String, ForeignKey, JSON, Text
import enum
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Dict, Any, Optional, List
#Uso text porque es mucho mas dinamico para la hora de guardar cadenas largas
import json

class SedeEnum(str, enum.Enum): #Agregado para mejora
    # El "str" (str, enum.Enum) ayuda a que Pydantic (FastAPI) 
    # y JSON lo entiendan automáticamente.
    TRELEW = "Trelew"
    MADRYN = "Madryn"
    ESQUEL = "Esquel"
    COMODORO = "Comodoro"

class InformesAC(ModeloBase):
    __tablename__ = "informesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # --- NUEVA BANDERA (Tu lógica: 1=completado) ---
    # 1 = Completado (los incompletos no se guardan)
    completado: Mapped[int] = mapped_column(Integer, nullable=False)
    # --- FIN NUEVO ---

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")

    #Agregado para completar datos generales
    sede: Mapped[SedeEnum] = mapped_column(SQLAlchemyEnum(SedeEnum))#agregado como mejora
    ciclo_lectivo: Mapped[int] = mapped_column(Integer)
    # --- CAMPOS AHORA OBLIGATORIOS (según schema) ---
    cantidad_alumnos_inscriptos: Mapped[int] = mapped_column(Integer)
    cantidad_comisiones_teoricas: Mapped[int] = mapped_column(Integer)
    cantidad_comisiones_practicas: Mapped[int] = mapped_column(Integer)

    #Agregado para la HDU Completar campo de pedido de equipamiento y bibliografia
    # --- CAMPO OPCIONAL ---
    necesidades_equipamiento: Mapped[Optional[List[str]]] = mapped_column(
        JSON, nullable=True
    )
    # --- CAMPO OPCIONAL ---
    necesidades_bibliografia: Mapped[Optional[List[str]]] = mapped_column(
        JSON, nullable=True
    )

    #Agregado para HDU Consignar porcentaje de horas
    # --- CAMPOS AHORA OBLIGATORIOS (según schema) ---
    porcentaje_teoricas: Mapped[int] = mapped_column(Integer)
    porcentaje_practicas: Mapped[int] = mapped_column(Integer)
    # --- CAMPO OPCIONAL ---
    justificacion_porcentaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    #Agregado para la HDU contenido abordado
    porcentaje_contenido_abordado: Mapped[int] = mapped_column(Integer)

    #Agregado para la HDU Consignar Valores Desempeño Auxiliares
    valoracion_auxiliares: Mapped[List[dict]] = mapped_column(JSON) 

    #Agregado para HDU proceso de aprendizaje
    aspectos_positivos_enseñanza: Mapped[str] = mapped_column(Text)
    aspectos_positivos_aprendizaje: Mapped[str] = mapped_column(Text)
    obstaculos_enseñanza: Mapped[str] = mapped_column(Text)
    obstaculos_aprendizaje: Mapped[str] = mapped_column(Text)
    estrategias_a_implementar: Mapped[str] = mapped_column(Text)
    resumen_reflexion: Mapped[str] = mapped_column(Text)

    #Agregado para HDU consignar Actividades
    actividades: Mapped[List["Actividades"]] = relationship("Actividades", back_populates="informeAC", cascade="all, delete-orphan")


    #consignar valores de encuesta
    opinionSobreResumen: Mapped[str] = mapped_column(String) # Comentario del docente sobre los valores estadísticos
    _resumenSecciones: Mapped[str] = mapped_column("resumenSecciones", Text) # JSON con los porcentajes por sección
    
    @property
    def resumenSecciones(self) -> List[Dict[str, Any]]:
        if not self._resumenSecciones:
            return []
        try:
            data = json.loads(self._resumenSecciones)
            # Asegurar que siempre sea lista
            if isinstance(data, dict):
                return [data] if data else []
            if isinstance(data, list):
                return data
            return []
        except json.JSONDecodeError:
            return []
            
    @resumenSecciones.setter
    def resumenSecciones(self, value: List[Dict[str, Any]]):
        if not value:
            self._resumenSecciones = json.dumps([])
        else:
            self._resumenSecciones = json.dumps(value)

    # --- CÓDIGO COMENTADO PRESERVADO ---
    # @property
    # def resumenSecciones(self) -> List[Dict[str, Any]]:
    #     if self._resumenSecciones:
    #         return json.loads(self._resumenSecciones)
    #     return []

    # @resumenSecciones.setter
    # def resumenSecciones(self, value: List[Dict[str, Any]]):
    #     self._resumenSecciones = json.dumps(value)
    # --- FIN CÓDIGO COMENTADO ---