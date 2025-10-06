from pydantic import BaseModel
from datetime import date

class InformeAC(BaseModel):
    id_informesAC: int
    anio: date

    class Config:
        orm_mode = True

class InformeACCreate(BaseModel):
    anio: date
