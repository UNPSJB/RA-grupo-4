from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesSinteticos import schemas, services
from src.informesSinteticos.models import InformeSintetico

router = APIRouter(prefix="/informes-sinteticos", tags=["Informes Sintéticos"])



# --- CRUD Básico ---
@router.post("/", response_model=schemas.InformeSintetico)
def crear_informe_sintetico(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)

@router.get("/", response_model=List[schemas.InformeSintetico])
def leer_informesSinteticos(db: Session = Depends(get_db)):
    return services.listar_informesSinteticos(db)

@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def obtener_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    informe = services.obtener_informe_sintetico(db, informe_id)
    if not informe:
        raise HTTPException(status_code=404, detail="Informe Sintético no encontrado")
    return informe

# =========================================
# === ENDPOINTS DE PREVIEW (GET) ===
# Para usar en el formulario ANTES de crear el informe
# =========================================

@router.get("/preview/general")
def preview_informe_general(
    departamento_id: int = Query(...), 
    anio: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_resumen_general_periodo(db, departamento_id, anio)

@router.get("/preview/necesidades")
def preview_necesidades(
    departamento_id: int = Query(...), 
    anio: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_necesidades_periodo(db, departamento_id, anio)

@router.get("/preview/valoraciones-miembros")
def preview_valoraciones_miembros(
    departamento_id: int = Query(...), 
    anio: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_miembros_periodo(db, departamento_id, anio)

@router.get("/preview/auxiliares")
def preview_auxiliares(
    departamento_id: int = Query(...), 
    anio: int = Query(...), 
    db: Session = Depends(get_db)
):
    """Nuevo endpoint para recuperar auxiliares cargados por docentes."""
    return services.obtener_auxiliares_periodo(db, departamento_id, anio)

# =========================================
# === ENDPOINTS DE AUTOCOMPLETADO (POST) ===
# Para guardar datos en un informe YA CREADO
# =========================================

@router.post("/{id}/autocompletar-general")
def autocompletar_informe_general(id: int, db: Session = Depends(get_db)):
    informe = db.query(InformeSintetico).filter_by(id=id).first()
    if not informe: raise HTTPException(status_code=404, detail="Informe no encontrado")
    
    resumen = services.generar_resumen_informe_general(db, informe)
    informe.resumen_general = resumen # Asegúrate que tu modelo soporte asignar JSON/dict directamente si usas un tipo JSON en SQLAlchemy, o usa json.dumps si es Text.
    db.commit()
    return {"mensaje": "Resumen general generado", "resumen": resumen}

@router.post("/{id}/autocompletar-necesidades")
def autocompletar_necesidades(id: int, db: Session = Depends(get_db)):
    informe = db.query(InformeSintetico).filter_by(id=id).first()
    if not informe: raise HTTPException(status_code=404, detail="Informe no encontrado")

    resumen = services.generar_resumen_necesidades(db, informe)
    informe.resumen_necesidades = resumen
    db.commit()
    return {"mensaje": "Resumen de necesidades generado", "resumen": resumen}

@router.post("/{id}/autocompletar-valoraciones")
def autocompletar_valoraciones_miembros(id: int, db: Session = Depends(get_db)):
    informe = db.query(InformeSintetico).filter_by(id=id).first()
    if not informe: raise HTTPException(status_code=404, detail="Informe no encontrado")

    valoraciones = services.generar_valoracion_miembros(db, informe)
    informe.valoracion_miembros = valoraciones
    db.commit()
    return {"mensaje": "Lista de valoración de miembros generada", "valoraciones": valoraciones}

