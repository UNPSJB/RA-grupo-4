from pydantic import BaseModel

class DocenteBase(BaseModel):
    nroLegajo: int
    nombre: str

class DocenteCreate(DocenteBase):
    pass


class Docente(DocenteBase):
    id_docente: int


    class Config:
        from_attributes = True