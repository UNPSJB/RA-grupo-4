from src.preguntas.constants import ErrorCode
from src.exceptions import NotFound, BadRequest

class PreguntaNoEncontrada(NotFound):
    DETAIL = ErrorCode.PREGUNTA_NO_ENCONTRADA

class PreguntaTieneOpcionRespuesta(BadRequest):
    DETAIL = ErrorCode.PREGUNTA_TIENE_OPCIONES_RESPUESTA

class PreguntaNoEsCerrada(BadRequest):
    DETAIL = ErrorCode.PREGUNTA_NO_ES_CERRADA
