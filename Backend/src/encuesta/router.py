from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.encuesta import schemas, services
from src.secciones.schemas import Seccion as SchemaSeccion
from typing import List, Dict, Any

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
    return services.leer_encuesta(db, id_encuesta)

@router.put("/{id_encuesta}", response_model=schemas.Encuesta)
def update_encuesta(id_encuesta: int, encuesta: schemas.EncuestaUpdate, db: Session = Depends(get_db)):
    return services.modificar_encuesta(db, id_encuesta, encuesta)

@router.delete("/{id_encuesta}", response_model=schemas.EncuestaDelete)
def delete_encuesta(id_encuesta: int, db: Session = Depends(get_db)):
    return services.eliminar_encuesta(db, id_encuesta)

@router.post("/{id_encuesta}/secciones", response_model=SchemaSeccion)
def agrega_seccion_a_encuesta(id_encuesta: int, seccion: SchemaSeccion, db: Session = Depends(get_db)):
    return services.agregar_seccion_a_encuesta(db, id_encuesta, seccion)

@router.get("/estudiantes/{estudiante_id}/encuestas_habilitadas", response_model=List[schemas.EncuestaDisponible], tags=["estudiantes"])
def seleccionar_encuestas_disponibles(estudiante_id: int, db: Session = Depends(get_db)):
    return services.get_encuestas_disponibles_por_estudiante(db, estudiante_id)

@router.get("/estudiantes/{estudiante_id}/historial")
def get_historial_estudiante(estudiante_id: int, db: Session = Depends(get_db)):
    return services.obtener_historial_materias_estudiante(db, estudiante_id)

@router.get("/estudiantes/{estudiante_id}/respuestas")
def get_historial_respuestas_filtrado(estudiante_id: int, db: Session = Depends(get_db)):
    """
    Ruta específica para el historial de encuestas completadas.
    Filtra las materias y devuelve SOLO las que ya tienen 'encuesta_procesada' = True.
    """
    todas_las_materias = services.obtener_historial_materias_estudiante(db, estudiante_id)
    
    historial_filtrado = []

    for materia in todas_las_materias:
        if materia["encuesta_procesada"] is True:
            historial_filtrado.append({
                "id": materia["id"],
                "materia_id": materia["id"],
                "materia_nombre": materia["nombre"],
                "encuesta_nombre": materia["encuesta_nombre"],
                "fecha_finalizacion": "Completada" 
            })
            
    return historial_filtrado

@router.get("/estudiantes/{estudiante_id}/respuestas/materia/{materia_id}", response_model=schemas.HistorialDetalle)
def get_mis_respuestas(estudiante_id: int, materia_id: int, db: Session = Depends(get_db)):
    return services.obtener_respuestas_alumno(db, estudiante_id, materia_id)

@router.get("/estadisticas/materia/{materia_id}", response_model=schemas.MateriaEstadisticas)
def get_estadisticas_docente(materia_id: int, db: Session = Depends(get_db)):
    return services.obtener_estadisticas_docente(db, materia_id)

@router.get("/estadisticas/materia/{materia_id}/publica", response_model=schemas.MateriaEstadisticas)
def get_estadisticas_alumno(materia_id: int, db: Session = Depends(get_db)):
    return services.obtener_estadisticas_alumno(db, materia_id)