from typing import List
from sqlalchemy import Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import auto, StrEnum

class TipoPregunta(StrEnum):
    ABIERTA = auto()
    CERRADA = auto()


class Pregunta(ModeloBase):
    __tablename__ = "preguntas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    enunciado: Mapped[str] = mapped_column(String, index=True)        
    obligatoria: Mapped[bool] = mapped_column(Boolean)
    tipo: Mapped[TipoPregunta] = mapped_column(String)
    
    opciones_respuestas: Mapped[List["src.respuestas.models.OpcionRespuesta"]] = relationship ("src.respuestas.models.OpcionRespuesta", back_populates="pregunta")


