from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional

class InformesAC(ModeloBase):
    __tablename__ = "informesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")
    
    #Agregado para la HDU Completar datos generales
    #Estos datos se autocompletan cuando corresponda
    sede: Mapped[str] = mapped_column(String(100))
    ciclo_lectivo: Mapped[int] = mapped_column(Integer)
    cantidad_alumnos_inscriptos: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cantidad_comisiones_teoricas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    cantidad_comisiones_practicas: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)