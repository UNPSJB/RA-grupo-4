from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesSinteticos import schemas, services
from src.informesSinteticos.models import InformeSintetico
from src.materias.schemas import NecesidadMateriaSchema

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


# --- CRUD Básico ---

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

@router.get("/departamentos/{departamento_id}/necesidades", response_model=List[NecesidadMateriaSchema])
def obtener_necesidades_por_departamento(departamento_id: int, db: Session = Depends(get_db)):
    """
    Obtiene las necesidades de equipamiento y bibliografía de todas las materias
    de un departamento específico, basándose en los InformesAC.
    """
    # 1. Consultamos los informes AC de las materias del departamento
    informes = (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        .filter(Materias.id_departamento == departamento_id)
        .all()
    )

    # 2. Formateamos la respuesta como espera el frontend
    resultado = []
    for informe in informes:
        # Solo agregamos si tiene alguna necesidad registrada para no llenar de datos vacíos
        # (Opcional: si quieres mostrar todas las materias aunque no tengan necesidades, quita este if)
        if informe.necesidades_equipamiento or informe.necesidades_bibliografia:
            # Aseguramos que sean listas (depende de cómo lo guardes en BD)
            equip = informe.necesidades_equipamiento if isinstance(informe.necesidades_equipamiento, list) else []
            biblio = informe.necesidades_bibliografia if isinstance(informe.necesidades_bibliografia, list) else []

            resultado.append({
                "codigo_materia": informe.materia.codigoMateria,
                "nombre_materia": informe.materia.nombre,
                "necesidades_equipamiento": equip,
                "necesidades_bibliografia": biblio
            })

    return resultado


@router.get("/departamento/{departamento_id}/periodo/{anio}/informesAC")
def obtener_informesAC_asociados_a_informeSintetico(departamento_id: int, anio: int, db: Session = Depends(get_db)):
    return services.get_informesAC_asociados_a_informeSintetico(db, departamento_id, anio)


@router.get("/departamento/{departamento_id}/periodo/{anio}/informesAC/porcentajes")
def obtener_porcentajes_informesAC(departamento_id: int, anio: int, db: Session = Depends(get_db)):
    return services.get_porcentajes_informeSintetico(db, departamento_id, anio)

@router.get("/departamento/{departamento_id}/periodo/{anio}/informesAC/aspectosPositivosObstaculos")
def obtener_aspectosPosObs_informesAC(departamento_id: int, anio: int, db: Session = Depends(get_db)):
    return services.get_aspectos_positivo_y_obstaculos__informeSintetico(db, departamento_id, anio)