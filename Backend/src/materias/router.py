from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services, models
from typing import List, Optional
import datetime # <-- NUEVA IMPORTACIÓN
from pydantic import BaseModel # <-- NUEVA IMPORTACIÓN
from src.periodos.services import get_periodo_informesAC_actual 

router = APIRouter(prefix="/materias", tags=["Materias"])

@router.get("/", response_model=List[schemas.Materia])
def leer_materias(db: Session = Depends(get_db)):
    return services.get_materias(db)

@router.get("/listar", response_model=List[schemas.MateriaAutocompletar])
def listar_materias(db: Session = Depends(get_db)):
    return services.get_materias_para_autocompletar(db)


@router.get("/docente/{id_docente}/pendientes", response_model=List[schemas.MateriaPendiente])
def listar_materias_pendientes(
    id_docente: int, 
    id_periodo: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de materias de un docente para las cuales
    AÚN NO se ha generado un InformeAC en el periodo especificado.
    """ 
    if id_periodo is None:
        periodo_actual = get_periodo_informesAC_actual(db)
        if not periodo_actual:
            raise HTTPException(404, "No es período activo de informes de Actividad Curricular.")
        id_periodo = periodo_actual.id

    materias = services.get_materias_pendientes_docente(
        db=db, 
        id_docente=id_docente, 
        id_periodo=id_periodo
    )
    return materias



@router.get(
    "/{materia_id}/estadisticas", response_model=schemas.MateriaEstadisticas
)
def leer_estadisticas_materia(materia_id: int, db: Session = Depends(get_db)):

    try:
        materia = db.get(models.Materias, materia_id)
        if not materia:
            raise HTTPException(status_code=404, detail="Materia no encontrada")
        estadisticas = services.get_estadisticas_materia(db=db, materia_id=materia_id)
        return estadisticas
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al obtener estadísticas de la materia")


@router.get("/docente/{id_docente}/estadisticas", response_model=schemas.EstadisticasDocenteOut)
def leer_estadisticas_por_docente(id_docente: int, db: Session = Depends(get_db)):
    
    try:
        estadisticas_lista = services.get_estadisticas_por_docente(db=db, id_docente=id_docente)
        return schemas.EstadisticasDocenteOut(estadisticas=estadisticas_lista)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al obtener estadísticas del docente")




@router.get("/{materia_id}/estadisticas/preguntas")
def obtener_estadisticas_materia(materia_id: int, db: Session = Depends(get_db)):
    """
    Devuelve las estadísticas de preguntas cerradas y abiertas por sección
    para una materia específica, basado en las encuestas procesadas.
    """
    resultado = services.obtener_estadisticas_materia(db, materia_id)
    
    return resultado