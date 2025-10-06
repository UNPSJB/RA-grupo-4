from sqlalchemy.orm import Session
from src.informesAC.models import InformesAC
from typing import List

class InformeACService:
    def __init__(self, db: Session):
        self.db = db

    def obtener_historial_completo(self) -> List[InformesAC]:
        return self.db.query(InformesAC).order_by(InformesAC.anio.desc()).all()
