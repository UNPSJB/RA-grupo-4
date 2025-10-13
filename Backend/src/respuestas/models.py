from typing import List, Optional
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class OpcionRespuesta(ModeloBase):
    __tablename__ = "opciones_respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)    #texto de la respuesta  // si es null seria pregunta abierta?
    
    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"))
    pregunta: Mapped["src.preguntas.models.Pregunta"] = relationship ("Pregunta", back_populates="opciones_respuestas")
    


class Respuesta(ModeloBase):
    __tablename__ = "respuestas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    pregunta_id: Mapped[int] = mapped_column(ForeignKey("preguntas.id"), nullable=False)
    pregunta: Mapped["src.preguntas.models.Pregunta"] = relationship(
        "src.preguntas.models.Pregunta")    #incorporar el back_populates en un futuro


    inscripcion_id: Mapped[int] = mapped_column(ForeignKey("inscripciones.id"), nullable=False)
    inscripcion: Mapped["src.inscripciones.models.Inscripciones"] = relationship(
        "src.inscripciones.models.Inscripciones"#, back_populates="respuestas"
        )


    opcion_respuesta_id: Mapped[Optional[int]] = mapped_column(ForeignKey("opciones_respuestas.id"), nullable=True)
    opcion_respuesta: Mapped[Optional["src.respuestas.models.OpcionRespuesta"]] = relationship(
        "src.respuestas.models.OpcionRespuesta")    #incorporar el back_populates en un futuro
    
    respuesta_abierta: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    

