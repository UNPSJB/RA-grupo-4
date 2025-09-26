from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.respuestas import schemas, services

router = APIRouter(prefix="/opcionRespuestas", tags=["opcionesRespuestas"])

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

