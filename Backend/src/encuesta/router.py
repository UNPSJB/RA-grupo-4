from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuesta import schemas, services
from src.preguntas.schemas import Pregunta as PreguntaSchema, PreguntaCreate as PreguntaCreateSchema

router = APIRouter(prefix="/encuestas", tags=["encuestas"])


@router.post("/", response_model=schemas.Encuesta)
def create_encuesta(encuesta: schemas.EncuestaCreate, db: Session = Depends(get_db)):
    return services.crear_encuesta(db, encuesta)

@router.get("/disponibles", response_model=list[schemas.Encuesta])
def read_encuestas_disponibles(db: Session = Depends(get_db)):
    return services.listar_encuestas_disponibles(db)


@router.get("/", response_model=list[schemas.Encuesta])
def read_encuestas(db: Session = Depends(get_db)):
    return services.listar_encuestas(db)


@router.get("/{id_encuesta}", response_model=schemas.Encuesta)
def read_encuesta(id_encuesta: int, db: Session = Depends(get_db)):
    try:
        encuesta = services.leer_encuesta(db, id_encuesta)
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        return encuesta
    except Exception as e:
        import traceback
        print("❌ ERROR en read_encuesta")
        traceback.print_exc()  # esto te muestra el error real en consola
        raise HTTPException(status_code=500, detail=str(e))



@router.put("/{id_encuesta}", response_model=schemas.Encuesta)
def update_encuesta(
    id_encuesta: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)
):
    encuesta_actualizada = services.modificar_encuesta(db, id_encuesta, encuesta)
    if not encuesta_actualizada:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
    return encuesta_actualizada


@router.delete("/{id_encuesta}", response_model=schemas.EncuestaDelete)
def delete_encuesta(id_encuesta: int, db: Session = Depends(get_db)):
    encuesta_eliminada = services.eliminar_encuesta(db, id_encuesta)
    if not encuesta_eliminada:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")
    return encuesta_eliminada



@router.post("/{id_encuesta}/preguntas", response_model=PreguntaSchema)
def agregar_pregunta_encuesta(id_encuesta: int, pregunta: PreguntaCreateSchema, db: Session = Depends(get_db)):
    return services.agregar_pregunta_a_encuesta(db, id_encuesta, pregunta)
