from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services, exceptions
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




@router.put("/{id_informe}/opinion", response_model=schemas.InformeAC)
def actualizar_opinion(id_informe: int, opinion: str, db: Session = Depends(get_db)):
    informe_actualizado = services.actualizar_opinion_informe(db, id_informe, opinion)
    return schemas.InformeAC.from_orm(informe_actualizado)



@router.get("/resumen/{id_informe}", response_model=List[schemas.SeccionResumen])
def obtener_resumen_secciones_informeAC(id_informe: int, db: Session = Depends(get_db)):
    
    informe = services.read_informeAC(db, id_informe) 

    resumen_secciones = services.cargar_resumen_secciones_informe(informe, db)

    return resumen_secciones


@router.get("/resumen/materia/{id_materia}", response_model=List[schemas.SeccionResumen])
def obtener_resumen_secciones_por_materia_informeAC(id_materia: int, db: Session = Depends(get_db)):
    # Creamos un "informe temporal" para calcular el resumen

    informe_temp = InformesAC(id_materia=id_materia)
    resumen = services.cargar_resumen_secciones_informe(informe_temp, db)
    return resumen