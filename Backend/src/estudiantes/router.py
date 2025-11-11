from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.estudiantes import schemas, services, exceptions 
from typing import List
from src.respuestas import schemas as schemasRespuesta, services as servicesRespuesta
from src.inscripciones.models import Inscripciones
from src.estudiantes.schemas import EncuestaDisponibleOut
from src.encuesta.schemas import Encuesta
from src.encuesta.exceptions import EncuestaNoEncontrada 

router = APIRouter(prefix="/estudiantes", tags=["estudiantes"])


@router.get("/{estudiante_id}/encuestas", response_model=List[EncuestaDisponibleOut])
def leer_encuestas_disponibles_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    """Lista las encuestas PENDIENTES para un estudiante."""
    try:
        return services.listar_encuestas_disponibles(db, estudiante_id)
    except exceptions.UsuarioNoEncontrado:
         raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    except Exception as e:
        print(f"Error inesperado en /encuestas: {e}") 
        raise HTTPException(status_code=500, detail="Error interno al listar encuestas")


@router.get("/{estudiante_id}/inscripciones/{inscripcion_id}/preguntas", response_model=Encuesta)
def ver_preguntas_encuesta_inscripcion(estudiante_id: int, inscripcion_id: int, db: Session = Depends(get_db)):
    """Obtiene las preguntas de la encuesta asociada a una inscripción específica."""
    try:
        encuesta = services.obtener_preguntas_de_encuesta_estudiante(db, estudiante_id, inscripcion_id)
        return encuesta
    except exceptions.UsuarioNoEncontrado:
         raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    except EncuestaNoEncontrada:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada para esta inscripción")
    except HTTPException as http_exc: 
        raise http_exc
    except Exception as e:
        print(f"Error inesperado en /preguntas: {e}") 
        raise HTTPException(status_code=500, detail="Error interno al obtener preguntas")


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

    # --- Verificación temprana si ya está procesada ---
    if inscripcion.encuesta_procesada:
         raise HTTPException(status_code=400, detail="Esta encuesta ya ha sido respondida.")
    # --- FIN Verificación ---


    if not respuestas:
        raise HTTPException(status_code=400, detail="No se enviaron respuestas")

    # Asignar la inscripcion_id a cada respuesta y validar
    for r in respuestas:
        if r.inscripcion_id != inscripcion_id:
             raise HTTPException(status_code=400, detail="Inconsistencia en el ID de inscripción de las respuestas.")
    

    try:
        # Llamamos a crear_respuestas
        nuevas_respuestas = servicesRespuesta.crear_respuestas(db, respuestas)
        return nuevas_respuestas
    except HTTPException as e: 
        raise e
    except Exception as e:
        print(f"Error inesperado en POST /respuestas: {e}") 
        raise HTTPException(status_code=500, detail="Error interno al guardar respuestas")