from typing import Optional, List
from datetime import datetime
# --- AÑADIR 'Boolean' A ESTE IMPORT ---
from sqlalchemy import Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase 

class Inscripciones(ModeloBase):

    __tablename__ = 'inscripciones'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # FK a Estudiante
    estudiante_id: Mapped[int] = mapped_column(ForeignKey('estudiantes.id'), index=True)
    
    # FK a Materia 
    materia_id: Mapped[int] = mapped_column(ForeignKey('materias.id_materia'), index=True)
    
    fecha_inscripcion: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    encuesta_procesada: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    estudiante: Mapped["Estudiante"] = relationship("Estudiante", back_populates="inscripciones")
    materia: Mapped["Materias"] = relationship("Materias",back_populates="inscripciones")

    respuestas: Mapped[List["src.respuestas.models.Respuesta"]] = relationship(
        "src.respuestas.models.Respuesta", 
        back_populates="inscripcion", 
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Inscripcion EstudianteID={self.estudiante_id}, MateriaID={self.materia_id}>"