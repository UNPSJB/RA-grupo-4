from __future__ import annotations
from typing import List
from sqlalchemy import Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Seccion(ModeloBase):
    __tablename__ = "secciones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    enunciado: Mapped[str] = mapped_column(String, index=True)
    
    encuesta_id: Mapped[int] = mapped_column(ForeignKey("encuestas.id_encuesta"))
    encuesta: Mapped["src.encuesta.models.Encuesta"] = relationship ("src.encuesta.models.Encuesta", back_populates="secciones")

    preguntas: Mapped[list["src.preguntas.models.Pregunta"]] = relationship (
        "src.preguntas.models.Pregunta", back_populates="seccion", cascade="all, delete-orphan")
