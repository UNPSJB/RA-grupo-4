from sqlalchemy import Integer, Date
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase

class InformesAC(ModeloBase):
    __tablename__ = "InformesAC"

    id_informesAC: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    anio: Mapped[Date] = mapped_column(Date, index=True)

    # Relaciones con carrera, materia y profesor, descomentar cuando las haga
    
    # id_carrera: Mapped[int] = mapped_column(ForeignKey("carreras.id_carrera"), nullable=False)
    # carrera: Mapped["Carrera"] = relationship("Carrera", back_populates="informes")

    # id_materia: Mapped[int] = mapped_column(ForeignKey("materias.id_materia"), nullable=False)
    # materia: Mapped["Materia"] = relationship("Materia", back_populates="informes")

    # id_profesor: Mapped[int] = mapped_column(ForeignKey("profesores.id_profesor"), nullable=False)
    # profesor: Mapped["Profesor"] = relationship("Profesor", back_populates="informes")
