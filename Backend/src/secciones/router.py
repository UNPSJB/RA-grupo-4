from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.secciones import schemas, services

router = APIRouter(prefix="/secciones", tags=["secciones"])

# Rutas para Secciones

@router.post("/", response_model=schemas.Seccion)
def create_seccion(seccion: schemas.SeccionCreate, db: Session = Depends(get_db)):
    return services.crear_seccion(db, seccion)


@router.get("/", response_model=list[schemas.Seccion])
def read_seccions(db: Session = Depends(get_db)):
    return services.listar_seccions(db)


@router.get("/{seccion_id}", response_model=schemas.Seccion)
def read_seccion(seccion_id: int, db: Session = Depends(get_db)):
    return services.leer_seccion(db, seccion_id)


@router.put("/{seccion_id}", response_model=schemas.Seccion)
def update_seccion(
    seccion_id: int, seccion: schemas.SeccionUpdate, db: Session = Depends(get_db)
):
    return services.modificar_seccion(db, seccion_id, seccion)


@router.delete("/{seccion_id}", response_model=schemas.Seccion)
def delete_seccion(seccion_id: int, db: Session = Depends(get_db)):
    return services.eliminar_seccion(db, seccion_id)

