from typing import List
from src.estudiantes.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class UsuarioNoEncontrado(NotFound):
    DETAIL = ErrorCode.USUARIO_NO_EXISTE





