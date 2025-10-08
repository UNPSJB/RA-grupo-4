from pydantic import BaseModel
from typing import List


class DocentesBase(BaseModel):
    nombre: str

class DocentesCreate(DocentesBase):
    pass

class DocentesUpdate(DocentesBase):
    pass

class Docentes(DocentesBase):
    pass