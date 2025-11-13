from src.periodos.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class PeriodoNoEncontrado(NotFound):
    DETAIL = ErrorCode.PERIODO_NO_ENCONTRADO

class PeriodoYaExiste(BadRequest):
    DETAIL = ErrorCode.PERIODO_YA_EXISTE
