from typing import Optional, List
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Departamento(ModeloBase):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    informesSinteticos: Mapped[List["InformeSintetico"]] =relationship(
        "InformeSintetico", back_populates="departamento")

    materias: Mapped[List["Materia"]] = relationship( 
        "Materia", back_populates="departamento" )