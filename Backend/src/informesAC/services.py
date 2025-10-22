from typing import List
from collections import defaultdict
from sqlalchemy.orm import Session, joinedload
from src.informesAC.models import InformesAC
from src.informesAC import exceptions, models
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




def actualizar_opinion_informe(db: Session, id_informe: int, opinion: str):
    informe = db.query(InformesAC).filter(InformesAC.id_informesAC == id_informe).first()
    if not informe:
        raise exceptions.InformesNoEncontrados

    informe.opinionSobreResumen = opinion
    db.add(informe)
    db.commit()
    db.refresh(informe)
    return informe







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


def cargar_resumen_secciones_informe(informe: InformesAC, db: Session):
    # Si ya tiene resumen, lo devuelve directamente
    if informe.resumenSecciones and informe.resumenSecciones.get("secciones"):
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

        porcentajes = {}
        for opcion in seccion.preguntas[0].opciones_respuestas:
            desc = opcion.descripcion.strip()
            cantidad = conteo_por_desc.get(desc, 0)
            porcentajes[desc] = round((cantidad / total_respuestas) * 100, 2)

        resumen_general.append({
            "id": seccion.id,
            "nombre": seccion.descripcion,
            "porcentajes_opciones": porcentajes
        })

    # Guardar resumen en informe
    informe.resumenSecciones = {"secciones": resumen_general}
    db.add(informe)
    db.commit()
    db.refresh(informe)

    return informe.resumenSecciones

