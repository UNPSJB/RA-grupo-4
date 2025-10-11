from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.encuesta.models import Encuesta
from src.encuesta import schemas, exceptions
from src.preguntas.schemas import PreguntaCreate, Pregunta as PreguntaSchema 
from src.respuestas.models import  OpcionRespuesta 
from src.preguntas.models import Pregunta, TipoPregunta
from typing import Dict, Any
from sqlalchemy import distinct
from src.inscripciones.models import Inscripciones 
from src.materias.models import Materias


#Crear Encuesta
def crear_encuesta(db: Session, encuesta: schemas.EncuestaCreate) -> Encuesta:
    _encuesta = Encuesta(
        nombre=encuesta.nombre,
        disponible=encuesta.disponible  
    )
    db.add(_encuesta)
    db.commit()
    db.refresh(_encuesta)
    return _encuesta


#Listar todas las encuestas
def listar_encuestas(db: Session) -> List[Encuesta]:
    return db.scalars(select(Encuesta)).all()

# Listar solo encuestas disponibles
def listar_encuestas_disponibles(db: Session) -> List[Encuesta]:
    return db.scalars(
        select(Encuesta).where(Encuesta.disponible == True)
    ).all()

#Leer una encuesta por ID
def leer_encuesta(db: Session, id_encuesta: int) -> Encuesta:
    db_encuesta = db.scalar(select(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    if db_encuesta is None:
        raise exceptions.EncuestaNoEncontrada()
    return db_encuesta


#Modificar encuesta
def modificar_encuesta(
    db: Session, id_encuesta: int, encuesta: schemas.EncuestaUpdate
) -> Encuesta:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(
        update(Encuesta)
        .where(Encuesta.id_encuesta == id_encuesta)
        .values(**encuesta.model_dump(exclude_unset=True))
    )
    db.commit()
    db.refresh(db_encuesta)
    return db_encuesta


#Eliminar encuesta
def eliminar_encuesta(db: Session, id_encuesta: int) -> schemas.EncuestaDelete:
    db_encuesta = leer_encuesta(db, id_encuesta)
    db.execute(delete(Encuesta).where(Encuesta.id_encuesta == id_encuesta))
    db.commit()
    return db_encuesta


def agregar_pregunta_a_encuesta(db: Session, id_encuesta: int, pregunta: PreguntaCreate) -> PreguntaSchema:
    
    # Obtener encuesta
    db_encuesta = leer_encuesta(db, id_encuesta)
    
    # Crear la pregunta primero
    pregunta_nueva = Pregunta(
        enunciado=pregunta.enunciado,
        obligatoria=pregunta.obligatoria,
        tipo=pregunta.tipo,
        encuesta_id=db_encuesta.id_encuesta
    )
    
    db.add(pregunta_nueva)
    db.commit()
    db.refresh(pregunta_nueva)  # ahora pregunta_nueva.id existe

    # Crear opciones si es pregunta cerrada
    if pregunta.tipo == TipoPregunta.CERRADA and pregunta.opciones_respuestas:
        opciones_creadas = []
        for opcion in pregunta.opciones_respuestas:
            _opcion = OpcionRespuesta(
                descripcion=opcion.descripcion,
                pregunta_id=pregunta_nueva.id
            )
            db.add(_opcion)
            opciones_creadas.append(_opcion)
        db.commit()
        
        # Asociar las opciones a la pregunta para la serialización
        pregunta_nueva.opciones_respuestas = opciones_creadas
        db.refresh(pregunta_nueva)
    
    return pregunta_nueva

#encuestas disponibles para un estudiante 
def get_encuestas_disponibles_por_estudiante(db: Session, estudiante_id: int) -> List[Dict[str, Any]]:
    """
    Criterio: El estudiante debe estar inscrito en la materia asociada a la encuesta.
    """
    
    query = (
        db.query(
            Encuesta,
            Materias.nombre.label("materia_nombre")
        )
        .join(Materias, Encuesta.materia_id == Materias.id_materia)
        .join(Inscripciones, Inscripciones.materia_id == Materias.id_materia)
        .filter(Inscripciones.estudiante_id == estudiante_id)
        .filter(Encuesta.disponible == True)
        .distinct(Encuesta.id_encuesta) 
        .all()
    )

    resultados = []
    for encuesta_obj, materia_nombre in query:
        resultados.append({
            "id_encuesta": encuesta_obj.id_encuesta,
            "nombre": encuesta_obj.nombre,
            "disponible": encuesta_obj.disponible,
            "materia_id": encuesta_obj.materia_id,
            "materia_nombre": materia_nombre,
        })
        
    return resultados
