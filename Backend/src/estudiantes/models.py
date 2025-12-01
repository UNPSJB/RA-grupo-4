from typing import List, Optional
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Estudiante(ModeloBase):
    __tablename__ = "estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=False, index=True)
    dni: Mapped[int] = mapped_column(Integer, index=True)

    inscripciones: Mapped[Optional[List["Inscripciones"]]] = relationship(
        "Inscripciones", 
        back_populates="estudiante"
    )
    
    encuestas: Mapped[Optional[List["src.encuesta.models.Encuesta"]]] = relationship(
        "src.encuesta.models.Encuesta",
        back_populates="estudiante"
    )   

    user: Mapped[Optional["User"]] = relationship("User", back_populates="alumno")
    
