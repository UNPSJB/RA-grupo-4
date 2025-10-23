from sqlalchemy import Integer, String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import Optional, List

class InformesAC(ModeloBase):
    __tablename__ = "informesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")
    
    sede: Mapped[str] = mapped_column(String(100))
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
    justificacion_porcentaje: Mapped[Optional[String]] = mapped_column(String, nullable=True)    
