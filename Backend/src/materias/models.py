from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from src.models import ModeloBase 

class Materias(ModeloBase):
    __tablename__ = "materias"

    id_materia: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String, unique=True, index=True)
    
