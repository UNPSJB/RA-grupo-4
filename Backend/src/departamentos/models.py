from typing import List, Optional
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Departamento(ModeloBase):
    __tablename__ = "departamentos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, index=True)

    # Relación con informes sintéticos
    informesSinteticos: Mapped[List["InformeSintetico"]] = relationship(
        "InformeSintetico", back_populates="departamento"
    )

    # Relación con materias
    materias: Mapped[List["Materias"]] = relationship(
        "Materias", back_populates="departamento"
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="departamento")

# 
from src.informesSinteticos.models import InformeSintetico
