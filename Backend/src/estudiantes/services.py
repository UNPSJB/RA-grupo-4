from typing import List
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
from fastapi import HTTPException
from src.estudiantes.models import Estudiante
from src.estudiantes import schemas, exceptions
from src.encuesta.models import Encuesta
from src.encuesta.exceptions import EncuestaNoEncontrada
from src.inscripciones.models import Inscripciones
from src.materias.models import Materias
from src.preguntas.models import Pregunta
from src.secciones.models import Seccion
from src.periodos.services import get_periodo_encuestas_actual




def leer_estudiante(db: Session, estudiante_id: int) -> schemas.Estudiante:
    db_estudiante = db.scalar(select(Estudiante).where(Estudiante.id == estudiante_id))
    if db_estudiante is None:
        raise exceptions.UsuarioNoEncontrado()
    return db_estudiante


def listar_encuestas_disponibles(db: Session, estudiante_id: int) -> List[schemas.EncuestaDisponibleOut]:
    """
    Lista las encuestas que un estudiante tiene PENDIENTES de responder del periodo activo.
    """
    periodo_activo = get_periodo_encuestas_actual(db)
    
    if not periodo_activo:
        return []
    
    alumno = db.query(Estudiante).options(
        selectinload(Estudiante.inscripciones)
            .selectinload(Inscripciones.materia)
            .selectinload(Materias.periodo)
    ).get(estudiante_id)

    if alumno is None:
        raise exceptions.UsuarioNoEncontrado()

    encuestas_disponibles = []
    for inscripcion in alumno.inscripciones:
        if inscripcion.materia.id_periodo != periodo_activo.id:
            continue    #si la materia no es del periodo activo se saltea

        if not inscripcion.encuesta_procesada:
            if inscripcion.materia and inscripcion.materia.encuesta:
                encuestas_disponibles.append(schemas.EncuestaDisponibleOut(
                    inscripcion_id=inscripcion.id,
                    encuesta_id=inscripcion.materia.encuesta.id_encuesta,
                    nombre_encuesta=inscripcion.materia.encuesta.nombre,
                    nombre_materia=inscripcion.materia.nombre
                ))
    return encuestas_disponibles

# --- Función obtener_preguntas (CORREGIDA PARA SECCIONES) ---
def obtener_preguntas_de_encuesta_estudiante(db: Session, id_estudiante: int, id_inscripcion: int):
    """
    Obtiene la encuesta con sus secciones y preguntas asociadas a una INSCRIPCIÓN específica.
    Verifica que la inscripción pertenezca al estudiante.
    """
    inscripcion = db.query(Inscripciones).options(
        joinedload(Inscripciones.materia)
            .joinedload(Materias.encuesta)
            .selectinload(Encuesta.secciones)
            .selectinload(Seccion.preguntas)
            .selectinload(Pregunta.opciones_respuestas)

    ).filter(
        Inscripciones.id == id_inscripcion,
        Inscripciones.estudiante_id == id_estudiante
    ).first()

    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada para este estudiante")

    if not inscripcion.materia or not inscripcion.materia.encuesta:
        raise EncuestaNoEncontrada()

    encuesta_obj = inscripcion.materia.encuesta

    # --- CAMBIO: Ordenar secciones y preguntas dentro de secciones ---
    if hasattr(encuesta_obj, 'secciones') and encuesta_obj.secciones:
        encuesta_obj.secciones.sort(key=lambda s: s.id) # Ordenar secciones
        for seccion in encuesta_obj.secciones:
            if hasattr(seccion, 'preguntas') and seccion.preguntas:
                seccion.preguntas.sort(key=lambda p: p.id) # Ordenar preguntas dentro de cada sección
    # --- FIN CAMBIO ---

    return encuesta_obj
