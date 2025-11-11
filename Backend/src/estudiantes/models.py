from typing import List, Optional
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Estudiante(ModeloBase):
    __tablename__ = "estudiantes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=False, index=True) 
    usuario: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    contraseña: Mapped[str] = mapped_column(String, nullable=False)

    inscripciones: Mapped[Optional[List["Inscripciones"]]] = relationship(
        "Inscripciones", 
        back_populates="estudiante"
    )
    
    encuestas: Mapped[Optional[List["src.encuesta.models.Encuesta"]]] = relationship(
        "src.encuesta.models.Encuesta",
        back_populates="estudiante"
    )   
    
