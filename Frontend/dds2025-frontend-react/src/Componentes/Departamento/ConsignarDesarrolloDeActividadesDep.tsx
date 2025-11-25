import React, { useState, useEffect } from "react";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); 
  const PERIODO_ID_EVALUADO = periodoId || 2; // Usar prop o fallback

  useEffect(() => {
    const fetchInformeActividades = async () => {
      if (!departamentoId) {
        setRegistros([]); 
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE}/informes-sinteticos/actividades?departamento_id=${departamentoId}&periodo_id=${PERIODO_ID_EVALUADO}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener la información de actividades.`);
        }

        const result = await response.json();
        
        if (Array.isArray(result)) {
          setRegistros(result);
        } else if (result.registros && Array.isArray(result.registros)) {
          setRegistros(result.registros);
        } else {
          setRegistros([]); // Fallback seguro
        }
      } catch (err: any) {
        setError(err.message || "Ocurrió un error desconocido.");
        setRegistros([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInformeActividades();
  }, [departamentoId, PERIODO_ID_EVALUADO]); 

  const registrosAgrupados = agruparPorMateria(registros);
  const codigosMaterias = Object.keys(registrosAgrupados);

  // Renderizado Condicional Global (Fuera de la tarjeta)
  const renderContent = () => {
    // 1. Sin Departamento Seleccionado
    if (!departamentoId) {
        return (
            <div className="uni-content-container">
                <SinDatos mensaje="Seleccione un departamento para ver el desarrollo de actividades." />
            </div>
        );
    }

    // 2. Error de Carga Global
    if (error) {
        return (
            <div className="uni-content-container">
                <ErrorCargaDatos error={error} />
            </div>
        );
    }

    // 3. Estructura Principal (Tarjeta)
    return (
        <div className={`actividades-card ${isExpanded ? 'expanded' : ''}`}>
            {/* HEADER CLICKABLE */}
            <div className="actividades-header" onClick={() => setIsExpanded(!isExpanded)}>
              <h3 className="actividades-title">
                Desarrollo de Actividades
              </h3>
              <span className={`chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
            </div>
    
            {/* CUERPO DESPLEGABLE */}
            {isExpanded && (
              <div className="actividades-body">
                {/* Lógica Interna del Body */}
                {loading ? (
                    // Skeleton Loader para Tabla
                    <div className="skeleton-table">
                        <div className="skeleton-header"></div>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton-row"></div>
                        ))}
                    </div>
                ) : registros.length === 0 ? (
                     // Sin Datos Específico
                     <SinDatos mensaje="No hay actividades registradas para las materias de este departamento." />
                ) : (
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
                            {/* Línea divisoria entre materias */}
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
    );
  };

  return (
    <div className="actividades-wrapper">
      <style>{`
        /* Definición de variables */
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
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
        }

        /* Contenedor para estados vacíos y errores */
        .uni-content-container {
            padding: 20px 30px;
            background-color: #ffffff;
            border-radius: 12px;
            /* box-shadow: 0 4px 12px rgba(0,0,0,0.08); Opcional si quieres sombra en el error */
        }

        /* ESTILOS DE LA TARJETA */
        .actividades-card {
            background: var(--uni-card-bg);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border: 1px solid var(--uni-border);
            transition: all 0.3s ease;
        }
        .actividades-card.expanded {
            box-shadow: 0 8px 24px rgba(51, 102, 0, 0.15); 
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

        /* INSTRUCCIONES */
        .actividades-instruccion {
            font-size: 14px;
            color: #333;
            background-color: #eef5fb;
            padding: 15px 18px;
            border-radius: 8px;
            margin-bottom: 25px;
            line-height: 1.5;
            border-left: 4px solid #0078D4;
        }

        /* TABLA DE ACTIVIDADES */
        .actividades-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 10px;
            overflow: hidden; 
            box-shadow: 0 3px 10px rgba(0,0,0,0.05); 
            margin-top: 20px;
        }
        .actividades-table th {
            background-color: #0078D4; 
            color: white;
            padding: 12px 15px;
            font-size: 12px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }
        .actividades-table td {
            border: 1px solid #e9f0f8; 
            padding: 12px 15px;
            font-size: 13px;
            color: #333;
        }
        .actividades-table .td-materia {
            font-weight: 600;
            color: var(--uni-primary);
            background-color: #eaf3ff; 
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
        .actividades-table .td-content-x {
            background-color: #d8ecff; 
            color: var(--uni-primary);
        }

        /* SEPARADOR */
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

        /* SKELETON LOADER (Estilo Tabla) */
        .skeleton-table {
            width: 100%;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .skeleton-header {
            height: 40px;
            background-color: #e0e0e0;
            margin-bottom: 1px;
            animation: pulse 1.5s infinite ease-in-out;
        }
        .skeleton-row {
            height: 60px;
            background-color: #f5f5f5;
            margin-bottom: 1px;
            animation: pulse 1.5s infinite ease-in-out;
            animation-delay: 0.2s;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { 
            from { opacity: 0; transform: translateY(-15px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
      `}</style>

      {renderContent()}
    </div>
  );
};

export default ConsignarDesarrolloDeActividadesDep;