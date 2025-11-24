from typing import List
from sqlalchemy import delete, select, update, func
from sqlalchemy.orm import Session
from src.departamentos.models import Departamento
from src.departamentos import schemas, exceptions, models
from src.materias.models import Materias
from src.informesAC.models import InformesAC
from src.periodos.models import Periodo
from src.informesSinteticos.models import InformeSintetico
from datetime import date
# operaciones CRUD para Departamento


def crear_departamento(db: Session, departamento: schemas.DepartamentoCreate) -> schemas.Departamento:
    _departamento = Departamento(**departamento.model_dump())
    db.add(_departamento)
    db.commit()
    db.refresh(_departamento)
    return _departamento


# def listar_departamentos(db: Session) -> List[schemas.Departamento]:
#     return db.scalars(select(Departamento)).all()
def listar_departamentos(db: Session):
    return db.query(models.Departamento).all()


def leer_departamento(db: Session, departamento_id: int) -> schemas.Departamento:
    db_departamento = db.scalar(select(Departamento).where(Departamento.id == departamento_id))
    if db_departamento is None:
        raise exceptions.DepartamentoNoEncontrada()
    return db_departamento


def modificar_departamento(
    db: Session, departamento_id: int, departamento: schemas.DepartamentoUpdate
) -> Departamento:
    db_departamento = leer_departamento(db, departamento_id)
    db.execute(update(Departamento).where(Departamento.id == departamento_id).values(**departamento.model_dump()))
    db.commit()
    db.refresh(db_departamento)
    return db_departamento


def eliminar_departamento(db: Session, departamento_id: int) -> schemas.DepartamentoDelete:
    db_departamento = leer_departamento(db, departamento_id)
    db.execute(
        delete(Departamento).where(Departamento.id == departamento_id)
    )
    db.commit()
    return db_departamento

def obtener_resumen_departamento(db: Session, departamento_id: int):
    """
    Devuelve un resumen general del departamento:
    materias, cantidad de alumnos inscriptos, comisiones teóricas y prácticas.
    """
    materias = db.query(Materias).filter(Materias.id_departamento == departamento_id).all()

    resumen = []
    for materia in materias:
        # buscar el último informe asociado a la materia (si hay varios)
        informe_ac = (
            db.query(InformesAC)
            .filter(InformesAC.id_materia == materia.id_materia)
            .order_by(InformesAC.ciclo_lectivo.desc())
            .first()
        )
        resumen.append({
            "codigo": materia.codigoMateria,
            "nombre": materia.nombre,
            "ciclo lectivo": materia.periodo.ciclo_lectivo,
            "cuatrimestre": materia.periodo.cuatrimestre,
            "alumnos_inscriptos": informe_ac.cantidad_alumnos_inscriptos if informe_ac else 0,
            "comisiones_teoricas": informe_ac.cantidad_comisiones_teoricas if informe_ac else 0,
            "comisiones_practicas": informe_ac.cantidad_comisiones_practicas if informe_ac else 0,
        })

    return resumen



def listar_informes_sinteticos_pendientes_del_departamento(db: Session, departamento_id: int):

    hoy = date.today()

    # Periodos cuyo cierre de informes AC ya pasó
    periodos_cerrados = (
        db.query(Periodo)
        .filter(Periodo.fecha_cierre_informesAC < hoy)
    )

    # Periodos que ya tienen un informe sintetico del departamento
    periodos_con_informe = (
        db.query(InformeSintetico.periodo_id)
        .filter(InformeSintetico.departamento_id == departamento_id)
        .subquery()
    )

    # Verifica que el periodo tenga un informeAC hecho para el departamento
    periodos_con_informesAC_del_departamento = (
    db.query(Periodo.id)
    .join(Materias, Materias.id_periodo == Periodo.id)
    .join(InformesAC, InformesAC.id_materia == Materias.id_materia)
    .filter(Materias.id_departamento == departamento_id)
    .distinct()
    .subquery()
)
    # Periodos cerrados que no están en periodos_con_informe
    periodos_pendientes = (
        periodos_cerrados
        .filter(Periodo.id.not_in(periodos_con_informe))
        #.filter(Periodo.id.in_(periodos_con_informesAC_del_departamento))      #descomentar para validar que haya informesAC en el periodo
        .order_by(Periodo.ciclo_lectivo.desc(), Periodo.cuatrimestre.desc())
        .all()
    )

    resultados = []

    for periodo in periodos_pendientes:
        # 1. Cantidad materias -> cantidad informesAC esperados
        cantidad_materias = (
            db.query(func.count(Materias.id_materia))
            .filter(
                Materias.id_periodo == periodo.id,
                Materias.id_departamento == departamento_id
            )
            .scalar()
        )

        # 2. Cantidad recibida -> informesAC completados
        cantidad_recibidos = (
            db.query(func.count(InformesAC.id_informesAC))
            .join(Materias, InformesAC.id_materia == Materias.id_materia)
            .filter(
                Materias.id_periodo == periodo.id,
                Materias.id_departamento == departamento_id,
                Materias.informeACCompletado == True
            )
            .scalar()
        )

        resultados.append({
            "id": periodo.id,
            "ciclo_lectivo": periodo.ciclo_lectivo,
            "cuatrimestre": periodo.cuatrimestre,
            "fecha_cierre_informesAC": periodo.fecha_cierre_informesAC,
            "cantidad_informes_esperados": cantidad_materias,
            "cantidad_informes_recibidos": cantidad_recibidos
        })

    return resultados