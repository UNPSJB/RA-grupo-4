from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.productos.models import Producto
from src.productos import schemas, exceptions

# operaciones CRUD para Productos

def crear_producto(db: Session, producto: schemas.ProductoCreate) -> schemas.Producto:
    _producto = Producto(**producto.model_dump())
    db.add(_producto)
    db.commit()
    db.refresh(_producto)
    return _producto


def listar_productos(db: Session) -> List[schemas.Producto]:
    return db.scalars(select(Producto)).all()


def leer_producto(db: Session, producto_id: int) -> schemas.Producto:
    db_producto = db.scalar(select(Producto).where(Producto.id == producto_id))
    if db_producto is None:
        raise exceptions.ProductoNoEncontrado()
    return db_producto


def modificar_producto(
    db: Session, producto_id: int, producto: schemas.ProductoUpdate) -> Producto:
    db_producto = leer_producto(db, producto_id)
    db.execute(
        update(Producto).where(Producto.id == producto_id).values(**producto.model_dump())
    )
    db.commit()
    db.refresh(db_producto)
    return db_producto


def eliminar_producto(db: Session, producto_id: int) -> schemas.Producto:
    db_producto = leer_producto(db, producto_id)
    db.execute(delete(Producto).where(Producto.id == producto_id))
    db.commit()
    return db_producto
