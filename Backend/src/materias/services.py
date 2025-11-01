from sqlalchemy.orm import Session, subqueryload, joinedload
from typing import List
from . import models
from src.materias import exceptions
from src.materias.models import Materias
from src.inscripciones.models import Inscripciones
from src.respuestas.models import Respuesta
from src.preguntas.models import Pregunta, TipoPregunta
from . import schemas

def get_materias(db: Session) -> List[models.Materias]:
    """
    Obtiene y retorna una lista de todas las materias existentes.
    """
    return db.query(models.Materias).all()

def get_materias_para_autocompletar(db: Session) -> List[dict]:
    materias_db = (
        db.query(models.Materias)
        .options(subqueryload(models.Materias.inscripciones)) 
        .all()
    )
    resultado = []
    for m in materias_db:
        resultado.append({
            "id_materia": m.id_materia,
            "nombre": m.nombre,
            "codigoMateria": m.codigoMateria,
            "anio": m.anio,
            "id_docente": m.id_docente,
            "cantidad_inscripciones": len(m.inscripciones) if m.inscripciones else 0
        })
    return resultado

# Función existente (la mantenemos por si se usa en otro lado)
def get_estadisticas_materia(db: Session, materia_id: int) -> dict:
    """
    Obtiene las estadísticas de UNA materia específica.
    """
    total_inscriptos = (
        db.query(Inscripciones)
        .filter(Inscripciones.materia_id == materia_id)
        .count()
    )
    total_encuestas_procesadas = (
        db.query(Inscripciones)
        .filter(
            Inscripciones.materia_id == materia_id,
            Inscripciones.encuesta_procesada == True
        )
        .count()
    )
    return {
        "total_inscriptos": total_inscriptos,
        "total_encuestas_procesadas": total_encuestas_procesadas,
    }

def get_estadisticas_por_docente(db: Session, id_docente: int) -> List[schemas.MateriaEstadisticaItem]:
    """
    Obtiene las estadísticas de todas las materias asignadas a un docente.
    """
    # 1. Obtener todas las materias del docente
    materias_docente = db.query(models.Materias).filter(models.Materias.id_docente == id_docente).all()

    resultado_estadisticas = []

    # 2. Iterar sobre cada materia y calcular sus estadísticas
    for materia in materias_docente:
        stats = get_estadisticas_materia(db, materia.id_materia)

        resultado_estadisticas.append(schemas.MateriaEstadisticaItem(
            id_materia=materia.id_materia,
            nombre_materia=materia.nombre,
            total_inscriptos=stats["total_inscriptos"],
            total_encuestas_procesadas=stats["total_encuestas_procesadas"]
        ))

    return resultado_estadisticas






def obtener_estadisticas_materia(db: Session, materia_id: int):
    # Traer la materia y todas las relaciones necesarias
    materia = (
        db.query(Materias)
        .options(
            joinedload(Materias.inscripciones)
            .joinedload(Inscripciones.respuestas)
            .joinedload(Respuesta.opcion_respuesta),
            joinedload(Materias.inscripciones)
            .joinedload(Inscripciones.respuestas)
            .joinedload(Respuesta.pregunta)
            .joinedload(Pregunta.seccion),
        )
        .filter(Materias.id_materia == materia_id)
        .first()
    )

    if not materia:
        return exceptions.MateriaNoEncontrada

    inscripciones = [i for i in materia.inscripciones if i.encuesta_procesada]
    total_encuestas = len(inscripciones)

    # Diccionario principal: seccion_id → datos de sección
    estadisticas_por_seccion = {}

    for inscripcion in inscripciones:
        for respuesta in inscripcion.respuestas:
            pregunta = respuesta.pregunta
            if not pregunta or pregunta.tipo != TipoPregunta.CERRADA:
                continue

            seccion = pregunta.seccion
            if not seccion:
                continue  # ignorar preguntas sin sección

            seccion_id = seccion.id
            nombre_seccion = seccion.descripcion or f"Sección {seccion_id}"
            sigla = seccion.sigla

            # Crear entrada de sección si no existe
            if seccion_id not in estadisticas_por_seccion:
                estadisticas_por_seccion[seccion_id] = {
                    "seccion_id": seccion_id,
                    "sigla": sigla,
                    "descripcion": nombre_seccion,
                    "preguntas": {}
                }

            preguntas = estadisticas_por_seccion[seccion_id]["preguntas"]

            # Crear entrada de pregunta si no existe
            if pregunta.id not in preguntas:
                preguntas[pregunta.id] = {
                    "pregunta_id": pregunta.id,
                    "enunciado": pregunta.enunciado,
                    "opciones": {}
                }

            # Registrar respuesta seleccionada
            if respuesta.opcion_respuesta:
                desc = respuesta.opcion_respuesta.descripcion
                preguntas[pregunta.id]["opciones"].setdefault(desc, 0)
                preguntas[pregunta.id]["opciones"][desc] += 1

    # Convertir a formato de salida
    for seccion_data in estadisticas_por_seccion.values():
        for pregunta in seccion_data["preguntas"].values():
            total_respuestas = sum(pregunta["opciones"].values())
            opciones_lista = []
            for desc, count in pregunta["opciones"].items():
                porcentaje = (count / total_respuestas * 100) if total_respuestas > 0 else 0
                opciones_lista.append({
                    "descripcion": desc,
                    "cantidad": count,
                    "porcentaje": round(porcentaje, 2)
                })

            # Mapa de orden semántico para las opciones respuesta
            orden_semantico = {
                "muy bueno": 1,
                "bueno": 2,
                "regular": 3,
                "malo": 4,
                "una":11,
                "mas de una":12,
                "mas 50%":21,
                "entre 0 y 50%":22,
                "suficientes":32,
                "escasos":31
            }
            # Función de orden que busca coincidencias parciales y es case-insensitive
            def prioridad(op):
                desc = op["descripcion"].strip().lower()
                for clave, valor in orden_semantico.items():
                    if clave in desc:
                        return valor
                # si no coincide, mandalo al final
                return 999  

            opciones_lista.sort(key=prioridad)
            # opciones_list.sort(key=prioridad, reverse=True) # invertir orden 
            pregunta["opciones"] = opciones_lista

        seccion_data["preguntas"] = list(seccion_data["preguntas"].values())

    return {
        "materia_id": materia.id_materia,
        "nombre_materia": materia.nombre,
        "total_inscriptos": len(materia.inscripciones),
        "total_encuestas_procesadas": total_encuestas,
        "secciones": list(estadisticas_por_seccion.values())
    }

