from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, services, models
from typing import List
import datetime # <-- NUEVA IMPORTACIÓN
from pydantic import BaseModel # <-- NUEVA IMPORTACIÓN

router = APIRouter(prefix="/materias", tags=["Materias"])

@router.get("/", response_model=List[schemas.Materia])
def leer_materias(db: Session = Depends(get_db)):
    return services.get_materias(db)

@router.get("/listar", response_model=List[schemas.MateriaAutocompletar])
def listar_materias(db: Session = Depends(get_db)):
    return services.get_materias_para_autocompletar(db)


# --- NUEVO ENDPOINT (Para la lista de pendientes) ---
# (Definimos un schema de salida simple aquí mismo)
class MateriaPendiente(BaseModel): 
    id_materia: int
    nombre: str
    codigoMateria: str
    anio: int 
    
    class Config:
        from_attributes = True

@router.get("/docente/{id_docente}/pendientes", response_model=List[MateriaPendiente])
def listar_materias_pendientes(
    id_docente: int, 
    # Usamos Query para obtener el ciclo lectivo, con el año actual como default
    ciclo_lectivo: int = Query(default_factory=lambda: datetime.date.today().year),
    db: Session = Depends(get_db)
):
    """
    Obtiene la lista de materias de un docente para las cuales
    AÚN NO se ha generado un InformeAC en el ciclo lectivo especificado.
    """
    materias = services.get_materias_pendientes_docente(
        db=db, 
        id_docente=id_docente, 
        ciclo_lectivo=ciclo_lectivo
    )
    return materias
# --- FIN NUEVO ENDPOINT ---


@router.get(
    "/{materia_id}/estadisticas", response_model=schemas.MateriaEstadisticas
)
def leer_estadisticas_materia(materia_id: int, db: Session = Depends(get_db)):
    # (Tu código original sin cambios)
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
    # (Tu código original sin cambios)
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