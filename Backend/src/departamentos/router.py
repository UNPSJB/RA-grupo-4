from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.departamentos import schemas, services

router = APIRouter(prefix="/departamentos", tags=["departamentos"])

# Rutas para departamentos

@router.post("/", response_model=schemas.Departamento)
def create_departamento(departamento: schemas.DepartamentoCreate, db: Session = Depends(get_db)):
    return services.crear_departamento(db, departamento)

# --- CORRECCIÓN DE ERROR 500 (BUCLE DE RECURSIÓN) ---
# Se cambió el 'response_model' de esta ruta.
# Antes: response_model=list[schemas.Departamento] (Esto causaba el bucle)
# Ahora: response_model=list[schemas.DepartamentoSimple]
#
# 'DepartamentoSimple' solo devuelve 'id' y 'nombre', que es lo único
# que necesita el dropdown del frontend y evita el bucle de recursión.
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