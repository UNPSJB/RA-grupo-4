from sqlalchemy.orm import Session
from typing import List
from . import models

def get_materias(db: Session) -> List[models.Materias]:
    return db.query(models.Materias).all()

def get_materias_para_autocompletar(db: Session) -> List[dict]:
    materias_db = db.query(models.Materias).all()
    
    resultado = []
    for m in materias_db:
        resultado.append({
            "id_materia": m.id_materia,
            "nombre": m.nombre,
            "anio": m.anio,
            "id_docente": m.id_docente,
            "cantidad_inscripciones": len(m.inscripciones) 
        })
    return resultado
