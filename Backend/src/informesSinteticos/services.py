from sqlalchemy.orm import Session, joinedload
from collections import defaultdict
from typing import Dict, List, Any, Optional
from src.actividades.models import Actividades 
from src.informesSinteticos import schemas
from src.informesSinteticos.models import InformeSintetico
from src.departamentos.models import Departamento 
from src.informesAC.models import InformesAC 
from src.materias.models import Materias 

# --- FUNCIÓN REESCRITA ---

def listar_actividades_para_informe(db: Session) -> schemas.InformeSinteticoActividades:
    """
    Obtiene CADA registro de actividad individual, junto con los datos
    de la materia a la que pertenece (Código y Nombre).
    NO se agrupan ni consolidan los datos.
    """
    
    try:
        # Esto devuelve una lista de Tuplas (row[0], row[1], ...)
        resultados_tuplas = (
            db.query(
                # 0: Materia
                Materias.codigoMateria,
                # 1: Materia
                Materias.nombre,
                # 2: Actividades
                Actividades.integranteCatedra,
                # 3: Actividades 
                Actividades.capacitacion,
                # 4: Actividades
                Actividades.investigacion,
                # 5: Actividades
                Actividades.extension,
                # 6: Actividades
                Actividades.gestion,
                # 7: Actividades
                Actividades.observacionComentarios
            )
            .join(InformesAC, Actividades.id_informeAC == InformesAC.id_informesAC)
            .join(Materias, InformesAC.id_materia == Materias.id_materia)
            .order_by(
                Materias.codigoMateria,      # Ordenar por código de materia
                Actividades.integranteCatedra # y luego por docente
            )
            .all()
        )
    except Exception as e:
        print(f"Error en la consulta a la base de datos: {e}")
        return schemas.InformeSinteticoActividades(registros=[])

    # 2. Formatear el resultado final (una fila por actividad)
    registros: List[schemas.ActividadParaInformeRow] = []
    
    # Iteramos sobre las tuplas (row)
    for row in resultados_tuplas:
        
        # Crear una fila de respuesta por cada actividad
        registro_fila = schemas.ActividadParaInformeRow(
            # Datos de la Materia
            codigoMateria=row[0], # Materias.codigoMateria
            nombreMateria=row[1], # Materias.nombre
            
            # Datos del Docente
            integranteCatedra=row[2], # Actividades.integranteCatedra
            
            # Datos de las actividades (leídos de la tupla)
            capacitacion=row[3], # Actividades.capacitacion
            investigacion=row[4], # Actividades.investigacion
            extension=row[5], # Actividades.extension
            gestion=row[6], # Actividades.gestion
            
            # Comentario de esa fila específica
            observacionComentarios=row[7] # Actividades.observacionComentarios
        )
        registros.append(registro_fila)
        
    return schemas.InformeSinteticoActividades(registros=registros)


# --- FUNCIONES CRUD (Se mantienen para que el resto del router no falle) ---

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate) -> InformeSintetico:
    """Crea un nuevo registro de InformeSintetico (cabecera)."""
    db_informe = InformeSintetico(**informe.model_dump())
    db.add(db_informe)
    db.commit()
    db.refresh(db_informe)
    return db_informe

def listar_informesSinteticos(db: Session) -> List[InformeSintetico]:
    """Lista todas las cabeceras de Informes Sintéticos."""
    return db.query(InformeSintetico).options(joinedload(InformeSintetico.departamento)).all()

def obtener_informe_sintetico(db: Session, informe_id: int) -> Optional[InformeSintetico]:
    """Obtiene una cabecera de Informe Sintético por su ID."""
    return db.query(InformeSintetico).options(joinedload(InformeSintetico.departamento)).filter(InformeSintetico.id == informe_id).first()