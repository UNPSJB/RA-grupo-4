from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from src.informesSinteticos import schemas, services
from src.informesSinteticos.models import InformeSintetico
from src.informesSinteticos.services import generar_resumen_informe_general
from src.materias.models import Materias
from src.inscripciones.models import Inscripciones

router = APIRouter(prefix="/informes-sinteticos", tags=["Informes Sintéticos"])


@router.post("/", response_model=schemas.InformeSintetico)
def crear_informe_sintetico(informe: schemas.InformeSinteticoCreate, db: Session = Depends(get_db)):
    return services.crear_informe_sintetico(db, informe)


@router.get("/", response_model=List[schemas.InformeSintetico])
def leer_informesSinteticos(db: Session = Depends(get_db)):
    return services.listar_informesSinteticos(db)


@router.get("/{informe_id}", response_model=schemas.InformeSintetico)
def obtener_informe_sintetico(informe_id: int, db: Session = Depends(get_db)):
    informe = services.obtener_informe_sintetico(db, informe_id)
    if not informe:
        raise HTTPException(status_code=404, detail="Informe Sintético no encontrado")
    return informe


#nuevo hdu informacion general
@router.post("/informes-sinteticos/{id}/autocompletar-general")
def autocompletar_informe_general(id: int, db: Session = Depends(get_db)):
    informe = db.query(InformeSintetico).filter_by(id=id).first()
    if not informe:
        return {"error": "Informe no encontrado"}

    resumen = generar_resumen_informe_general(db, informe)
    informe.resumen_general = resumen
    db.commit()

    return {"mensaje": "Resumen generado", "resumen": resumen}

@router.get("/{departamento_id}/resumen", response_model=List[dict])
def obtener_resumen_departamento(departamento_id: int, db: Session = Depends(get_db)):
    """
    Devuelve resumen de materias del departamento indicado,
    con la cantidad de alumnos y comisiones.
    """
    materias = (
        db.query(Materias)
        .filter(Materias.departamento_id == departamento_id)
        .all()
    )

    if not materias:
        raise HTTPException(status_code=404, detail="No se encontraron materias para este departamento")

    resumen = []
    for m in materias:
        alumnos_inscriptos = (
            db.query(Inscripciones)
            .filter(Inscripciones.materia_id == m.id)
            .count()
        )

        resumen.append({
            "codigo": m.codigo,
            "nombre": m.nombre,
            "alumnos_inscriptos": alumnos_inscriptos,
            "comisiones_teoricas": m.comisiones_teoricas if hasattr(m, "comisiones_teoricas") else 1,
            "comisiones_practicas": m.comisiones_practicas if hasattr(m, "comisiones_practicas") else 1,
        })

    return resumen