from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.respuestas.models import OpcionRespuesta
from src.respuestas import models, schemas, exceptions
from src.inscripciones.models import Inscripciones
from src.encuesta.models import Encuesta
from src.preguntas.models import Pregunta

def crear_opcionRespuesta(db: Session, opcionRespuesta: schemas.OpcionRespuestaCreate) -> schemas.OpcionRespuesta:
    _opcionRespuesta = OpcionRespuesta(**opcionRespuesta.model_dump())
    db.add(_opcionRespuesta)
    db.commit()
    db.refresh(_opcionRespuesta)
    return _opcionRespuesta


def listar_opcionRespuestas(db: Session) -> List[schemas.OpcionRespuesta]:
    return db.scalars(select(OpcionRespuesta)).all()


def leer_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = db.scalar(select(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id))
    if db_opcionRespuesta is None:
        raise exceptions.OpcionRespuestaNoEncontrada()
    return db_opcionRespuesta


def modificar_opcionRespuesta(
    db: Session, opcionRespuesta_id: int, opcionRespuesta: schemas.OpcionRespuestaUpdate
) -> OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    db.execute(
        update(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id).values(**opcionRespuesta.model_dump())
    )
    db.commit()
    db.refresh(db_opcionRespuesta)
    return db_opcionRespuesta


def eliminar_opcionRespuesta(db: Session, opcionRespuesta_id: int) -> schemas.OpcionRespuesta:
    db_opcionRespuesta = leer_opcionRespuesta(db, opcionRespuesta_id)
    # La siguiente validación parece tener un error de lógica (debería ser sobre otra tabla),
    # pero se mantiene como estaba en tu código original.
    # if len(db_opcionRespuesta.opciones_respuestas) > 0:
    #     raise exceptions.OpcionRespuestaTieneOpcionRespuesta()
    db.execute(delete(OpcionRespuesta).where(OpcionRespuesta.id == opcionRespuesta_id))
    db.commit()
    return db_opcionRespuesta

def crear_respuestas(db: Session, respuestas_recibidas: list[schemas.RespuestaCreate]) -> list[models.Respuesta]:
    
    if not respuestas_recibidas:
        return [] 

    inscripcion_id_actual = respuestas_recibidas[0].inscripcion_id
    
    try:
        # --- Inicio de la Transacción Atómica ---
        
        # Creamos los objetos Respuesta y los añadimos a la sesión
        respuestas_a_crear = []
        for r in respuestas_recibidas:
            respuesta_obj = models.Respuesta(**r.model_dump())
            db.add(respuesta_obj)
            respuestas_a_crear.append(respuesta_obj)

        # Obtenemos la inscripción y verificamos si ya está procesada
        inscripcion = db.get(Inscripciones, inscripcion_id_actual)
        if not inscripcion:
             raise Exception(f"No se encontró la inscripción con id {inscripcion_id_actual}")
        
        if inscripcion.encuesta_procesada:
            # Si ya está procesada, simplemente guardamos las nuevas respuestas y terminamos
            db.commit()
            for r in respuestas_a_crear:
                db.refresh(r)
            return respuestas_a_crear
        
        #  Contamos el N° de preguntas OBLIGATORIAS (N)
        primera_encuesta = db.query(Encuesta).first()
        if not primera_encuesta:
             raise Exception("No hay encuestas configuradas en el sistema.")
        
        total_preguntas_obligatorias = (
            db.query(Pregunta)
            .filter(Pregunta.encuesta_id == primera_encuesta.id_encuesta, Pregunta.obligatoria == True)
            .count()
        )

        db.flush()

        # Contamos el N° de respuestas OBLIGATORIAS (R) que tiene el estudiante AHORA
        total_respuestas_obligatorias = (
            db.query(models.Respuesta)
            .join(Pregunta, models.Respuesta.pregunta_id == Pregunta.id)
            .filter(models.Respuesta.inscripcion_id == inscripcion_id_actual, Pregunta.obligatoria == True)
            .count()
        )
        
        # Comparamos y actualizamos el estado si es necesario
        if total_preguntas_obligatorias > 0 and total_respuestas_obligatorias >= total_preguntas_obligatorias:
            inscripcion.encuesta_procesada = True
            db.add(inscripcion)

        # Hacemos UN SOLO commit para guardar TODO a la vez (respuestas y estado)
        db.commit()
        
        # --- Fin de la Transacción ---

        for r in respuestas_a_crear:
            db.refresh(r)
        
        return respuestas_a_crear

    except Exception as e:
        db.rollback() 
        raise e