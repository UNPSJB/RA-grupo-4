from pydantic import BaseModel
from datetime import date

class InformeAC(BaseModel):
    id_informesAC: int
    anio: date
    id_materia: int
    id_docente: int

    class Config:
        orm_mode = True
