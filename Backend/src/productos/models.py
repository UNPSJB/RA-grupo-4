# from typing import Optional, List
from sqlalchemy import Integer, String, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase
from enum import auto, StrEnum

class TipoMasa(StrEnum):
    SUAVE = auto()
    CRUJIENTE = auto()


class Producto(ModeloBase):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)
    precio: Mapped[float] = mapped_column(Float)
    masa: Mapped[TipoMasa] = mapped_column(String) # Suave o Crujiente
