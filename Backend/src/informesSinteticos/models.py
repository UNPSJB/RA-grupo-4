from sqlalchemy import Integer, String, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from src.models import ModeloBase

class SedeEnum(str, enum.Enum):
    trelew = "Trelew"
    esquel = "Esquel"
    madryn = "Puerto Madryn"
    comodoro = "Comodoro Rivadavia"

class InformeSintetico(ModeloBase):
    __tablename__ = "informesSinteticos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    descripcion: Mapped[str] = mapped_column(String, index=True)
    anio: Mapped[int] = mapped_column(Integer)  #futuro periodo

    periodo: Mapped[str] = mapped_column(String, nullable=False)
    sede: Mapped[SedeEnum] = mapped_column(Enum(SedeEnum), nullable=False)
    integrantes: Mapped[str] = mapped_column(String, nullable=True)

    departamento_id: Mapped[int] = mapped_column(ForeignKey("departamentos.id"))
    departamento: Mapped["src.departamentos.models.Departamento"] = relationship (
            "src.departamentos.models.Departamento", back_populates="informesSinteticos")