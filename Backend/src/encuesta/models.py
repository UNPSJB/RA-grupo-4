from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List

class Encuesta(ModeloBase):
    __tablename__ = "encuesta"

    id_encuesta: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    estudiante_id: Mapped[int] = mapped_column(
        ForeignKey("estudiantes.id")
    )  # Foreign key a Estudiante
    estudiante: Mapped["src.estudiantes.models.Estudiante"] = relationship(
        "src.estudiantes.models.Estudiante", back_populates="encuestas"
    )

    @property
    def nombre_estudiante(self):
        return self.estudiante.nombre
    #Tambien se podria agregar una descripcion de la encuesta

    preguntas: Mapped[list["src.preguntas.models.Pregunta"]] = relationship (
        "src.preguntas.models.Pregunta", back_populates="encuesta", cascade="all, delete-orphan")

