from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.estudiantes import schemas, services
from src.encuesta.schemas import Encuesta
from typing import List

from src.respuestas import schemas as schemasRespuesta, services as servicesRespuesta
from src.inscripciones.models import Inscripciones


router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])


# Rutas para Estudiantes
    
@router.get("/{estudiante_id}/encuestas", response_model=List[Encuesta])
def leer_encuestas_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return services.listar_encuestas(db, estudiante_id)


@router.get("/{estudiante_id}/encuestas/{encuesta_id}/preguntas", response_model=Encuesta)
def ver_preguntas_encuesta_estudiante(estudiante_id: int, encuesta_id: int, db: Session = Depends(get_db)):
    encuesta = services.obtener_preguntas_de_encuesta_estudiante(db, estudiante_id, encuesta_id)
    return encuesta




@router.post("/{estudiante_id}/inscripciones/{inscripcion_id}/respuestas", response_model=List[schemasRespuesta.Respuesta])
def responder_encuesta(
    estudiante_id: int,
    inscripcion_id: int,
    respuestas: List[schemasRespuesta.RespuestaCreate],
    db: Session = Depends(get_db)
):
    # Verificar que la inscripción exista y pertenezca al estudiante
    inscripcion = db.query(Inscripciones).filter(
        Inscripciones.id == inscripcion_id,
        Inscripciones.estudiante_id == estudiante_id
    ).first()

    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada para este estudiante")

    if not respuestas:
        raise HTTPException(status_code=400, detail="No se enviaron respuestas")

    # Asignar la inscripcion_id a cada respuesta (por seguridad)
    for r in respuestas:
        r.inscripcion_id = inscripcion_id

    nuevas_respuestas = servicesRespuesta.crear_respuestas(db, respuestas)
    return nuevas_respuestas
