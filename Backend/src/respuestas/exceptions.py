from src.respuestas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class OpcionRespuestaNoEncontrada(NotFound):
    DETAIL = ErrorCode.RESPUESTA_NO_ENCONTRADA
