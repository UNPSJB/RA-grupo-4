from typing import List, Any
from sqlalchemy.orm import Session
from src.materias.models import Materias
from src.actividades.models import Actividades
from src.informesAC.models import InformesAC
from src.informesSinteticos import schemas


def listar_actividades_para_informe(db: Session) -> schemas.InformeSinteticoActividades:
    """
    Obtiene cada registro de actividad individual junto con los datos
    de la materia a la que pertenece (Código y Nombre).
    Marca con 'X' las actividades completadas.
    """
    try:
        resultados_tuplas = (
            db.query(
                Materias.codigoMateria,
                Materias.nombre,
                Actividades.integranteCatedra,
                Actividades.capacitacion,
                Actividades.investigacion,
                Actividades.extension,
                Actividades.gestion,
                Actividades.observacionComentarios
            )
            .join(InformesAC, Actividades.id_informeAC == InformesAC.id_informesAC)
            .join(Materias, InformesAC.id_materia == Materias.id_materia)
            .order_by(
                Materias.codigoMateria,
                Actividades.integranteCatedra
            )
            .all()
        )
    except Exception as e:
        print(f"Error en la consulta a la base de datos: {e}")
        return schemas.InformeSinteticoActividades(registros=[])

    registros: List[schemas.ActividadParaInformeRow] = []

    # 🔹 Función auxiliar: devuelve "X" si hay texto, o vacío si no
    def marcar_con_x(valor: Any) -> str:
        if valor and str(valor).strip():  # hay al menos un carácter no vacío
            return "X"
        return ""

    # 🔹 Procesa cada fila de resultados
    for row in resultados_tuplas:
        registro_fila = schemas.ActividadParaInformeRow(
            codigoMateria=row[0],
            nombreMateria=row[1],
            integranteCatedra=row[2],
            capacitacion=marcar_con_x(row[3]),
            investigacion=marcar_con_x(row[4]),
            extension=marcar_con_x(row[5]),
            gestion=marcar_con_x(row[6]),
            observacionComentarios=row[7] or ""
        )

        registros.append(registro_fila)

    return schemas.InformeSinteticoActividades(registros=registros)
