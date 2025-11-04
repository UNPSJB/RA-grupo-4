from typing import Optional, List
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase


class Departamento(ModeloBase):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)
    
    informesSinteticos: Mapped[List["src.informesSinteticos.models.InformeSintetico"]] =relationship(
        "src.informesSinteticos.models.InformeSintetico", back_populates="departamento")

    materias: Mapped[List["src.materias.models.Materias"]] = relationship( 
        "src.materias.models.Materias", back_populates="departamento" )