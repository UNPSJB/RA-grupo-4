
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services
from src.docentes.models import Docentes
from src.informesAC.models import InformesAC
from src.carreras.models import Carreras
from src.materias.models import Materias

router = APIRouter(prefix="/informesAC", tags=["InformesAC"])

@router.get("/listar", response_model=List[schemas.InformeAC])
def listar_todos_los_informes(db: Session = Depends(get_db)):
    return services.listar_todos_los_informes(db)

@router.get("/filtradoInformesAc", response_model=List[schemas.InformeAC])
def filtrado_informes_ac(
    id_docente: int | None = Query(None, description="ID del docente"),
    id_materia: int | None = Query(None, description="ID de la materia"),
    id_carrera: int | None = Query(None, description="ID de la carrera"),
    db: Session = Depends(get_db)
):
    informes = services.filtrar_informes(
        db=db,
        id_docente=id_docente,
        id_materia=id_materia,
        id_carrera=id_carrera
    )
    return informes

@router.get("/docente/{id_docente}", response_model=List[schemas.InformeAC])
def listar_informes_por_docente(id_docente: int, db: Session = Depends(get_db)):
    informes = services.filtrar_informes(
        db=db, 
        id_docente=id_docente, 
        id_materia=None, 
        id_carrera=None
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


@router.get("/materias/{id_materia}", response_model=schemas.MateriaOut)
def get_materia_info(id_materia: int, db: Session = Depends(get_db)):
    db_materia = db.query(Materias).filter(Materias.id_materia == id_materia).first()
    
    if not db_materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")
    
    return db_materia