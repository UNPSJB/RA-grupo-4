import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface ResumenSeccion {
  id: number;
  sigla: string;
  nombre: string;
  porcentajes_opciones: Record<string, number>;
}

interface InformeAC {
  id_informeAC: number;
  codigoMateria: string;
  nombreMateria: string;
  porcentaje_contenido_abordado: number;
  porcentaje_teoricas: number;
  porcentaje_practicas: number;
  justificacion_porcentaje: string;
  resumenSecciones: ResumenSeccion[];
  opinionSobreResumen: string;
}

interface Props {
  departamentoId: number;
  anio: number;
}

const colores = [
  "#007bff",
  "#00bcd4",
  "#003366",
  "#1a73e8",
  "#2e7dba",
  "#5b9bd5",
  "#4682b4",
];

const SECCIONES_PERMITIDAS = ["B", "C", "D", "E-Teoria", "E-Practica"];

const PorcentajesInformeSintetico: React.FC<Props> = ({ departamentoId, anio }) => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [materiaExpandida, setMateriaExpandida] = useState<number | null>(null);

  const fetchInformes = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/informes-sinteticos/departamento/${departamentoId}/periodo/${anio}/informesAC/porcentajes`
      );
      const data = await response.json();
      setInformes(data);
    } catch (error) {
      console.error("Error al cargar informes:", error);
    } finally {
      setLoading(false);
    }
  }, [departamentoId, anio]);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  const toggleMateria = (id: number) =>
    setMateriaExpandida((prev) => (prev === id ? null : id));

  if (loading)
    return <p style={{ color: "#003366" }}>Cargando informes...</p>;

  if (!informes || informes.length === 0)
    return <p style={{ color: "#003366" }}>No hay informes disponibles.</p>;

  return (
    <div className="uni-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #007bff;
          --uni-bg: #f9f9f9;
          --uni-card-bg: #fff;
          --uni-border: #dee2e6;
          --uni-shadow: rgba(0,0,0,0.05);
          --uni-shadow-hover: rgba(0,51,102,0.15);
        }

        .uni-wrapper {
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
          padding: 20px 0;
          color: #003366;
          animation: fadeIn 0.5s ease-out;
        }

        .uni-title {
          font-size: 1.8rem;
          color: var(--uni-primary);
          font-weight: 800;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 12px;
          margin-bottom: 25px;
        }

        .materia-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          margin-bottom: 25px;
          overflow: hidden;
          box-shadow: 0 6px 18px var(--uni-shadow);
          border: 1px solid var(--uni-border);
          transition: all 0.3s ease;
        }

        .materia-card.expanded {
          border-color: var(--uni-primary);
          box-shadow: 0 10px 30px var(--uni-shadow-hover);
        }

        .materia-header {
          padding: 20px 30px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, var(--uni-primary), #004588);
          color: white;
          transition: background 0.3s ease;
        }

        .materia-header:hover {
          background: linear-gradient(135deg, #004588, var(--uni-primary));
        }

        .materia-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .materia-code-badge {
          background: rgba(255,255,255,0.25);
          color: white;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .chevron {
          transition: transform 0.3s ease;
          font-size: 1.3rem;
        }

        .chevron.rotated {
          transform: rotate(180deg);
        }

        .materia-body {
          padding: 30px;
          background: var(--uni-bg);
          border-top: 1px solid var(--uni-border);
          animation: slideDown 0.4s ease-out forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <h2 className="uni-title">
        Porcentajes de los Informes de Actividad Curricular
      </h2>

      {informes.map((info) => {
        const isExpanded = materiaExpandida === info.id_informeAC;
        const seccionesFiltradas = info.resumenSecciones.filter((s) =>
          SECCIONES_PERMITIDAS.includes(s.sigla)
        );

        const allOptions: Record<string, any> = {};
        seccionesFiltradas.forEach((sec) => {
          Object.entries(sec.porcentajes_opciones).forEach(([opcion, valor]) => {
            if (!allOptions[opcion]) allOptions[opcion] = {};
            allOptions[opcion][`${sec.sigla} - ${sec.nombre}`] = valor;
          });
        });

        const chartData = Object.entries(allOptions).map(([opcion, valores]) => ({
          opcion,
          ...valores,
        }));

        return (
          <div
            key={info.id_informeAC}
            className={`materia-card ${isExpanded ? "expanded" : ""}`}
          >
            <div
              className="materia-header"
              onClick={() => toggleMateria(info.id_informeAC)}
            >
              <div className="materia-title">
                <span className="materia-code-badge">{info.codigoMateria}</span>
                {info.nombreMateria}
              </div>
              <span className={`chevron ${isExpanded ? "rotated" : ""}`}>▼</span>
            </div>

            {isExpanded && (
              <div className="materia-body">
                {/* BLOQUE DE PORCENTAJES */}
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={styles.percentItem}>
                      <span style={styles.percentTitle}>Clases Teóricas</span>
                      <span style={styles.percentValue}>{info.porcentaje_teoricas}%</span>
                      <p style={styles.percentDesc}>
                        Se dictó el {info.porcentaje_teoricas}% de las clases teóricas programadas.
                      </p>
                    </div>

                    <div style={styles.percentItem}>
                      <span style={styles.percentTitle}>Clases Prácticas</span>
                      <span style={styles.percentValue}>{info.porcentaje_practicas}%</span>
                      <p style={styles.percentDesc}>
                        Se realizaron el {info.porcentaje_practicas}% de las actividades prácticas previstas.
                      </p>
                    </div>

                    <div style={styles.percentItem}>
                      <span style={styles.percentTitle}>Contenido Abordado</span>
                      <span style={styles.percentValue}>{info.porcentaje_contenido_abordado}%</span>
                      <p style={styles.percentDesc}>
                        Del total de contenidos del plan de estudio, se logró cubrir el {info.porcentaje_contenido_abordado}%.
                      </p>
                    </div>
                  </div>

                  <div style={styles.justificacionBox}>
                    <label style={styles.label}>Justificación del porcentaje de clases dictadas:</label>
                    <textarea
                      value={
                        info.justificacion_porcentaje ||
                        "No se ha registrado una justificación para este informe."
                      }
                      readOnly
                      style={styles.textarea}
                    />
                  </div>
                </div>

                {/* GRÁFICO */}
                <div style={styles.chartBlock}>
                  <h3 style={styles.chartTitle}>Resumen de encuestas por sección</h3>
                  <p style={styles.chartContext}>
                    Porcentajes promedio de respuestas en las encuestas de las siguientes secciones.
                  </p>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis
                        dataKey="opcion"
                        type="category"
                        width={160}
                        tick={{ fontSize: 13 }}
                      />
                      <Tooltip
                        formatter={(value: number) => `${value}%`}
                        labelFormatter={(label) => `Opción: ${label}`}
                      />
                      <Legend />
                      {seccionesFiltradas.map((sec, i) => (
                        <Bar
                          key={sec.sigla}
                          dataKey={`${sec.sigla} - ${sec.nombre}`}
                          fill={colores[i % colores.length]}
                          name={`${sec.sigla} - ${sec.nombre}`}
                          barSize={18}
                          radius={[0, 6, 6, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* OPINIÓN FINAL */}
                <div style={styles.opinionBox}>
                  <label style={styles.label}>Opinión general sobre el resumen:</label>
                  <textarea
                    value={
                      info.opinionSobreResumen ||
                      "No se registró una opinión específica sobre el resumen."
                    }
                    readOnly
                    style={styles.textarea}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PorcentajesInformeSintetico;

/* 🎨 ESTILOS INLINE COMPLEMENTARIOS */
const styles: Record<string, React.CSSProperties> = {
  percentItem: {
    backgroundColor: "#ffffffb3",
    borderRadius: "8px",
    padding: "10px 12px",
  },
  percentTitle: { fontWeight: 600, fontSize: "18px" },
  percentValue: {
    marginLeft: "8px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#007bff",
  },
  percentDesc: {
    fontSize: "14px",
    color: "#333",
    marginTop: "4px",
  },
  justificacionBox: {
    backgroundColor: "#ffffffb3",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "16px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  textarea: {
    width: "100%",
    minHeight: "80px",
    resize: "none",
    borderRadius: "6px",
    border: "1px solid #c2d4ea",
    padding: "8px",
    fontFamily: '"Inter", sans-serif',
    fontSize: "13px",
    color: "#003366",
    backgroundColor: "#e8f1fb",
  },
  chartBlock: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  chartTitle: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "4px",
  },
  chartContext: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "8px",
  },
  opinionBox: {
    backgroundColor: "#f4f8fb",
    borderRadius: "8px",
    padding: "10px",
  },
};
