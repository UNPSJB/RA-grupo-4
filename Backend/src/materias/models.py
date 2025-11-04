from sqlalchemy import Integer, String, ForeignKey, Date, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from src.models import ModeloBase

class Materias(ModeloBase):
    __tablename__ = "materias"

    id_materia: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)
    anio: Mapped [int] = mapped_column(Integer, unique= True , index= True)
    codigoMateria: Mapped[str] = mapped_column(String)#corregido que me equivoque de codigo para poner 

    id_carrera: Mapped[int] = mapped_column(ForeignKey("carreras.id_carrera"), nullable=False)
    carrera: Mapped["Carreras"] = relationship("Carreras", back_populates="materias")

    id_docente: Mapped[int] = mapped_column(ForeignKey("docentes.id_docente"), nullable=False)
    docente: Mapped["Docentes"] = relationship("Docentes", back_populates="Materias")

    id_departamento: Mapped[int] = mapped_column(ForeignKey("departamentos.id"), nullable=False)
    departamento: Mapped["src.departamentos.models.Departamento"] = relationship( 
        "src.departamentos.models.Departamento", back_populates="materias" )

    # --- NUEVA BANDERA (Tu lógica: 0=pendiente, 1=completado) ---
    # Usamos Boolean para que sea NULL/False (0) por defecto y True (1) al completarse.
    informeACCompletado: Mapped[Optional[bool]] = mapped_column(Boolean, default=False, nullable=True)
    # --- FIN NUEVO ---

    informesAC: Mapped[List["InformesAC"]] = relationship(
        "InformesAC",
        back_populates="materia"
    )
    inscripciones: Mapped[List["Inscripciones"]] = relationship(
        "Inscripciones", 
        back_populates="materia"
    )
    
    # encuesta que usa la materia
    encuesta_id: Mapped[int] = mapped_column(
        ForeignKey("encuestas.id_encuesta"),
        nullable=False
    )
    encuesta: Mapped["src.encuesta.models.Encuesta"] = relationship(
        "src.encuesta.models.Encuesta",
        back_populates="materias"
    )