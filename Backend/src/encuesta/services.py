from typing import List, Dict, Any
from sqlalchemy import delete, select, update, distinct
from sqlalchemy.orm import Session
from fastapi import HTTPException 
from src.encuesta.models import Encuesta
from src.encuesta import schemas, exceptions
from src.preguntas.schemas import PreguntaCreate, Pregunta as PreguntaSchema 
from src.preguntas.models import Pregunta, TipoPregunta
from src.secciones.models import Seccion
from src.secciones.schemas import Seccion as SchemaSeccion
from src.secciones.services import agregar_pregunta_a_seccion
from src.inscripciones.models import Inscripciones 
from src.materias.models import Materias
from src.respuestas.models import Respuesta, OpcionRespuesta

# --- CRUD ---
def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> Encuesta:
    _encuesta = Encuesta(nombre=encuesta.nombre, disponible=encuesta.disponible)
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta

def listar_encuestas(db: Session) -> List[Encuesta]:
    return db.scalars(select(Encuesta)).all()

def listar_encuestas_disponibles(db: Session) -> List[Encuesta]:
    return db.scalars(select(Encuesta).where(Encuesta.disponible == True)).all()

def leer_encuesta(db: Session, id_encuesta: int) -> Encuesta:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta

def modificar_encuesta(db: Session, id_encuesta: int, encuesta: schemas.EncuestaUpdate) -> Encuesta:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(update(Encuesta).where(Encuesta.id_encuesta == id_encuesta).values(**encuesta.model_dump(exclude_unset=True)))
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta

def eliminar_encuesta(db: Session, id_encuesta: int) -> schemas.EncuestaDelete:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(delete(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    db.commit()
    return db_encuesta

def agregar_seccion_a_encuesta(db: Session, id_encuesta: int, seccion: SchemaSeccion) -> SchemaSeccion:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    seccion_nueva = Seccion(enunciado=seccion.enunciado, encuesta_id=db_encuesta.id_encuesta)
    db.add(seccion_nueva)
    db.commit()
    db.refresh(seccion_nueva)
    if seccion.preguntas:
        for pregunta in seccion.preguntas:
            agregar_pregunta_a_seccion(db, seccion_nueva.id, pregunta)
    db.refresh(seccion_nueva)
    return seccion_nueva

def get_encuestas_disponibles_por_estudiante(db: Session, estudiante_id: int) -> List[Dict[str, Any]]:
    query = (
        db.query(Encuesta, Materias.nombre.label("materia_nombre"), Materias.id_materia, Inscripciones.id.label("inscripcion_id"))
        .join(Materias, Encuesta.materia_id == Materias.id_materia)
        .join(Inscripciones, Inscripciones.materia_id == Materias.id_materia)
        .filter(Inscripciones.estudiante_id == estudiante_id)
        .filter(Encuesta.disponible == True)
        .distinct(Encuesta.id_encuesta) 
        .all()
    )
    resultados = []
    for encuesta_obj, materia_nombre, materia_id, inscripcion_id in query:
        resultados.append({
            "id_encuesta": encuesta_obj.id_encuesta,
            "nombre": encuesta_obj.nombre,
            "disponible": encuesta_obj.disponible,
            "materia_id": materia_id,
            "materia_nombre": materia_nombre,
            "inscripcion_id": inscripcion_id
        })
    return resultados

# --- ESTADÍSTICAS ---
def obtener_estadisticas_materia(db: Session, materia_id: int, incluir_comentarios: bool) -> schemas.MateriaEstadisticas:
    materia = db.scalar(select(Materias).where(Materias.id_materia == materia_id))
    if not materia:
        raise HTTPException(status_code=404, detail=f"Materia con ID {materia_id} no encontrada")

    total_inscriptos = db.query(Inscripciones).filter(Inscripciones.materia_id == materia_id).count()
    total_procesadas = db.query(Inscripciones).filter(Inscripciones.materia_id == materia_id, Inscripciones.encuesta_procesada == True).count()

    encuesta = materia.encuesta
    secciones_stats = []
    
    if encuesta:
        for seccion in encuesta.secciones:
            preguntas_stats = []
            for pregunta in seccion.preguntas:
                stats = {"pregunta_id": pregunta.id, "enunciado": pregunta.enunciado, "opciones": [], "respuestas_abiertas": []}
                
                if incluir_comentarios: 
                    if pregunta.opciones_respuestas:
                        total = db.query(Respuesta).join(Inscripciones).filter(Inscripciones.materia_id == materia_id, Respuesta.pregunta_id == pregunta.id, Respuesta.opcion_respuesta_id != None).count()
                        for op in pregunta.opciones_respuestas:
                            cant = db.query(Respuesta).join(Inscripciones).filter(Inscripciones.materia_id == materia_id, Respuesta.pregunta_id == pregunta.id, Respuesta.opcion_respuesta_id == op.id).count()
                            pct = (cant / total * 100) if total > 0 else 0.0
                            stats["opciones"].append({"descripcion": op.descripcion, "cantidad": cant, "porcentaje": round(pct, 1)})
                    
                    txts = db.query(Respuesta).join(Inscripciones).filter(Inscripciones.materia_id == materia_id, Respuesta.pregunta_id == pregunta.id, Respuesta.respuesta_abierta != None).all()
                    stats["respuestas_abiertas"] = [r.respuesta_abierta for r in txts if r.respuesta_abierta]

                preguntas_stats.append(stats)
            
            titulo_seccion = getattr(seccion, 'descripcion', getattr(seccion, 'nombre', getattr(seccion, 'enunciado', 'Sección')))
            secciones_stats.append({"seccion_id": seccion.id, "sigla": "", "descripcion": titulo_seccion, "preguntas": preguntas_stats})

    return schemas.MateriaEstadisticas(
        materia_id=materia.id_materia, nombre_materia=materia.nombre,
        total_inscriptos=total_inscriptos, total_encuestas_procesadas=total_procesadas, secciones=secciones_stats
    )

def obtener_estadisticas_docente(db: Session, materia_id: int):
    return obtener_estadisticas_materia(db, materia_id, incluir_comentarios=True)

def obtener_estadisticas_alumno(db: Session, materia_id: int):
    return obtener_estadisticas_materia(db, materia_id, incluir_comentarios=False)

def obtener_historial_materias_estudiante(db: Session, estudiante_id: int):
    inscripciones = db.query(Inscripciones).filter(Inscripciones.estudiante_id == estudiante_id).all()
    materias = []
    for insc in inscripciones:
        mat = db.query(Materias).filter(Materias.id_materia == insc.materia_id).first()
        if mat:
            materias.append({
                "id": mat.id_materia,
                "nombre": mat.nombre,
                "ciclo_lectivo": mat.periodo.ciclo_lectivo,
                "cuatrimestre": mat.periodo.cuatrimestre,
                "codigo": mat.codigoMateria,
                "encuesta_nombre": mat.encuesta.nombre if mat.encuesta else "Sin encuesta",
                "encuesta_disponible": mat.encuesta.disponible if mat.encuesta else False,
                "encuesta_procesada": insc.encuesta_procesada
            })
    return materias

# --- FUNCIÓN CORREGIDA PARA EL TÍTULO DE SECCIÓN ---
def obtener_respuestas_alumno(db: Session, estudiante_id: int, materia_id: int) -> schemas.HistorialDetalle:
    inscripcion = db.query(Inscripciones).filter(
        Inscripciones.estudiante_id == estudiante_id, Inscripciones.materia_id == materia_id
    ).first()

    if not inscripcion:
        raise HTTPException(status_code=404, detail="Inscripción no encontrada")

    materia = db.query(Materias).filter(Materias.id_materia == materia_id).first()
    if not materia or not materia.encuesta:
         raise HTTPException(status_code=404, detail="Encuesta no encontrada")
    
    encuesta = materia.encuesta
    
    respuestas_db = db.query(Respuesta).filter(Respuesta.inscripcion_id == inscripcion.id).all()
    respuestas_map = {r.pregunta_id: r for r in respuestas_db}

    secciones_list = []
    for seccion in encuesta.secciones:
        preguntas_list = []
        for pregunta in seccion.preguntas:
            resp = respuestas_map.get(pregunta.id)
            
            opciones_list = [{"id": op.id, "descripcion": op.descripcion} for op in pregunta.opciones_respuestas] if pregunta.opciones_respuestas else []
            
            seleccionada_id = resp.opcion_respuesta_id if resp else None
            texto = resp.respuesta_abierta if resp else None
            
            tipo_str = str(pregunta.tipo.value) if hasattr(pregunta.tipo, 'value') else str(pregunta.tipo)

            preguntas_list.append({
                "id": pregunta.id,
                "enunciado": pregunta.enunciado,
                "tipo_pregunta": tipo_str,
                "opciones": opciones_list,
                "respuesta_seleccionada_id": seleccionada_id,
                "respuesta_texto": texto
            })

        titulo_seccion = getattr(seccion, 'descripcion', getattr(seccion, 'nombre', 'Sección'))

        secciones_list.append({
            "id": seccion.id,
            "enunciado": titulo_seccion,
            "preguntas": preguntas_list
        })

    return schemas.HistorialDetalle(
        materia_nombre=materia.nombre,
        encuesta_nombre=encuesta.nombre,
        secciones=secciones_list
    )