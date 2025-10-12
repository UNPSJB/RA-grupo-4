from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services
from src.docentes.models import Docentes
from src.informesAC.models import InformesAC
from src.carreras.models import Carreras
from src.materias.models import Materias

router = APIRouter(prefix="/informesAC", tags=["InformesAC"])


@router.get("/todos", response_model=List[schemas.InformeAC])
def listar_todos_los_informes(db: Session = Depends(get_db)):
    #Devuelve el historial completo de informes curriculares.
    return services.listar_todos_los_informes(db)

@router.get("/filtradoInformesAc", response_model=List[schemas.InformeAC])
def filtrado_informes_ac(
    id_docente: int | None = Query(None, description="ID del docente"),
    id_materia: int | None = Query(None, description="ID de la materia"),
    anio: int | None = Query(None, description="Año del informe"),
    id_carrera: int | None = Query(None, description="ID de la carrera"),
    db: Session = Depends(get_db)
):
    informes = services.filtrar_informes(
        db=db,
        id_docente=id_docente,
        id_materia=id_materia,
        anio=anio,
        id_carrera=id_carrera
    )
    return informes

@router.get("/docente/{id_docente}", response_model=List[schemas.InformeAC])
def listar_informes_por_docente(id_docente: int, db: Session = Depends(get_db)):
    #Devuelve todos los informes curriculares asociados a un docente específico.
    service = services.InformeACService(db)
    return service.obtener_informes_por_docente(id_docente)
