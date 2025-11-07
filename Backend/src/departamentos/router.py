from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.departamentos import schemas, services

from src.materias.models import Materias
from src.informesAC.models import InformesAC

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

# Rutas para departamentos


@router.post("/", response_model=schemas.Departamento)
def create_departamento(departamento: schemas.DepartamentoCreate, db: Session = Depends(get_db)):
    return services.crear_departamento(db, departamento)


@router.get("/", response_model=list[schemas.Departamento])
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

@router.get("/{departamento_id}/resumen")
def resumen_departamento(departamento_id: int, db: Session = Depends(get_db)):
    """
    Endpoint que devuelve los datos generales del departamento (para el informe sintético)
    """
    return services.obtener_resumen_departamento(db, departamento_id)

@router.get("/{departamento_id}/necesidades")
def obtener_necesidades_departamento(departamento_id: int, db: Session = Depends(get_db)):
    """
    Devuelve las necesidades de un departamento
    """
   
    materias = db.query(Materias).filter(Materias.departamento.has(id=departamento_id)).all()
    
    if not materias:
        raise HTTPException(status_code=404, detail="No se encontraron materias para este departamento")

    resumen = []
    for materia in materias:
        for informe_ac in materia.informesAC:
            resumen.append({
                "codigo_materia": materia.codigoMateria,
                "nombre_materia": materia.nombre,
                "necesidades_equipamiento": informe_ac.necesidades_equipamiento or [],
                "necesidades_bibliografia": informe_ac.necesidades_bibliografia or [],
            })
    return resumen