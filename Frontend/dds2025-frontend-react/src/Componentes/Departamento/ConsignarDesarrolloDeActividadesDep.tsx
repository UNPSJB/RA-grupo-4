import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000"; // Define API_BASE

// 1️⃣ Interfaz de datos
interface ActividadParaInformeRow {
  codigoMateria: string;
  nombreMateria: string;
  integranteCatedra: string;
  capacitacion: string | null;
  investigacion: string | null;
  extension: string | null;
  gestion: string | null;
  observacionComentarios: string | null;
}

// 2️⃣ Interfaz de Props para el componente
interface Props {
  departamentoId: number | null;
  periodoId: number | null;
}

// 3️⃣ Auxiliar
function tieneContenido(texto: string | null | undefined): boolean {
  return Boolean(texto && texto.trim().length > 0);
}

// 4️⃣ Agrupador de materias
function agruparPorMateria(registros: ActividadParaInformeRow[]) {
  const grupos: { [codigo: string]: ActividadParaInformeRow[] } = {};
  registros.forEach((item) => {
    if (!grupos[item.codigoMateria]) grupos[item.codigoMateria] = [];
    grupos[item.codigoMateria].push(item);
  });
  return grupos;
}

// 5️⃣ Componente principal
const ConsignarDesarrolloDeActividadesDep: React.FC<Props> = ({ departamentoId, periodoId }) => {
  const [registros, setRegistros] = useState<ActividadParaInformeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); // Estado para acordeón
  const PERIODO_ID_EVALUADO = 2;

  useEffect(() => {
    const fetchInformeActividades = async () => {
      if (!departamentoId) {
        setLoading(false);
        setRegistros([]); // Limpiar registros si no hay departamento
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/informes-sinteticos/actividades`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener la información de actividades.`);
        }

        const result = await response.json();
        // Asumiendo que `result` es directamente el array de registros
        if (Array.isArray(result)) {
          setRegistros(result);
        } else if (result.registros && Array.isArray(result.registros)) {
          setRegistros(result.registros);
        } else {
          throw new Error("Formato de datos incorrecto.");
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Ocurrió un error desconocido.");
        setRegistros([]); // Limpiar registros en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchInformeActividades();
  }, [departamentoId, PERIODO_ID_EVALUADO]); // Dependencias del useEffect

  const registrosAgrupados = agruparPorMateria(registros);
  const codigosMaterias = Object.keys(registrosAgrupados);

  return (
    <div className="actividades-wrapper">
      <style>{`
        /* Definición de variables de color (consistente con el padre) */
        :root {
          --uni-primary: #003366;
          --uni-secondary: #007bff;
          --uni-bg: #f9f9f9;
          --uni-card-bg: #ffffff;
          --uni-border: #e0e0e0;
          --uni-text: #fff;
          --uni-input-bg: #d0dff0; 
        }

        .actividades-wrapper {
          padding: 10px 0;
          animation: fadeIn 0.6s ease-out;
        }

        /* ESTILOS DE LA TARJETA (CLONADOS DEL COMPONENTE DE COMENTARIOS) */
        .actividades-card {
            background: var(--uni-card-bg);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border: 1px solid var(--uni-border);
            transition: all 0.3s ease;
        }
        .actividades-card.expanded {
            box-shadow: 0 8px 24px rgba(51, 102, 0, 0.15); /* Sombra al expandir */
            border-color: var(--uni-primary);
        }

        /* ENCABEZADO CLICKABLE */
        .actividades-header {
            padding: 20px 25px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, var(--uni-primary), #004e92);
            color: #fff;
            transition: background 0.3s ease;
        }
        .actividades-header:hover {
            background: linear-gradient(135deg, #002a55, var(--uni-primary));
        }

        .actividades-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: 0.5px;
            color: #fff;
        }
        .actividades-icon {
            width: 24px;
            height: 24px;
            fill: currentColor; /* Para que el SVG use el color del texto */
        }

        .chevron {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
            opacity: 0.8;
        }
        .chevron.rotated {
            transform: rotate(180deg);
            opacity: 1;
        }

        /* CUERPO DEL ACORDEÓN */
        .actividades-body {
            padding: 30px;
            background-color: #fff;
            animation: slideDown 0.3s ease-out;
        }

        /* INSTRUCCIONES DENTRO DE LA TARJETA */
        .actividades-instruccion {
            font-size: 14px;
            color: #333;
            background-color: #eef5fb;
            padding: 15px 18px;
            border-radius: 8px;
            margin-bottom: 25px;
            line-height: 1.5;
            borderLeft: 4px solid #0078D4;
        }

        /* TABLA DE ACTIVIDADES (AJUSTES PARA LA TARJETA) */
        .actividades-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden; /* Importante para los bordes redondeados */
            box-shadow: 0 3px 10px rgba(0,0,0,0.05); /* Sombra más suave */
            margin-top: 20px;
        }
        .actividades-table th {
            background-color: #0078D4; /* Azul oscuro */
            color: white;
            padding: 12px 15px;
            font-size: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        .actividades-table td {
            border: 1px solid #e9f0f8; /* Borde más suave */
            padding: 12px 15px;
            font-size: 13px;
            color: #333;
        }
        .actividades-table .td-materia {
            font-weight: 600;
            color: var(--uni-primary);
            background-color: #eaf3ff; /* Fondo ligeramente azulado */
        }
        .actividades-table .td-center {
            text-align: center;
            font-weight: 700;
            font-size: 14px;
            color: var(--uni-secondary);
        }
        .actividades-table .td-obs {
            font-size: 12px;
            color: #555;
            font-style: italic;
            background-color: #fcfdff;
        }
        /* Color de la 'X' cuando hay contenido */
        .actividades-table .td-content-x {
            background-color: #d8ecff; /* Fondo azul claro para la "X" */
            color: var(--uni-primary);
        }

        /* SEPARADOR ENTRE MATERIAS */
        .separador-materia-row td {
            padding: 0 !important;
            border: none !important;
        }
        .separador-materia {
            height: 2px;
            background-color: var(--uni-secondary);
            opacity: 0.3;
            margin: 5px 0;
        }

        /* MENSAJES DE ESTADO */
        .actividades-loading, .actividades-error, .actividades-no-data {
            text-align: center;
            padding: 20px;
            font-size: 1rem;
            color: #555;
            border-radius: 8px;
            margin-top: 20px;
            background-color: #f0f8ff; /* Azul claro */
            border: 1px solid #d4e8f7;
        }
        .actividades-error {
            color: #b00020;
            background-color: #fff2f2;
            border: 1px solid #ffcdd2;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { 
            from { opacity: 0; transform: translateY(-15px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>

      {/* TARJETA PRINCIPAL */}
      <div className={`actividades-card ${isExpanded ? 'expanded' : ''}`}>
        {/* HEADER CLICKABLE */}
        <div className="actividades-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="actividades-title">
            Desarrollo de Actividades
             {/* Icono de lista/actividad */}
             {/* <svg className="actividades-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z"/>
             </svg>
              */}
          </h3>
          <span className={`chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
        </div>

        {/* CUERPO DESPLEGABLE */}
        {isExpanded && (
          <div className="actividades-body">
            <p className="actividades-instruccion">
              Señale con una cruz si ha desarrollado actividades de <strong>Capacitación, Investigación,
              Extensión y Gestión</strong> en el ámbito de la Facultad de Ingeniería por cada uno de los
              integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo
              evaluado. Explicite las observaciones y comentarios que considere pertinentes.
            </p>

            {/* Renderizado condicional de la tabla o mensajes de estado */}
            {loading && <div className="actividades-loading">Cargando datos de actividades...</div>}
            {error && <div className="actividades-error">Error: {error}</div>}
            {!loading && !error && registros.length === 0 && (
              <div className="actividades-no-data">No hay datos de actividades para mostrar para este departamento.</div>
            )}
            
            {!loading && !error && registros.length > 0 && (
              <table className="actividades-table">
                <thead>
                  <tr>
                    <th>Espacio Curricular</th>
                    <th>Responsable / Profesor / Auxiliar</th>
                    <th>Capacitación</th>
                    <th>Investigación</th>
                    <th>Extensión</th>
                    <th>Gestión</th>
                    <th>Observaciones / Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {codigosMaterias.map((codigo, materiaIndex) => {
                    const grupo = registrosAgrupados[codigo];
                    return (
                      <React.Fragment key={codigo}>
                        {grupo.map((item, index) => (
                          <tr key={`${codigo}-${index}`}>
                            {index === 0 ? (
                              <td className="td-materia" rowSpan={grupo.length}>
                                {item.codigoMateria} - {item.nombreMateria}
                              </td>
                            ) : null}

                            <td>{item.integranteCatedra}</td>

                            {["capacitacion", "investigacion", "extension", "gestion"].map((campo) => {
                              const valor = item[campo as keyof ActividadParaInformeRow] as string | null;
                              const hayContenido = tieneContenido(valor);
                              return (
                                <td
                                  key={campo}
                                  className={`td-center ${hayContenido ? 'td-content-x' : ''}`}
                                >
                                  {hayContenido ? "X" : "-"}
                                </td>
                              );
                            })}

                            <td className="td-obs">{item.observacionComentarios || ""}</td>
                          </tr>
                        ))}
                        {/* Línea divisoria entre materias, excepto después de la última */}
                        {materiaIndex < codigosMaterias.length - 1 && (
                          <tr className="separador-materia-row">
                            <td colSpan={7}>
                              <div className="separador-materia"></div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsignarDesarrolloDeActividadesDep;