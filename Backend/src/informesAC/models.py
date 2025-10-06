from sqlalchemy import Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class InformesAC(ModeloBase):
    __tablename__ = "informesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    anio: Mapped[Date] = mapped_column(Date, index=True)

    id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    materia: Mapped["Materias"] = relationship("Materias", back_populates="informesAC")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="informesAC")
