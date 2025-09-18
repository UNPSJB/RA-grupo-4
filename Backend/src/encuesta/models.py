from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"

    id_encuesta: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    disponible: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relación con preguntas, descomentar cuando tenga lo de denis
    # preguntas: Mapped[list[Pregunta]] = relationship(
    #     "Pregunta", back_populates="encuesta", cascade="all, delete-orphan"
    # )
