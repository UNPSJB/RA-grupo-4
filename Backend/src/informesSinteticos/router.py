from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesSinteticos import schemas, services

router = APIRouter(prefix="/informes-sinteticos", tags=["Informes Sintéticos"])


# --- CORRECCIÓN DE LA HDU (Apuntando al nuevo servicio y schema) ---
# Se ha cambiado 'generar_informe_sintetico_consolidado' por 'listar_actividades_para_informe'
# y el 'response_model' ahora es 'InformeSinteticoActividades' (el que no consolida).
# Esta ruta debe ir ANTES de '/{informe_id}' para evitar el error 422.
@router.get(
    "/actividades", 
    response_model=schemas.InformeSinteticoActividades,
    summary="Genera el Informe Sintético listando las actividades de la cátedra."
)
def get_informe_sintetico_actividades(db: Session = Depends(get_db)):
    """
    Obtiene CADA registro de actividad individual, junto con los datos
    de la materia a la que pertenece (Código y Nombre).
    NO se agrupan ni consolidan los datos.
    """
    # Llama a la nueva función de servicio
    return services.listar_actividades_para_informe(db=db)

# --- FIN DE LA CORRECCIÓN ---


# --- Tus Endpoints CRUD (Se mantienen sin cambios) ---

@router.post("/", response_model=schemas.InformeSintetico)
def crear_informe_sintetico(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)


@router.get("/", response_model=List[schemas.InformeSintetico])
def leer_informesSinteticos(db: Session = Depends(get_db)):
    return services.listar_informesSinteticos(db)


@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def obtener_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    # Esta ruta ahora se comprueba DESPUÉS de /actividades
    informe = services.obtener_informe_sintetico(db, informe_id)
    if not informe:
        raise HTTPException(status_code=404, detail="Informe Sintético no encontrado")
    return informe