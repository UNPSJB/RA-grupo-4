from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from typing import List
from . import models
from src.docentes.models import Docentes
from src.materias.models import Materias
from src.inscripciones.models import Inscripciones
from src.periodos.models import Periodo
from src.respuestas.models import Respuesta, OpcionRespuesta
from src.preguntas.models import TipoPregunta
from src.docentes import schemas, exceptions
# usados para calcular el promedio en una escala de 1-4
VALOR_OPCIONES = {
    "Malo, No Satisfactorio": 1,
    "Regular, Poco Satisfactorio.": 2,
    "Bueno, Satisfactorio.": 3,
    "Muy Bueno, Muy satisfactorio.": 4
}
VALOR_CUATRIMESTRES = {
    "Primer Cuatrimestre": "1C",
    "Segundo Cuatrimestre": "2C"
}




def leer_docente(db: Session, docente_id: int) -> schemas.Docente:
    db_docente = db.scalar(select(Docentes).where(Docentes.id_docente == docente_id))
    if db_docente is None:
        raise exceptions.DocenteNoEncontrado()
    return db_docente


def get_all_docentes(db: Session) -> List[models.Docentes]:
    return db.query(models.Docentes).all()

def listar_docentes_estadisticas(db: Session):

    docentes = (
        db.query(Docentes)
        .options(
            joinedload(Docentes.materias).joinedload(Materias.periodo)
        )
        .all()
    )

    resultado = []

    for docente in docentes:

        materias = docente.materias
        cantidad_materias = len(materias)

        # Agrupar materias por período
        periodos = {}
        for m in materias:
            ciclo = m.periodo.ciclo_lectivo
            cuatri = VALOR_CUATRIMESTRES[m.periodo.cuatrimestre.value]
            periodo_str = f"{ciclo}-{cuatri}"
            key = periodo_str
            if key not in periodos:
                periodos[key] = []
            periodos[key].append(m.id_materia)

        valoracion_periodos = []
        todos_los_valores = []

        # ----------------------------------------
        # Calcular promedio por período
        # ----------------------------------------
        for periodo_str, ids_materias in periodos.items():
            
            respuestas = (
                db.query(Respuesta)
                .join(Inscripciones, Inscripciones.id == Respuesta.inscripcion_id)
                .join(OpcionRespuesta, OpcionRespuesta.id == Respuesta.opcion_respuesta_id)
                .filter(Inscripciones.materia_id.in_(ids_materias))
                .all()
            )

            valores_numericos = []
            contador_valores = {
                "Malo, No Satisfactorio": 0,
                "Regular, Poco Satisfactorio.": 0,
                "Bueno, Satisfactorio.": 0,
                "Muy Bueno, Muy satisfactorio.": 0,
            }

            for r in respuestas:
                texto = r.opcion_respuesta.descripcion
                valor = VALOR_OPCIONES.get(texto)

                if valor:
                    valores_numericos.append(valor)
                    contador_valores[str(texto)] += 1

            promedio = (
                sum(valores_numericos) / len(valores_numericos)
                if valores_numericos else None
            )

            if valores_numericos:
                todos_los_valores.extend(valores_numericos)

            valoracion_periodos.append({
                "periodo": periodo_str,
                "promedio": promedio,
                "totalMaterias": len(ids_materias),
                "valores": contador_valores
            })

        # Orden cronológico por ciclo lectivo
        valoracion_periodos.sort(
            key=lambda x: (
                int(x["periodo"].split("-")[0]),                         # año
                int(x["periodo"].split("-")[1].replace("C", ""))         # cuatri
            )
        )
        
        # Redondear promedios por periodo
        for vp in valoracion_periodos:
            if vp["promedio"] is not None:
                vp["promedio"] = round(vp["promedio"], 2)

        primer_periodo_dictado = (
            valoracion_periodos[0]["periodo"] if valoracion_periodos else None
        )
        
        ultimo_periodo_dictado = (
            valoracion_periodos[-1]["periodo"] if valoracion_periodos else None
        )
        promedio_ultimo_periodo = (
            round(valoracion_periodos[-1]["promedio"], 2) if valoracion_periodos else None
        )

        promedio_general = (
            round(sum(todos_los_valores) / len(todos_los_valores), 2)
            if todos_los_valores else None
        )

        resultado.append({
            "id_docente": docente.id_docente,
            "nombre": docente.nombre,
            "nroLegajo": docente.nroLegajo,
            "cantidadMateriasDictadas": cantidad_materias,
            "primerPeriodoDictado": primer_periodo_dictado,
            "ultimoPeriodoDictado": ultimo_periodo_dictado,
            "promedioUltimoPeriodo": promedio_ultimo_periodo,
            "promedioGeneral": promedio_general,
            "promedioPeriodos": valoracion_periodos
        })

    return resultado