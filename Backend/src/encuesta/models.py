from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Encuesta(ModeloBase):
    __tablename__ = "encuesta"

    id_encuesta: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    #Tambien se podria agregar una descripcion de la encuesta

    preguntas: Mapped[list["src.preguntas.models.Pregunta"]] = relationship(
        "src.preguntas.models.Pregunta", back_populates="encuesta", cascade="all, delete-orphan"
    )
