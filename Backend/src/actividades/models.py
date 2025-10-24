from sqlalchemy import Integer, String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.models import ModeloBase

class Actividades(ModeloBase):
    __tablename__ = 'actividades'

    id_actividades: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    id_informeAC: Mapped[int] = mapped_column(ForeignKey("informesAC.id_informesAC"), nullable=False)
    informeAC: Mapped["InformesAC"] = relationship("InformesAC", back_populates="actividades")
    
    integranteCatedra: Mapped[str] = mapped_column(String(255), nullable=True)
    capacitacion: Mapped[str] = mapped_column(Text, nullable=True) 
    investigacion: Mapped[str] = mapped_column(Text, nullable=True) 
    extension: Mapped[str] = mapped_column(Text, nullable=True)
    gestion: Mapped[str] = mapped_column(Text, nullable=True) 
    observacionComentarios: Mapped[str] = mapped_column(Text, nullable=True) 
