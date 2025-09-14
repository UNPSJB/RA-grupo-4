from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.productos import schemas, services

router = APIRouter(prefix="/productos", tags=["productos"])

# Rutas para Productos


@router.post("/", response_model=schemas.Producto)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    return services.crear_producto(db, producto)


@router.get("/", response_model=list[schemas.Producto])
def read_productos(db: Session = Depends(get_db)):
    return services.listar_productos(db)


@router.get("/{producto_id}", response_model=schemas.Producto)
def read_producto(producto_id: int, db: Session = Depends(get_db)):
    return services.leer_producto(db, producto_id)


@router.put("/{producto_id}", response_model=schemas.Producto)
def update_producto(
    producto_id: int, producto: schemas.ProductoUpdate, db: Session = Depends(get_db)
):
    return services.modificar_producto(db, producto_id, producto)


@router.delete("/{producto_id}", response_model=schemas.Producto)
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    return services.eliminar_producto(db, producto_id)

