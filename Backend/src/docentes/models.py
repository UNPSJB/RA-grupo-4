from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from src.models import ModeloBase

class Docentes(ModeloBase):
    __tablename__ = "docentes"

    id_docente: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)
    nroLegajo: Mapped[int] = mapped_column(Integer, index=True)

    informesAC: Mapped[List["InformesAC"]] = relationship(
        "InformesAC",
        back_populates="docente"
    )
