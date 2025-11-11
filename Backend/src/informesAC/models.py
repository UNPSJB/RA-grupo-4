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

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")

    #Agregado para completar datos generales
    sede: Mapped[SedeEnum] = mapped_column(SQLAlchemyEnum(SedeEnum))#agregado como mejora
    ciclo_lectivo: Mapped[int] = mapped_column(Integer)
    cantidad_alumnos_inscriptos: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cantidad_comisiones_teoricas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cantidad_comisiones_practicas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    #Agregado para la HDU Completar campo de pedido de equipamiento y bibliografia
    necesidades_equipamiento: Mapped[Optional[List[str]]] = mapped_column(
        JSON, nullable=True
    )
    necesidades_bibliografia: Mapped[Optional[List[str]]] = mapped_column(
        JSON, nullable=True
    )

    #Agregado para HDU Consignar porcentaje de horas
    porcentaje_teoricas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    porcentaje_practicas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    justificacion_porcentaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    #Agregado para la HDU contenido abordado
    porcentaje_contenido_abordado: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    #Agregado para la HDU Consignar Valores Desempeño Auxiliares
    valoracion_auxiliares: Mapped[Optional[List[dict]]] = mapped_column(JSON, nullable=True) 

    #Agregado para HDU proceso de aprendizaje
    aspectos_positivos_enseñanza: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    aspectos_positivos_aprendizaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    obstaculos_enseñanza: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    obstaculos_aprendizaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estrategias_a_implementar: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resumen_reflexion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    #Agregado para HDU consignar Actividades
    actividades: Mapped[List["Actividades"]] = relationship("Actividades", back_populates="informeAC", cascade="all, delete-orphan")


    #consignar valores de encuesta
    opinionSobreResumen: Mapped[str] = mapped_column(String, nullable=True) # Comentario del docente sobre los valores estadísticos
    _resumenSecciones: Mapped[str] = mapped_column("resumenSecciones", Text, nullable=True) # JSON con los porcentajes por sección
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

    # @property
    # def resumenSecciones(self) -> List[Dict[str, Any]]:
    #     if self._resumenSecciones:
    #         return json.loads(self._resumenSecciones)
    #     return []

    # @resumenSecciones.setter
    # def resumenSecciones(self, value: List[Dict[str, Any]]):
    #     self._resumenSecciones = json.dumps(value)