from typing import Optional
from datetime import datetime
from sqlalchemy import Integer, ForeignKey, DateTime
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

    estudiante: Mapped["Estudiante"] = relationship(back_populates="inscripciones")
    materia: Mapped["Materias"] = relationship(back_populates="inscripciones")

    def __repr__(self):
        return f"<Inscripcion EstudianteID={self.estudiante_id}, MateriaID={self.materia_id}>"