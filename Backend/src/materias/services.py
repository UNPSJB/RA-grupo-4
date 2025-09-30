# from typing import List
# from sqlalchemy import delete, select, update
# from sqlalchemy.orm import Session
# from src.estudiantes.models import Estudiante
# from src.estudiantes import schemas, exceptions
# from src.encuesta import schemas as encuesta_schemas

# # operaciones CRUD para Estudiantes

# def listar_encuestas(db: Session, estudiante_id: int) -> List[encuesta_schemas.Encuesta]:
#     alumno = db.get(Estudiante, estudiante_id)
#     if alumno is None:
#         raise exceptions.UsuarioNoEncontrado()
#     return alumno.encuestas

