import React, { useEffect, useState, useCallback, useMemo } from "react";
import SinDatos from "../Otros/SinDatos"; 
interface InformeACParaInformeSintetico {
  id_informeAC: number;
  codigoMateria: string;
  nombreMateria: string;
  aspectosPositivosEnsenianza: string;
  aspectosPositivosAprendizaje: string;
  ObstaculosEnsenianza: string;
  obstaculosAprendizaje: string;
  estrategiasAImplementar: string;
}

interface Props {
  departamentoId: number;
  periodoId: number;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AspecPosObstaculosInformeSintetico: React.FC<Props> = ({ departamentoId, periodoId }) => {
  const [informes, setInformes] = useState<InformeACParaInformeSintetico[]>([]);
  const [cargando, setCargando] = useState(false);
  const [materiaExpandida, setMateriaExpandida] = useState<string | null>(null);

  const fetchInformes = useCallback(async () => {

    if (!departamentoId || !periodoId) return;
    
    setCargando(true);
    try {
      const res = await fetch(
        `${API_BASE}/informes-sinteticos/departamento/${departamentoId}/periodo/${periodoId}/informesAC/aspectosPositivosObstaculos`
      );
      if (!res.ok) throw new Error("Error al obtener los informes.");
      const data = await res.json();
      setInformes(data);
    } catch (err) {
      console.error(err);
      setInformes([]);
    } finally {
      setCargando(false);
    }
  }, [departamentoId, periodoId]); 

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  const toggleMateria = (codigo: string) =>
    setMateriaExpandida((prev) => (prev === codigo ? null : codigo));

  const materiasAgrupadas = useMemo(() => {
    const grupos: Record<string, InformeACParaInformeSintetico[]> = {};
    informes.forEach((i) => {
      if (!grupos[i.codigoMateria]) grupos[i.codigoMateria] = [];
      grupos[i.codigoMateria].push(i);
    });
    return Object.entries(grupos).map(([codigo, data]) => ({
      codigo,
      nombre: data[0]?.nombreMateria || "",
      informes: data,
    }));
  }, [informes]);

  return (
    <div className="uni-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #007bff;
          --uni-bg: #f9f9f9;
          --uni-card-bg: #ffffff;
          --uni-border: #dee2e6;
        }

        .uni-wrapper {
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
          padding: 20px 0;
          color: #212529;
          animation: fadeIn 0.5s ease-out;
        }

        .uni-header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 15px;
        }
        .uni-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--uni-primary);
        }

        .materia-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          margin-bottom: 25px;
          border: 1px solid var(--uni-border);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .materia-card.expanded {
          border-color: var(--uni-primary);
          box-shadow: 0 10px 30px rgba(0, 51, 102, 0.15);
        }

        .materia-header {
          padding: 20px 30px;
          background: linear-gradient(135deg, var(--uni-primary), #004588);
          color: white;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .materia-header:hover {
          background: linear-gradient(135deg, #004588, var(--uni-primary));
        }
        .materia-title {
          font-size: 1.35rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .materia-code-badge {
          background: rgba(255, 255, 255, 0.25);
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

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .info-box {
          background: #f2f7ff;
          border: 1px solid var(--uni-secondary);
          border-radius: 8px;
          padding: 12px;
          color: var(--uni-primary);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .strategy-box {
          margin-top: 25px;
          border-top: 3px solid var(--uni-secondary);
          padding-top: 15px;
        }

        .strategy-label {
          font-weight: 700;
          color: var(--uni-primary);
          margin-bottom: 10px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="uni-header">
        <h2 className="uni-title">Aspectos Positivos y Obstáculos</h2>
      </div>

      {cargando ? (
        <div style={{ textAlign: "center", padding: "30px" }}>Cargando...</div>
      ) : materiasAgrupadas.length === 0 ? (
        <SinDatos mensaje={`No hay informes disponibles para el periodo.`} />
      ) : (
        <div>
          {materiasAgrupadas.map((materia) => {
            const isExpanded = materiaExpandida === materia.codigo;
            const info = materia.informes[0];
            return (
              <div
                key={materia.codigo}
                className={`materia-card ${isExpanded ? "expanded" : ""}`}
              >
                <div
                  className="materia-header"
                  onClick={() => toggleMateria(materia.codigo)}
                >
                  <div className="materia-title">
                    <span className="materia-code-badge">{materia.codigo}</span>
                    {materia.nombre}
                  </div>
                  <span className={`chevron ${isExpanded ? "rotated" : ""}`}>▼</span>
                </div>

                {isExpanded && (
                  <div className="materia-body">
                    <div
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                        }}
                      >
                        <div
                          style={{
                            background: "#d4edda",
                            color: "#1e7e34",
                            textAlign: "center",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                        >
                          Aspectos Positivos
                        </div>
                        <div
                          style={{
                            background: "#f8d7da",
                            color: "#c82333",
                            textAlign: "center",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                        >
                          Obstáculos
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          background: "#f8f9fa",
                          borderTop: "1px solid #dee2e6",
                          textAlign: "center",
                          fontWeight: 600,
                          color: "#003366",
                        }}
                      >
                        <div style={{ padding: "6px" }}>Enseñanza</div>
                        <div style={{ padding: "6px" }}>Aprendizaje</div>
                        <div style={{ padding: "6px" }}>Enseñanza</div>
                        <div style={{ padding: "6px" }}>Aprendizaje</div>
                      </div>
                    </div>

                    <div className="info-grid">
                      <div className="info-box">{info.aspectosPositivosEnsenianza}</div>
                      <div className="info-box">{info.aspectosPositivosAprendizaje}</div>
                      <div className="info-box">{info.ObstaculosEnsenianza}</div>
                      <div className="info-box">{info.obstaculosAprendizaje}</div>
                    </div>

                    <div className="strategy-box">
                      <div className="strategy-label">Estrategias a Implementar</div>
                      <div className="info-box">
                        {info.estrategiasAImplementar ||
                          "No se han definido estrategias a implementar para el próximo ciclo."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AspecPosObstaculosInformeSintetico;