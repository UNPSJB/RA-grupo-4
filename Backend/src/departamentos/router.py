from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from src.database import get_db
from src.departamentos import schemas, services
from src.materias.models import Materias
# Asegúrate de que la carpeta sea exactamente 'informesAC' o 'informes_ac' según tu proyecto
from src.informesAC.models import InformesAC 
from src.periodos.schemas import PeriodoInformesSinteticosPendientes as PeriodoInformesSinteticosPendientesSchema

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

# --- ESQUEMAS LOCALES ---
class NecesidadMateriaSchema(BaseModel):
    codigo_materia: str
    nombre_materia: str
    necesidades_equipamiento: List[str]
    necesidades_bibliografia: List[str]

    class Config:
        from_attributes = True

# --- RUTAS CRUD ---

@router.post("/", response_model=schemas.Departamento)
def create_departamento(departamento: schemas.DepartamentoCreate, db: Session = Depends(get_db)):
    return services.crear_departamento(db, departamento)

@router.get("/", response_model=list[schemas.DepartamentoSimple])
def read_departamentos(db: Session = Depends(get_db)):
    return services.listar_departamentos(db)

@router.get("/{departamento_id}", response_model=schemas.Departamento)
def read_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.leer_departamento(db, departamento_id)

@router.put("/{departamento_id}", response_model=schemas.Departamento)
def update_departamento(
    departamento_id: int, departamento: schemas.DepartamentoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_departamento(db, departamento_id, departamento)

@router.delete("/{departamento_id}", response_model=schemas.DepartamentoDelete)
def delete_departamento(departamento_id: int, db: Session = Depends(get_db)):
    return services.eliminar_departamento(db, departamento_id)

# --- RUTAS ESPECIALES ---

@router.get("/{departamento_id}/resumen")
def resumen_departamento(departamento_id: int, db: Session = Depends(get_db)):
    # Endpoint que devuelve los datos generales del departamento
    return services.obtener_resumen_departamento(db, departamento_id)

@router.get("/{departamento_id}/necesidades", response_model=List[NecesidadMateriaSchema])
def obtener_necesidades_departamento(departamento_id: int, db: Session = Depends(get_db)):
    """
    Devuelve una lista con las necesidades de equipamiento y bibliografía
    de todas las materias que pertenecen al departamento especificado.
    """
    informes = (
        db.query(InformesAC)
        .join(Materias, InformesAC.id_materia == Materias.id_materia)
        .filter(Materias.id_departamento == departamento_id)
        .all()
    )

    resumen = []
    for informe in informes:
        # Solo agregamos si hay alguna necesidad registrada
        if informe.necesidades_equipamiento or informe.necesidades_bibliografia:
            # Garantizamos que siempre sean listas, incluso si la BD devuelve None
            equip = informe.necesidades_equipamiento if isinstance(informe.necesidades_equipamiento, list) else []
            biblio = informe.necesidades_bibliografia if isinstance(informe.necesidades_bibliografia, list) else []
            
            resumen.append({
                "codigo_materia": informe.materia.codigoMateria,
                "nombre_materia": informe.materia.nombre,
                "necesidades_equipamiento": equip,
                "necesidades_bibliografia": biblio,
            })

    return resumen



@router.get("/{departamento_id}/informes-sinteticos/pendientes", response_model=list[PeriodoInformesSinteticosPendientesSchema])
def periodos_pendientes(departamento_id: int, db: Session = Depends(get_db)):
    return services.listar_informes_sinteticos_pendientes_del_departamento(db, departamento_id)