from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services


router = APIRouter(prefix="/informesAC", tags=["InformesAC"])

@router.get("/listar", response_model=List[schemas.InformeAC])
def listar_todos_los_informes(db: Session = Depends(get_db)):
    return services.listar_todos_los_informes(db)

@router.get("/filtradoInformesAc", response_model=List[schemas.InformeAC])
def filtrado_informes_ac(
    id_docente: int | None = Query(None, description="ID del docente"),
    id_materia: int | None = Query(None, description="ID de la materia"),
    db: Session = Depends(get_db)
):
    
    informes = services.filtrar_informes(
        db=db,
        id_docente=id_docente,
        id_materia=id_materia,
    )
  
    return informes

@router.get("/docente/{id_docente}", response_model=List[schemas.InformeAC])
def listar_informes_por_docente(id_docente: int, db: Session = Depends(get_db)):
    # --- CORRECCIÓN: Eliminamos el argumento id_carrera ---
    informes = services.filtrar_informes(
        db=db,
        id_docente=id_docente,
        id_materia=None,
    )
    

    if not informes:
        return []

    return informes

@router.post("/crear", response_model=schemas.InformeAC)
def crear_nuevo_informe_ac(
    informe: schemas.InformeACCreate,
    db: Session = Depends(get_db)
):
    return services.create_informe_ac(db=db, informe=informe)



