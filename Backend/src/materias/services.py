from sqlalchemy.orm import Session, subqueryload
from typing import List
from . import models
from src.inscripciones.models import Inscripciones
from . import schemas
from src.informesAC.models import InformesAC # <-- NUEVA IMPORTACIÓN
import datetime # <-- NUEVA IMPORTACIÓN

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

# --- NUEVA FUNCIÓN ---
def get_materias_pendientes_docente(db: Session, id_docente: int, ciclo_lectivo: int) -> List[models.Materias]:
    """
    Obtiene la lista de materias de un docente para las cuales
    AÚN NO se ha generado un InformeAC en el ciclo lectivo especificado.
    """
    
    # 1. Obtener los IDs de las materias que SÍ tienen un informeAC
    #    para este docente y este ciclo lectivo.
    subquery = (
        db.query(InformesAC.id_materia)
        .filter(
            InformesAC.id_docente == id_docente,
            InformesAC.ciclo_lectivo == ciclo_lectivo,
            InformesAC.completado == 1 # Aseguramos que solo contamos los completados
        )
    )
    
    # 2. Obtener todas las materias de ese docente...
    query = (
        db.query(models.Materias)
        .filter(
            models.Materias.id_docente == id_docente,
            models.Materias.anio == ciclo_lectivo
        )
    )
    
    # 3. ...que NO ESTÉN en la lista de materias que ya tienen informe.
    query = query.filter(models.Materias.id_materia.notin_(subquery))
    
    return query.all()
# --- FIN NUEVA FUNCIÓN ---

def get_estadisticas_materia(db: Session, materia_id: int) -> dict:
    # (Tu código original sin cambios)
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
    # (Tu código original sin cambios)
    materias_docente = db.query(models.Materias).filter(models.Materias.id_docente == id_docente).all()
    resultado_estadisticas = []
    for materia in materias_docente:
        stats = get_estadisticas_materia(db, materia.id_materia)
        resultado_estadisticas.append(schemas.MateriaEstadisticaItem(
            id_materia=materia.id_materia,
            nombre_materia=materia.nombre,
            total_inscriptos=stats["total_inscriptos"],
            total_encuestas_procesadas=stats["total_encuestas_procesadas"]
        ))
    return resultado_estadisticas