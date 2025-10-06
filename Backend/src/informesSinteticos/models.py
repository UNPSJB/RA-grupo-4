from typing import List, Optional
from sqlalchemy import Integer, String, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class InformeSintetico(ModeloBase):
    __tablename__ = "informesSinteticos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    
#    departamento: Mapped[departamento] = relationship("src.departamentos.models.Departamento"), back_populates="informeSintetico")
    # informesSinteticos: Mapped[Optional[List["src.informesSinteticos.models.InformeSintetico"]]] = relationship(
    #     "src.informesSinteticos.models.InformeSintetico")
