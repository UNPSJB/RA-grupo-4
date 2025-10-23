from sqlalchemy.orm import Session
from typing import List
from . import models  
from src.inscripciones.models import Inscripciones

def get_materias(db: Session) -> List[models.Materias]:
    """
    Obtiene y retorna una lista de todas las materias existentes.
    """
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

def get_estadisticas_materia(db: Session, materia_id: int) -> dict:
    """
    Obtiene las estadísticas de una materia:
    - Cantidad total de estudiantes inscriptos.
    - Cantidad total de encuestas procesadas.
    """

    # 1. Contar el total de inscriptos a la materia
    total_inscriptos = (
        db.query(Inscripciones)
        .filter(Inscripciones.materia_id == materia_id)
        .count()
    )

    # 2. Contar las encuestas procesadas
    #    Ahora solo contamos las inscripciones de esa materia
    #    que tengan la bandera "encuesta_procesada" en True.
    total_encuestas_procesadas = (
        db.query(Inscripciones)
        .filter(
            Inscripciones.materia_id == materia_id,
            Inscripciones.encuesta_procesada == True
        )
        .count()
    )

    # 3. Devolvemos el resultado
    return {
        "total_inscriptos": total_inscriptos,
        "total_encuestas_procesadas": total_encuestas_procesadas,
    }