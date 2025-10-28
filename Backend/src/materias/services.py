from sqlalchemy.orm import Session, subqueryload
from typing import List
from . import models
from src.inscripciones.models import Inscripciones
from . import schemas

def get_materias(db: Session) -> List[models.Materias]:
    """
    Obtiene y retorna una lista de todas las materias existentes.
    """
    return db.query(models.Materias).all()

def get_materias_para_autocompletar(db: Session) -> List[dict]:
    materias_db = (
        db.query(models.Materias)
        .options(subqueryload(models.Materias.inscripciones)) 
        .all()
    )
    resultado = []
    for m in materias_db:
        resultado.append({
            "id_materia": m.id_materia,
            "nombre": m.nombre,
            "codigoMateria": m.codigoMateria,
            "anio": m.anio,
            "id_docente": m.id_docente,
            "cantidad_inscripciones": len(m.inscripciones) if m.inscripciones else 0
        })
    return resultado

# Función existente (la mantenemos por si se usa en otro lado)
def get_estadisticas_materia(db: Session, materia_id: int) -> dict:
    """
    Obtiene las estadísticas de UNA materia específica.
    """
    total_inscriptos = (
        db.query(Inscripciones)
        .filter(Inscripciones.materia_id == materia_id)
        .count()
    )
    total_encuestas_procesadas = (
        db.query(Inscripciones)
        .filter(
            Inscripciones.materia_id == materia_id,
            Inscripciones.encuesta_procesada == True
        )
        .count()
    )
    return {
        "total_inscriptos": total_inscriptos,
        "total_encuestas_procesadas": total_encuestas_procesadas,
    }

def get_estadisticas_por_docente(db: Session, id_docente: int) -> List[schemas.MateriaEstadisticaItem]:
    """
    Obtiene las estadísticas de todas las materias asignadas a un docente.
    """
    # 1. Obtener todas las materias del docente
    materias_docente = db.query(models.Materias).filter(models.Materias.id_docente == id_docente).all()

    resultado_estadisticas = []

    # 2. Iterar sobre cada materia y calcular sus estadísticas
    for materia in materias_docente:
        stats = get_estadisticas_materia(db, materia.id_materia)

        resultado_estadisticas.append(schemas.MateriaEstadisticaItem(
            id_materia=materia.id_materia,
            nombre_materia=materia.nombre,
            total_inscriptos=stats["total_inscriptos"],
            total_encuestas_procesadas=stats["total_encuestas_procesadas"]
        ))

    return resultado_estadisticas

