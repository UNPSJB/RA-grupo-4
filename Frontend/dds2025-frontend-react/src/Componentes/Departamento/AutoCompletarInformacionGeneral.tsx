import React, { useEffect, useState } from "react";

interface FilaResumen {
  codigo: string;
  nombre: string;
  alumnos_inscriptos: number;
  comisiones_teoricas: number;
  comisiones_practicas: number;
}

interface Props {
  departamentoId: number | null;
}

const API_BASE = "http://localhost:8000";

const AutocompletarInformacionGeneral: React.FC<Props> = ({ departamentoId }) => {
  const [resumen, setResumen] = useState<FilaResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departamentoId) return;
    const fetchResumen = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/departamentos/${departamentoId}/resumen`);
        if (!res.ok) throw new Error("Error al obtener resumen general");
        const data = await res.json();
        setResumen(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResumen();
  }, [departamentoId]);

  const renderCommissionBlocks = (count: number, type: 'T' | 'P') => {
    return Array.from({ length: Math.min(count, 8) }).map((_, i) => (
      <div 
        key={i} 
        className={`uni-comm-block ${type === 'T' ? 'comm-theory' : 'comm-practice'}`}
        title={`Comisión ${type === 'T' ? 'Teórica' : 'Práctica'}`}
      >
        {type}
      </div>
    ));
  };

  if (!departamentoId) {
    return <div style={{ padding: '30px', textAlign: 'center', color: '#555', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
      🏛️ Seleccione un departamento para ver la información general.
    </div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: '#dc3545', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
      ⚠️ {error}
    </div>;
  }

  return (
    <div className="uni-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #007bff;
          --uni-bg: #f9f9f9;
          --uni-card-bg: #ffffff;
          --uni-text-primary: #111;
          --uni-text-secondary: #555;
          --tag-equip-bg: #cce4f6;
          --tag-biblio-bg: #e6f2ff;
        }

        .uni-wrapper {
          font-family: "Roboto", "Segoe UI", sans-serif;
          padding: 20px 0;
          animation: fadeIn 0.6s ease-out;
        }

        .uni-header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 15px;
        }
        .uni-title {
          font-size: 1.5rem;
          color: var(--uni-primary);
          font-weight: 800;
          margin: 0;
        }
        .uni-badge-count {
          background: var(--uni-secondary);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
          margin-left: 15px;
          box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
        }

        .uni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .uni-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 2px solid #e0e0e0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .uni-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(0, 51, 102, 0.2);
          border-color: var(--uni-primary);
        }
        .uni-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(90deg, var(--uni-primary), var(--uni-secondary));
        }

        .uni-card-header {
          padding: 20px 20px 15px;
        }
        .uni-materia-code {
          display: inline-block;
          background: var(--uni-primary);
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .uni-materia-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--uni-text-primary);
          line-height: 1.3;
          margin: 0;
        }

        .uni-card-body {
          padding: 0 20px 25px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .uni-section-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: var(--uni-primary);
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }

        /* Estilos específicos para este componente integrados al tema */
        .uni-stat-highlight {
          font-size: 2.2rem;
          color: var(--uni-secondary);
          font-weight: 800;
          line-height: 1;
        }
        .uni-stat-label {
          font-size: 0.85rem;
          color: var(--uni-text-secondary);
          font-weight: 600;
          margin-top: 4px;
        }

        .uni-comm-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .uni-comm-label {
          font-size: 0.8rem;
          width: 70px;
          font-weight: 700;
          color: var(--uni-primary);
        }
        .uni-comm-visualizer {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .uni-comm-block {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          border-radius: 6px;
          color: var(--uni-text-primary);
        }
        .comm-theory { 
          background-color: var(--tag-equip-bg); 
          border: 1px solid var(--uni-primary);
        }
        .comm-practice { 
          background-color: var(--tag-biblio-bg);
          border: 1px solid var(--uni-secondary);
          opacity: 0.8;
        }

        .uni-empty-state {
           font-style: italic;
           color: #999;
           font-size: 0.9rem;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        
        .skeleton {
          background: #e0e0e0;
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="uni-header">
        <h2 className="uni-title">Información General</h2>
        {!loading && resumen.length > 0 && (
          <span className="uni-badge-count">{resumen.length} Materias</span>
        )}
      </div>

      {loading ? (
        <div className="uni-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="uni-card" style={{ height: '280px', padding: '25px', border: 'none', background: '#f0f0f0' }}>
               <div className="skeleton" style={{ width: '25%', height: '24px', marginBottom: '20px', background: '#d1dae6' }}></div>
               <div className="skeleton" style={{ width: '70%', height: '32px', marginBottom: '40px', background: '#d1dae6' }}></div>
               <div className="skeleton" style={{ width: '100%', height: '100px', background: '#e8edf5' }}></div>
            </div>
          ))}
        </div>
      ) : resumen.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #ccc' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.7 }}>📊</div>
          <p>No hay información general disponible para este departamento.</p>
        </div>
      ) : (
        <div className="uni-grid">
          {resumen.map((fila, index) => (
            <div 
              key={index} 
              className="uni-card" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="uni-card-header">
                <span className="uni-materia-code">{fila.codigo}</span>
                <h3 className="uni-materia-title">{fila.nombre}</h3>
              </div>
              
              <div className="uni-card-body">
                <div>
                  <div className="uni-section-title">
                    <span>👥</span> Inscripciones
                  </div>
                  <div>
                    <div className="uni-stat-highlight">{fila.alumnos_inscriptos}</div>
                    <div className="uni-stat-label">Alumnos totales</div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div className="uni-section-title">
                    <span>🏫</span> Estructura de Cátedra
                  </div>
                  <div className="uni-comm-row">
                    <span className="uni-comm-label">Teóricas</span>
                    <div className="uni-comm-visualizer">
                      {fila.comisiones_teoricas > 0 
                        ? renderCommissionBlocks(fila.comisiones_teoricas, 'T') 
                        : <span className="uni-empty-state">-</span>}
                    </div>
                  </div>
                  <div className="uni-comm-row">
                    <span className="uni-comm-label">Prácticas</span>
                    <div className="uni-comm-visualizer">
                      {fila.comisiones_practicas > 0 
                        ? renderCommissionBlocks(fila.comisiones_practicas, 'P')
                        : <span className="uni-empty-state">-</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompletarInformacionGeneral;