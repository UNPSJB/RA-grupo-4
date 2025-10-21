from pydantic import BaseModel
from datetime import date
from typing import Dict, List, Optional
class SeccionResumen(BaseModel):
    id: int
    nombre: str
    porcentajes_opciones: Dict[str, float]  # {"Muy de acuerdo": 42.0, ...}

class DocenteOut(BaseModel):
    id_docente: int
    nombre: str
    
    model_config = {
        "from_attributes": True  
    }


class MateriaOut(BaseModel):
    id_materia: int
    nombre: str
    anio: int

    model_config = {
        "from_attributes": True  
    }

class InformeAC(BaseModel):
    id_informesAC: int
    docente: DocenteOut
    materia: MateriaOut

    opinionSobreResumen: Optional[str] = None
    resumenSecciones: List[SeccionResumen]  # JSON convertido a lista de objetos

    model_config = {
        "from_attributes": True  
    }

