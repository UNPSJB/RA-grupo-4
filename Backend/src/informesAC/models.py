from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Dict, Any
from src.models import ModeloBase
import json

class InformesAC(ModeloBase):
    __tablename__ = "informesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")


    #consignar valores de encuesta
    opinionSobreResumen: Mapped[str] = mapped_column(String, nullable=True) # Comentario del docente sobre los valores estadísticos

    _resumenSecciones: Mapped[str] = mapped_column("resumenSecciones", Text, nullable=True) # JSON con los porcentajes por sección
    @property
    def resumenSecciones(self) -> Dict[str, Any]:
        if self._resumenSecciones:
            return json.loads(self._resumenSecciones)
        return {}
    @resumenSecciones.setter
    def resumenSecciones(self, value: Dict[str, Any]):
        self._resumenSecciones = json.dumps(value)
    