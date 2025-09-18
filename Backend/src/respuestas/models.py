from typing import List
from sqlalchemy import Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class OpcionRespuesta(ModeloBase):
    __tablename__ = "opciones_respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)    #texto de la respuesta  // si es null seria pregunta abierta?
    
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    pregunta: Mapped["src.preguntas.models.Pregunta"] = relationship ("Pregunta", back_populates="opciones_respuestas")
    