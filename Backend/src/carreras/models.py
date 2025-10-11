from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from src.models import ModeloBase

class Carreras(ModeloBase):
    __tablename__ = "carreras"

    id_carrera: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)

    materias: Mapped[List["src.materias.models.Materias"]] = relationship(
        "Materias",
        back_populates="carrera"
    )
