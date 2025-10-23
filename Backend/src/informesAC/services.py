from typing import List
from sqlalchemy.orm import Session
from src.informesAC.models import InformesAC
from src.informesAC import schemas, models

def listar_todos_los_informes(db: Session):
    return db.query(models.InformesAC).all()

def filtrar_informes(
    db: Session,
    id_docente: int | None = None,
    id_materia: int | None = None,
    id_carrera: int | None = None
):
    query = db.query(InformesAC)

    if id_docente is not None:
        query = query.filter(InformesAC.id_docente == id_docente)

    if id_materia is not None:
        query = query.filter(InformesAC.id_materia == id_materia)
        
    if id_carrera is not None:
        query = query.filter(InformesAC.id_carrera == id_carrera)

    return query.all()


def create_informe_ac(db: Session, informe: schemas.InformeACCreate):
    db_informe = models.InformesAC(
        # Datos Generales
        id_docente=informe.id_docente,
        id_materia=informe.id_materia,
        sede=informe.sede,
        ciclo_lectivo=informe.ciclo_lectivo,
        cantidad_alumnos_inscriptos=informe.cantidad_alumnos_inscriptos,
        cantidad_comisiones_teoricas=informe.cantidad_comisiones_teoricas,
        cantidad_comisiones_practicas=informe.cantidad_comisiones_practicas,
        
        # Datos de Necesidades (listas de strings)
        necesidades_equipamiento=informe.necesidades_equipamiento,
        necesidades_bibliografia=informe.necesidades_bibliografia
    )
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe
