from typing import List
from sqlalchemy.orm import Session
from src.informesAC.models import InformesAC
from src.informesAC import exceptions

class InformeACService:
    def __init__(self, db: Session):
        self.db = db

    def obtener_historial_completo(self) -> List[InformesAC]:
        return self.db.query(InformesAC).order_by(InformesAC.anio.desc()).all()

    def obtener_informes_por_docente(self, id_docente: int) -> List[InformesAC]:
        informes = (
            self.db.query(InformesAC)
            .filter(InformesAC.id_docente == id_docente)
            .order_by(InformesAC.anio.desc())
            .all()
        )

        if not informes:
            raise exceptions.InformesNoEncontrados()

        return informes
