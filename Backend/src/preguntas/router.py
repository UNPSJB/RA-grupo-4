from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.preguntas import schemas, services

router = APIRouter(prefix="/preguntas", tags=["preguntas"])

# Rutas para Preguntas


@router.post("/", response_model=schemas.Pregunta)
def create_pregunta(pregunta: schemas.PreguntaCreate, db: Session = Depends(get_db)):
    return services.crear_pregunta(db, pregunta)


@router.get("/", response_model=list[schemas.Pregunta])
def read_preguntas(db: Session = Depends(get_db)):
    return services.listar_preguntas(db)


@router.get("/{pregunta_id}", response_model=schemas.Pregunta)
def read_pregunta(pregunta_id: int, db: Session = Depends(get_db)):
    return services.leer_pregunta(db, pregunta_id)


@router.put("/{pregunta_id}", response_model=schemas.Pregunta)
def update_pregunta(
    pregunta_id: int, pregunta: schemas.PreguntaUpdate, db: Session = Depends(get_db)
):
    return services.modificar_pregunta(db, pregunta_id, pregunta)


@router.delete("/{pregunta_id}", response_model=schemas.Pregunta)
def delete_pregunta(pregunta_id: int, db: Session = Depends(get_db)):
    return services.eliminar_pregunta(db, pregunta_id)





@router.post("/{pregunta_id}/opciones", response_model=schemas.OpcionRespuesta)
def crear_opcion(pregunta_id: int, opcion: schemas.OpcionRespuestaCreate, db: Session = Depends(get_db)):
    return services.agregar_opcion_respuesta(db, pregunta_id, opcion)


@router.delete("/{pregunta_id}/opciones/{opcion_id}", response_model=schemas.OpcionRespuesta)
def borrar_opcion(pregunta_id: int, opcion_id: int, db: Session = Depends(get_db)):
    opcion_delete = schemas.OpcionRespuestaDelete(id=opcion_id, pregunta_id=pregunta_id)
    return services.eliminar_opcion_respuesta(db, pregunta_id, opcion_delete)

