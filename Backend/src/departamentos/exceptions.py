from typing import List
from src.departamentos.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class DepartamentoNoEncontrado(NotFound):
    DETAIL = ErrorCode.DEPARTAMENTO_NO_ENCONTRADO

class NombreDuplicado(BadRequest):
    DETAIL = ErrorCode.NOMBRE_DUPLICADO
