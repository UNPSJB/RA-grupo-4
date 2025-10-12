from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from src.models import ModeloBase

class Materias(ModeloBase):
    __tablename__ = "materias"

    id_materia: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)

    id_carrera: Mapped[int] = mapped_column(ForeignKey("carreras.id_carrera"), nullable=False)
    carrera: Mapped["Carreras"] = relationship("Carreras", back_populates="materias")

    informesAC: Mapped[List["InformesAC"]] = relationship(
        "InformesAC",
        back_populates="materia"
    )
    inscripciones: Mapped[List["Inscripciones"]] = relationship(
        "Inscripciones", 
        back_populates="materia"
    )
    

    # encuesta que usa la materia
    encuesta_id: Mapped[int] = mapped_column(
        ForeignKey("encuestas.id_encuesta"),
        nullable=False
    )
    encuesta: Mapped["src.encuesta.models.Encuesta"] = relationship(
        "src.encuesta.models.Encuesta",
        back_populates="materias"
    )
