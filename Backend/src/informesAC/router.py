from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesAC import schemas, services, exceptions
from src.docentes.models import Docentes
from src.informesAC.models import InformesAC
from src.carreras.models import Carreras
from src.materias.models import Materias

router = APIRouter(prefix="/informesAC", tags=["InformesAC"])


@router.get("/listar", response_model=List[schemas.InformeAC])
def listar_todos_los_informes(db: Session = Depends(get_db)):
    return services.listar_todos_los_informes(db)

@router.get("/filtradoInformesAc", response_model=List[schemas.InformeAC])
def filtrado_informes_ac(
    id_docente: int | None = Query(None, description="ID del docente"),
    id_materia: int | None = Query(None, description="ID de la materia"),
    id_carrera: int | None = Query(None, description="ID de la carrera"),
    db: Session = Depends(get_db)
):
    informes = services.filtrar_informes(
        db=db,
        id_docente=id_docente,
        id_materia=id_materia,
        id_carrera=id_carrera
    )
    return informes

@router.get("/docente/{id_docente}", response_model=List[schemas.InformeAC])
def listar_informes_por_docente(id_docente: int, db: Session = Depends(get_db)):
    service = services.InformeACService(db)
    return service.obtener_informes_por_docente(id_docente)


@router.put("/{id_informe}/opinion", response_model=schemas.InformeAC)
def actualizar_opinion(id_informe: int, opinion: str, db: Session = Depends(get_db)):
    informe_actualizado = services.actualizar_opinion_informe(db, id_informe, opinion)
    return schemas.InformeAC.from_orm(informe_actualizado)


@router.get("/{id_informe}", response_model=schemas.InformeAC)
def obtener_informeAC(id_informe: int, db: Session = Depends(get_db)):
    
    informe = services.read_informeAC(db, id_informe) 

    resumen_secciones = services.cargar_resumen_secciones_informe(informe, db)

    secciones = resumen_secciones.get("secciones", [])

    return schemas.InformeAC(
        id_informesAC=informe.id_informesAC,
        docente=schemas.DocenteOut.from_orm(informe.docente),
        materia=schemas.MateriaOut.from_orm(informe.materia), 
        opinionSobreResumen= informe.opinionSobreResumen,
        resumenSecciones=[{
            "id": s["id"],
            "nombre": s["nombre"],
            "porcentajes_opciones": s["porcentajes_opciones"]
        } for s in secciones]  
    )
