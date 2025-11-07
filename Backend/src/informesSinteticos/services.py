from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.informesSinteticos import schemas, models
from src.informesSinteticos.models import InformeSintetico
from src.informesAC.models import InformesAC
from src.informesSinteticos.schemas import InformeSintetico
from src.materias.models import Materias





def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate):
    nuevo_informe = models.InformeSintetico(**informe.dict())
    db.add(nuevo_informe)
    db.commit()
    db.refresh(nuevo_informe)

    # Autocompletar resumen general
    resumen = generar_resumen_informe_general(db, nuevo_informe)
    nuevo_informe.resumen_general = resumen
    db.commit()

    return nuevo_informe


def listar_informesSinteticos(db: Session,) -> List[schemas.InformeSintetico]:
    return db.query(InformeSintetico).all()

def obtener_informe_sintetico(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()

#nuevo hdu informacion general
def generar_resumen_informe_general(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    resumen = []

    materias = db.query(Materias).filter(
        Materias.id_departamento == informe_sintetico.departamento_id
    ).all()

    for materia in materias:
        informe_ac = next(
            (
                inf for inf in materia.informesAC
                if str(inf.ciclo_lectivo) == str(informe_sintetico.periodo)
            ),
            None
        )
        if informe_ac:
            resumen.append({
                "codigo": materia.codigoMateria,
                "nombre": materia.nombre,
                "alumnos_inscriptos": informe_ac.cantidad_alumnos_inscriptos or 0,
                "comisiones_teoricas": informe_ac.cantidad_comisiones_teoricas or 0,
                "comisiones_practicas": informe_ac.cantidad_comisiones_practicas or 0
            })

    return resumen
#-----------------------------------------------------------------------------------------------#
def generar_resumen_necesidades(db: Session, informe_sintetico: InformeSintetico) -> List[dict]:
    """
    Genera un resumen de necesidades de equipamiento y bibliografía
    basado en los informesAC de las materias del departamento.
    """
    resumen = []

    # Obtener las materias del departamento
    materias = db.query(Materias).filter(
        Materias.id_departamento == informe_sintetico.departamento_id
    ).all()

    for materia in materias:
        informe_ac = next(
            (
                inf for inf in materia.informesAC
                if str(inf.ciclo_lectivo) == str(informe_sintetico.periodo)
            ),
            None
        )

        if informe_ac:
            resumen.append({
                "codigo_materia": materia.codigoMateria,
                "nombre_materia": materia.nombre,
                "necesidades_equipamiento": informe_ac.necesidades_equipamiento or [],
                "necesidades_bibliografia": informe_ac.necesidades_bibliografia or [],
            })

    return resumen
