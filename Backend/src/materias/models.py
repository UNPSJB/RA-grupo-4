from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase 
from typing import List

class Materias(ModeloBase):
    __tablename__ = "materias"

    id_materia: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    inscripciones: Mapped[List["Inscripcion"]] = relationship(
        "Inscripcion", 
        back_populates="materia"
    )
    
    encuestas: Mapped[List["src.encuesta.models.Encuesta"]] = relationship(
        "src.encuesta.models.Encuesta", 
        back_populates="materia"
    )
    
