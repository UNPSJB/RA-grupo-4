from typing import List
from collections import defaultdict, OrderedDict
from sqlalchemy.orm import Session, joinedload
from src.informesAC.models import InformesAC
from src.informesAC import exceptions, models, schemas
from src.materias.models import Materias
from src.inscripciones.models import Inscripciones
from src.encuesta.models import Encuesta
from src.secciones.models import Seccion
from src.preguntas.models import Pregunta
from src.respuestas.models import Respuesta

def read_informeAC(db: Session, id_informe: int) -> InformesAC:
    informe = (
        db.query(InformesAC)
        .options(
            joinedload(InformesAC.materia),
            joinedload(InformesAC.docente)
        )
        .filter(InformesAC.id_informesAC == id_informe)
        .first()
    )
    if not informe:
        raise exceptions.InformesNoEncontrados

    return informe



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




def actualizar_opinion_informe(db: Session, id_informe: int, opinion: str):
    informe = db.query(InformesAC).filter(InformesAC.id_informesAC == id_informe).first()
    if not informe:
        raise exceptions.InformesNoEncontrados

    informe.opinionSobreResumen = opinion
    db.add(informe)
    db.commit()
    db.refresh(informe)
    return informe



def cargar_resumen_secciones_informe(informe: InformesAC, db: Session):
    # Si ya tiene resumen, lo devuelve directamente
    if informe.resumenSecciones:
        return informe.resumenSecciones

    # Traer materia con encuesta y secciones
    materia = (
        db.query(Materias)
        .options(
            joinedload(Materias.encuesta)
            .joinedload(Encuesta.secciones)
            .joinedload(Seccion.preguntas)
            .joinedload(Pregunta.opciones_respuestas)
        )
        .filter(Materias.id_materia == informe.id_materia)
        .first()
    )

    if not materia:
        raise HTTPException(status_code=404, detail="Materia no encontrada")

    # Traer inscripciones con respuestas
    inscripciones = (
        db.query(Inscripciones)
        .options(joinedload(Inscripciones.respuestas).joinedload(Respuesta.opcion_respuesta))
        .filter(Inscripciones.materia_id == informe.id_materia)
        .all()
    )

    resumen_general = []
    for seccion in materia.encuesta.secciones:
        conteo_por_desc = defaultdict(int)
        total_respuestas = 0
        preguntas_ids = [p.id for p in seccion.preguntas]

        for ins in inscripciones:
            for r in ins.respuestas:
                if r.pregunta_id in preguntas_ids and r.opcion_respuesta:
                    desc = r.opcion_respuesta.descripcion.strip()
                    conteo_por_desc[desc] += 1
                    total_respuestas += 1

        if total_respuestas == 0:
            continue

        # Orden deseado de opciones conocidas (de mejor a peor)
        orden_preferido = [
            "Malo, No Satisfactorio",
            "Regular, Poco Satisfactorio.",
            "Bueno, Satisfactorio.",
            "Muy Bueno, Muy satisfactorio.",
        ]

        # Obtener todas las opciones posibles de la primera pregunta de la sección
        opciones_texto = [o.descripcion.strip() for o in seccion.preguntas[0].opciones_respuestas]

        # Construir lista ordenada:
        # 1. Primero las que están en el orden preferido, en ese orden
        # 2. Luego las que no están, en el orden original de la encuesta
        opciones_ordenadas = [
            opt for opt in orden_preferido if opt in opciones_texto
        ] + [
            opt for opt in opciones_texto if opt not in orden_preferido
        ]

        # Calcular porcentajes en ese orden
        porcentajes = {}
        for desc in opciones_ordenadas:
            cantidad = conteo_por_desc.get(desc, 0)
            porcentajes[desc] = round((cantidad / total_respuestas) * 100, 2)


        resumen_general.append({
            "id": seccion.id,
            "sigla": seccion.sigla,
            "nombre": seccion.descripcion,
            "porcentajes_opciones": porcentajes
        })

    # Guardar resumen en informe
    informe.resumenSecciones = resumen_general
    # db.add(informe)
    # db.commit()
    # db.refresh(informe)

    return informe.resumenSecciones



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

        # Resumen valores
        opinionSobreResumen=informe.opinionSobreResumen,
        resumenSecciones=informe.resumenSecciones if informe.resumenSecciones else [],
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
