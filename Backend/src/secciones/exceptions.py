from src.secciones.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class SeccionNoEncontrada(NotFound):
    DETAIL = ErrorCode.SECCION_NO_ENCONTRADA

class PreguntaTieneOpcionRespuesta(BadRequest):
    DETAIL = ErrorCode.SECCION_TIENE_PREGUNTAS
