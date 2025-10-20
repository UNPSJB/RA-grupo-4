from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session, joinedload
from src.estudiantes.models import Estudiante
from src.estudiantes import schemas, exceptions
from src.encuesta import schemas as encuesta_schemas
from src.encuesta.models import Encuesta
from src.encuesta.exceptions import EncuestaNoEncontrada
# operaciones CRUD para Estudiantes

def listar_encuestas(db: Session, estudiante_id: int) -> List[encuesta_schemas.Encuesta]:
    alumno = db.get(Estudiante, estudiante_id)
    if alumno is None:
        raise exceptions.UsuarioNoEncontrado()
    return alumno.encuestas




from src.inscripciones.models import Inscripciones
from src.materias.models import Materias
from src.preguntas.models import Pregunta
from src.secciones.models import Seccion

def obtener_preguntas_de_encuesta_estudiante(db: Session, id_estudiante: int, id_encuesta: int):
    estudiante = (
        db.query(Estudiante)
        .options(
            joinedload(Estudiante.inscripciones)
            .joinedload(Inscripciones.materia)
            .joinedload(Materias.encuesta)
            .joinedload(Encuesta.secciones)
            .joinedload(Seccion.preguntas)
            .joinedload(Pregunta.opciones_respuestas)
        )
        .filter(Estudiante.id == id_estudiante)
        .first()
    )

    if not estudiante:
        raise exceptions.UsuarioNoEncontrado()

    for inscripcion in estudiante.inscripciones:
        materia = inscripcion.materia
        encuesta = materia.encuesta
        if encuesta and encuesta.id_encuesta == id_encuesta:
            encuesta.secciones.sort(key=lambda s: s.id)
            for seccion in encuesta.secciones:
                seccion.preguntas.sort(key=lambda p: p.id)
            return encuesta

    raise EncuestaNoEncontrada()
