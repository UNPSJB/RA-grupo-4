from src.exceptions import NotFound
from src.informesAC.constants import ErrorCode

class InformesNoEncontrados(NotFound):
    DETAIL = ErrorCode.INFORMES_NO_EXISTEN

