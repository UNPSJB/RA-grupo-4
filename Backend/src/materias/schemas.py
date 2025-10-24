from pydantic import BaseModel


class MateriaBase(BaseModel):
    nombre: str
    id_materia: int

class MateriaCreate(MateriaBase):
    anio:int

class MateriaUpdate(MateriaBase):
    anio: int  

class Materia(MateriaBase):
    anio: int  
    model_config = {"from_attributes": True}

class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    anio: int

    model_config = {"from_attributes": True}
class MateriaAutocompletar(BaseModel):
    id_materia: int
    nombre: str
    anio: int
    id_docente: int
    cantidad_inscripciones: int
class MateriaEstadisticas(BaseModel):

    total_inscriptos: int
    total_encuestas_procesadas: int

    model_config = {"from_attributes": True}