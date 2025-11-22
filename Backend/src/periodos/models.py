from __future__ import annotations
import enum
from datetime import date
from typing import List
from sqlalchemy import Integer, String, ForeignKey, Date, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class CuatrimestreEnum(str, enum.Enum): #Agregado para mejora
    # El "str" (str, enum.Enum) ayuda a que Pydantic (FastAPI) 
    # y JSON lo entiendan automáticamente.
    PRIMER = "Primer Cuatrimestre"
    SEGUNDO = "Segundo Cuatrimestre"


class Periodo(ModeloBase):
    __tablename__ = "periodos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ciclo_lectivo: Mapped[int] = mapped_column(Integer, nullable=False)
    cuatrimestre: Mapped[CuatrimestreEnum] = mapped_column(Enum(CuatrimestreEnum), nullable=False)

    # Fechas de encuestas (para estudiantes)
    fecha_apertura_encuestas: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre_encuestas: Mapped[date] = mapped_column(Date, nullable=False)

    # Fechas de informes de actividad curricular (para docentes)
    fecha_apertura_informesAC: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_cierre_informesAC: Mapped[date] = mapped_column(Date, nullable=False)
    
    #Se usa para que solo se pueda crear un periodo con igual ciclo lectivo y cuatrimestre
    __table_args__ = (
        UniqueConstraint("ciclo_lectivo", "cuatrimestre", name="uix_ciclo_cuatrimestre"),
    )