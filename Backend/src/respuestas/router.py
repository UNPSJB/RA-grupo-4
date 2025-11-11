from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.respuestas import schemas, services
from typing import List

router = APIRouter(prefix="/opcionRespuestas", tags=["opcionesRespuestas"])
router_respuestas = APIRouter(prefix="/respuestas", tags=["Respuestas"])

# Rutas para Respuestas

@router.post("/", response_model=schemas.OpcionRespuesta)
def create_opcionRespuesta(opcionRespuesta: schemas.OpcionRespuestaCreate, db: Session = Depends(get_db)):
    return services.crear_opcionRespuesta(db, opcionRespuesta)


@router.get("/", response_model=list[schemas.OpcionRespuesta])
def read_opcionRespuestas(db: Session = Depends(get_db)):
    return services.listar_opcionRespuestas(db)


@router.get("/{opcionRespuesta_id}", response_model=schemas.OpcionRespuesta)
def read_opcionRespuesta(opcionRespuesta_id: int, db: Session = Depends(get_db)):
    return services.leer_opcionRespuesta(db, opcionRespuesta_id)


@router.put("/{opcionRespuesta_id}", response_model=schemas.OpcionRespuesta)
def update_opcionRespuesta(
    opcionRespuesta_id: int, opcionRespuesta: schemas.OpcionRespuestaUpdate, db: Session = Depends(get_db)
):
    return services.modificar_opcionRespuesta(db, opcionRespuesta_id, opcionRespuesta)


@router.delete("/{opcionRespuesta_id}", response_model=schemas.OpcionRespuesta)
def delete_opcionRespuesta(opcionRespuesta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_opcionRespuesta(db, opcionRespuesta_id)


@router_respuestas.post("/", response_model=List[schemas.Respuesta])
def create_respuestas(respuestas: List[schemas.RespuestaCreate], db: Session = Depends(get_db)):
    """
    Recibe una lista de respuestas de un estudiante y las guarda.
    
    Esta es la función que disparará la lógica para marcar
    la encuesta como "procesada".
    """
    return services.crear_respuestas(db=db, respuestas_recibidas=respuestas)
