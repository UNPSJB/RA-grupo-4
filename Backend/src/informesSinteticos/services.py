from typing import List
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.informesSinteticos import schemas, models
from src.informesSinteticos.models import InformeSintetico
from src.informesAC.models import InformesAC
from src.informesAC.schemas import InformeACParaInformeSintetico, InformeAC as informeACSchema
from src.materias.models import Materias

def crear_informe_sintetico(db: Session, informe: schemas.InformeSinteticoCreate):
    nuevo_informe = models.InformeSintetico(**informe.dict())
    db.add(nuevo_informe)
    db.commit()
    db.refresh(nuevo_informe)
    return nuevo_informe

def listar_informesSinteticos(db: Session,) -> List[schemas.InformeSintetico]:
    return db.query(InformeSintetico).all()

def obtener_informe_sintetico(db: Session, informe_id: int):
    return db.query(models.InformeSintetico).filter(models.InformeSintetico.id == informe_id).first()




def get_informesAC_asociados_a_informeSintetico(db: Session, departamento_id: int, anio: int):
    #Devuelve todos los informes AC asociados a las materias de un departamento en un periodo dado.
    informes = (
        db.query(InformesAC)
        .join(Materias)
        .filter(Materias.id_departamento == departamento_id)
        .filter(Materias.anio == anio)
        .all()
    )
    return informes

def get_porcentajes_informeSintetico(db: Session, departamento_id: int, anio: int)-> List[InformeACParaInformeSintetico]:
    #Devuelve un JSON con los datos necesarios para mostrar los porcentajes en el informeSintetico. 
    informesAC = get_informesAC_asociados_a_informeSintetico(db, departamento_id, anio)

    if not informesAC:
        return {"mensaje": "No hay informes AC disponibles para este departamento y periodo."}

    resultado = []
    for informe in informesAC:
        materia = informe.materia  

        resultado.append({
            "id_informeAC": informe.id_informesAC,
            "codigoMateria": getattr(materia, "codigoMateria", None),
            "nombreMateria": getattr(materia, "nombre", None),
            "resumenSecciones": informe.resumenSecciones,  # property -> lista de dicts
            "opinionSobreResumen": informe.opinionSobreResumen,
            "porcentaje_contenido_abordado": informe.porcentaje_contenido_abordado,
            "porcentaje_teoricas": informe.porcentaje_teoricas,
            "porcentaje_practicas": informe.porcentaje_practicas,
            "justificacion_porcentaje": informe.justificacion_porcentaje,
            #"horasTotalesPlanificadas": 100,    #getattr(materia, "horasTotalesPlanificadas", None) # falta el campo de horas en materia.
        })

    return resultado




def get_aspectos_positivo_y_obstaculos__informeSintetico(db: Session, departamento_id: int, anio: int)-> List[InformeACParaInformeSintetico]:
    #Devuelve un JSON con los datos necesarios para mostrar los aspectos positivos y obstaculos  en el informeSintetico. 
    informesAC = get_informesAC_asociados_a_informeSintetico(db, departamento_id, anio)

    resultado = []
    for informe in informesAC:
        materia = informe.materia  

        resultado.append({
            "id_informeAC": informe.id_informesAC,
            "codigoMateria": getattr(materia, "codigoMateria", None),
            "nombreMateria": getattr(materia, "nombre", None),
            "aspectosPositivosEnsenianza": informe.aspectos_positivos_enseñanza,
            "aspectosPositivosAprendizaje": informe.aspectos_positivos_aprendizaje,
            "ObstaculosEnsenianza": informe.obstaculos_enseñanza,
            "obstaculosAprendizaje": informe.obstaculos_aprendizaje,
            "estrategiasAImplementar": informe.estrategias_a_implementar,            
        })

    return resultado