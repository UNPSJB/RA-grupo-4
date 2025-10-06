from typing import List, Optional
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class InformeSintetico(ModeloBase):
    __tablename__ = "informesSinteticos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    
    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamentos.id"))
    departamento: Mapped["src.departamentos.models.Departamento"] = relationship (
            "src.departamentos.models.Departamento", back_populates="informesSinteticos")