from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"

    id_encuesta: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    estudiante_id: Mapped[int] = mapped_column(
        ForeignKey("estudiantes.id"), nullable=True     # incorporamos el null para permitir encuestas sin estudiantes
    )  # Foreign key a Estudiante
    estudiante: Mapped["src.estudiantes.models.Estudiante"] = relationship(
        "src.estudiantes.models.Estudiante", back_populates="encuestas"
    )

    @property
    def nombre_estudiante(self):
        return self.estudiante.nombre
    disponible: Mapped[bool] = mapped_column(Boolean, default=False)

    preguntas: Mapped[list["src.preguntas.models.Pregunta"]] = relationship (
        "src.preguntas.models.Pregunta", back_populates="encuesta", cascade="all, delete-orphan")

