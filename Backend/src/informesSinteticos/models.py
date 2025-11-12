from sqlalchemy import Integer, String, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from src.models import ModeloBase
from typing import List, Dict, Optional, Any
import json

class SedeEnum(str, enum.Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSintetico(ModeloBase):
    __tablename__ = "informesSinteticos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    anio: Mapped[int] = mapped_column(Integer)  #futuro periodo

    periodo: Mapped[str] = mapped_column(String, nullable=False)
    sede: Mapped[SedeEnum] = mapped_column(Enum(SedeEnum), nullable=False)
    integrantes: Mapped[str] = mapped_column(String, nullable=True)

    # Relación con Departamento
    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamentos.id"))
    departamento: Mapped["Departamento"] = relationship(
        "Departamento", back_populates="informesSinteticos"
    )

    
#nuevo hdu info general
    resumen_general: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
#nuevo hdu completar necesidades y equipamientos   
    resumen_necesidades: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
#nuevo hdu valoracion miembros
    valoracion_miembros: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSON, nullable=True)
#nuevo hdu agregar comentarios
    comentarios: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    @property
    def resumenGeneral(self) -> List[Dict[String, Any]]:
        if not self.resumen_general:
            return []
        try:
            data = json.loads(self.resumen_general)
            return data if isinstance(data, list) else [data]
        except json.JSONDecodeError:
            return []

    @resumenGeneral.setter
    def resumenGeneral(self, value: List[Dict[str, Any]]):
        self.resumen_general = json.dumps(value or [])