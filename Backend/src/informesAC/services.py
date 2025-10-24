from typing import List
from sqlalchemy.orm import Session
from src.informesAC.models import InformesAC
from src.informesAC import schemas, models
# from sqlalchemy import select # No necesario si usamos query

def listar_todos_los_informes(db: Session):
    return db.query(models.InformesAC).all()

def filtrar_informes(
    db: Session,
    id_docente: int | None = None,
    id_materia: int | None = None,
):
    query = db.query(InformesAC)

    if id_docente is not None:
        query = query.filter(InformesAC.id_docente == id_docente)

    if id_materia is not None:
        query = query.filter(InformesAC.id_materia == id_materia)

    return query.all()


def create_informe_ac(db: Session, informe: schemas.InformeACCreate):
    # Convertimos la lista de objetos Pydantic a una lista de diccionarios para guardar en JSON
    valoraciones_dict = None
    if informe.valoracion_auxiliares:
        # Usamos model_dump() (o .dict() si usas Pydantic V1)
        valoraciones_dict = [v.model_dump() for v in informe.valoracion_auxiliares]

    db_informe = models.InformesAC(
        # Datos Generales
        id_docente=informe.id_docente,
        id_materia=informe.id_materia,
        sede=informe.sede,
        ciclo_lectivo=informe.ciclo_lectivo,
        cantidad_alumnos_inscriptos=informe.cantidad_alumnos_inscriptos,
        cantidad_comisiones_teoricas=informe.cantidad_comisiones_teoricas,
        cantidad_comisiones_practicas=informe.cantidad_comisiones_practicas,

        # Datos de Necesidades
        necesidades_equipamiento=informe.necesidades_equipamiento,
        necesidades_bibliografia=informe.necesidades_bibliografia,

        #Datos porcentaje horas
        porcentaje_teoricas = informe.porcentaje_teoricas,
        porcentaje_practicas = informe.porcentaje_practicas,
        justificacion_porcentaje = informe.justificacion_porcentaje,

        # HDU 3
        porcentaje_contenido_abordado = informe.porcentaje_contenido_abordado,

        # --- AÑADIDO PARA HDU 4 ---
        valoracion_auxiliares = valoraciones_dict, # Guardamos la lista de diccionarios
        # --- FIN AÑADIDO ---

        #Proceso de aprendizaje
        aspectos_positivos_enseñanza = informe.aspectos_positivos_enseñanza,
        aspectos_positivos_aprendizaje = informe.aspectos_positivos_aprendizaje,
        obstaculos_enseñanza = informe.obstaculos_enseñanza,
        obstaculos_aprendizaje = informe.obstaculos_aprendizaje,
        estrategias_a_implementar = informe.estrategias_a_implementar,
        resumen_reflexion = informe.resumen_reflexion
    )
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe
