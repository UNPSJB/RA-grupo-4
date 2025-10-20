from sqlalchemy import Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from typing import List, Optional 

class Encuesta(ModeloBase):
    __tablename__ = "encuestas"

    id_encuesta: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    
    # materias que usan esta encuesta
    materias: Mapped[List["src.materias.models.Materias"]] = relationship(
        "src.materias.models.Materias",
        back_populates="encuesta"
    )


    estudiante_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("estudiantes.id"), nullable=True 
    )
    estudiante: Mapped[Optional["src.estudiantes.models.Estudiante"]] = relationship(
        "src.estudiantes.models.Estudiante", back_populates="encuestas"
    )

    disponible: Mapped[bool] = mapped_column(Boolean, default=False)


    secciones: Mapped[list["src.secciones.models.Seccion"]] = relationship (
        "src.secciones.models.Seccion", back_populates="encuesta", cascade="all, delete-orphan")
    
