from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Any
from src.database import get_db
from src.informesSinteticos import schemas, services
from src.informesSinteticos.models import InformeSintetico
from src.materias.schemas import NecesidadMateriaSchema
# --- IMPORTACIÓN DE NUEVOS SCHEMAS PARA HISTORIAL ---
from src.informesSinteticos.schemas import GenerarSnapshotRequest, HistorialInformeSinteticoOut, HistorialInformeSinteticoDetalle

router = APIRouter(prefix="/informes-sinteticos", tags=["Informes Sintéticos"])

# =========================================
# === ENDPOINTS HISTORIAL ===
# =========================================

@router.post("/historial/generar", response_model=HistorialInformeSinteticoOut)
def generar_historial_snapshot(request: GenerarSnapshotRequest, db: Session = Depends(get_db)):
    """
    Genera una copia estática (Snapshot) de los datos actuales del departamento y periodo.
    Guarda el JSON en la base de datos para consulta futura.
    """
    return services.crear_snapshot_historico(
        db, 
        request.departamento_id, 
        request.periodo_id, 
        request.usuario
    )

@router.get("/historial/listar", response_model=List[HistorialInformeSinteticoOut])
def listar_historial_informes(db: Session = Depends(get_db)):
    """Devuelve la lista de informes guardados (sin el JSON pesado)."""
    return services.listar_historial(db)

@router.get("/historial/{id}", response_model=HistorialInformeSinteticoDetalle)
def ver_detalle_historial(id: int, db: Session = Depends(get_db)):
    """Devuelve el detalle completo de un informe histórico, incluyendo el JSON."""
    historial = services.obtener_historial_por_id(db, id)
    if not historial:
        raise HTTPException(status_code=404, detail="Informe histórico no encontrado")
    return historial


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
    return services.listar_actividades_para_informe(db=db)


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

@router.get("/cantidad", response_model=int)
def cantidad_informes_sinteticos(db: Session = Depends(get_db)):
    return db.query(InformeSintetico).filter(InformeSintetico.estado == "pendiente").count()


@router.get("/preview/general")
def preview_informe_general(
    departamento_id: int = Query(...), 
    periodo_id: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_resumen_general_periodo(db, departamento_id, periodo_id)

@router.get("/preview/necesidades")
def preview_necesidades(
    departamento_id: int = Query(...), 
    periodo_id: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_necesidades_periodo(db, departamento_id, periodo_id)

@router.get("/preview/valoraciones-miembros")
def preview_valoraciones_miembros(
    departamento_id: int = Query(...), 
    periodo_id: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_miembros_periodo(db, departamento_id, periodo_id)

@router.get("/preview/auxiliares")
def preview_auxiliares(
    departamento_id: int = Query(...), 
    periodo_id: int = Query(...), 
    db: Session = Depends(get_db)
):
    return services.obtener_auxiliares_periodo(db, departamento_id, periodo_id)


@router.post("/{id}/autocompletar-general")
def autocompletar_informe_general(id: int, db: Session = Depends(get_db)):
    informe = db.query(InformeSintetico).filter_by(id=id).first()
    if not informe: raise HTTPException(status_code=404, detail="Informe no encontrado")
    
    resumen = services.generar_resumen_informe_general(db, informe)
    informe.resumen_general = resumen 
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

@router.get("/departamentos/{departamento_id}/necesidades", response_model=List[NecesidadMateriaSchema])
def obtener_necesidades_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    from src.informesAC.models import InformesAC 
    from src.materias.models import Materias 

    informes = (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        .filter(Materias.id_departamento == departamento_id)
        .all()
    )

    resultado = []
    for informe in informes:
        if informe.necesidades_equipamiento or informe.necesidades_bibliografia:
            equip = informe.necesidades_equipamiento if isinstance(informe.necesidades_equipamiento, list) else []
            biblio = informe.necesidades_bibliografia if isinstance(informe.necesidades_bibliografia, list) else []

            resultado.append({
                "codigo_materia": informe.materia.codigoMateria,
                "nombre_materia": informe.materia.nombre,
                "necesidades_equipamiento": equip,
                "necesidades_bibliografia": biblio
            })

    return resultado


@router.get("/departamento/{departamento_id}/periodo/{periodo_id}/informesAC")
def obtener_informesAC_asociados_a_informeSintetico(departamento_id: int, periodo_id: int, db: Session = Depends(get_db)):
    return services.get_informesAC_asociados_a_informeSintetico(db, departamento_id, periodo_id)


@router.get("/departamento/{departamento_id}/periodo/{periodo_id}/informesAC/porcentajes")
def obtener_porcentajes_informesAC(departamento_id: int, periodo_id: int, db: Session = Depends(get_db)):
    return services.get_porcentajes_informeSintetico(db, departamento_id, periodo_id)

@router.get("/departamento/{departamento_id}/periodo/{periodo_id}/informesAC/aspectosPositivosObstaculos")
def obtener_aspectosPosObs_informesAC(departamento_id: int, periodo_id: int, db: Session = Depends(get_db)):
    return services.get_aspectos_positivo_y_obstaculos__informeSintetico(db, departamento_id, periodo_id)