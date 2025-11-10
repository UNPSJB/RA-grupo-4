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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AutocompletarInformacionGeneral: React.FC<Props> = ({ departamentoId }) => {
  const [resumen, setResumen] = useState<FilaResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departamentoId) {
      // Limpia el resumen si no hay departamento seleccionado
      setResumen([]);
      setError(null);
      setLoading(false);
      return;
    }
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
    // Limita la visualización a un máximo de, por ejemplo, 10 bloques para evitar desbordes
    const MAX_BLOCKS_TO_SHOW = 10;
    const blocks = Array.from({ length: Math.min(count, MAX_BLOCKS_TO_SHOW) }).map((_, i) => (
      <div
        key={i}
        className={`uni-comm-block ${type === 'T' ? 'comm-theory' : 'comm-practice'}`}
        title={`Comisión ${type === 'T' ? 'Teórica' : 'Práctica'}`}
      >
        {type}
      </div>
    ));

    // Si hay más de 10, añade un bloque "..."
    if (count > MAX_BLOCKS_TO_SHOW) {
      blocks.push(
        <div key="more" className="uni-comm-block comm-more" title={`${count - MAX_BLOCKS_TO_SHOW} más`}>
          ...
        </div>
      );
    }
    return blocks;
  };

  if (!departamentoId) {
    return <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
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
        /* --- PALETA DE COLORES (COPIADA DEL COMPONENTE ANTERIOR) --- */
        :root {
          --uni-primary: #003366; /* Azul Oscuro Institucional */
          --uni-secondary: #007bff; /* Azul Vivo de Acción */
          --uni-bg: #f9f9f9; /* Fondo muy claro */
          --uni-card-bg: #ffffff; /* Fondo blanco para tarjetas */
          --uni-text-primary: #212529; /* Texto casi negro */
          --uni-text-secondary: #6c757d; /* Texto gris */
          --uni-border: #dee2e6; /* Borde gris claro */
          --uni-shadow: rgba(0, 0, 0, 0.05); /* Sombra suave */
          --uni-shadow-hover: rgba(0, 51, 102, 0.15); /* Sombra al pasar el ratón */
          
          /* Colores específicos para este componente */
          --tag-equip-bg: #cce4f6; /* Azul claro para Teóricas */
          --tag-biblio-bg: #e6f2ff; /* Azul más claro para Prácticas */
        }

        /* --- ESTILOS BASE (COPIADOS DEL COMPONENTE ANTERIOR) --- */
        .uni-wrapper {
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
          padding: 20px 0;
          animation: fadeIn 0.6s ease-out;
          color: var(--uni-text-primary);
          max-width: 1200px;
          margin: 0 auto;
        }

        /* --- HEADER (COPIADO DEL COMPONENTE ANTERIOR) --- */
        .uni-header {
          display: flex;
          align-items: center;
          justify-content: space-between; /* Añadido para alinear el badge */
          margin-bottom: 25px;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 15px;
        }
        .uni-title {
          font-size: 1.8rem; /* Ajustado a 1.8rem */
          color: var(--uni-primary);
          font-weight: 800;
          margin: 0;
        }
        .uni-badge { /* Renombrado de uni-badge-count a uni-badge */
          background: var(--uni-secondary);
          color: white;
          padding: 6px 15px; /* Ajustado */
          border-radius: 25px; /* Ajustado */
          font-size: 0.95rem; /* Ajustado */
          font-weight: bold;
          margin-left: 20px; /* Ajustado */
          box-shadow: 0 4px 8px rgba(0,123,255,0.2); /* Ajustado */
        }
        
        /* --- ESTILOS DE GRID Y TARJETAS (ESPECÍFICOS DE ESTE COMPONENTE) --- */
        .uni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .uni-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--uni-shadow); /* Sombra más suave */
          border: 1px solid var(--uni-border); /* Borde suave */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .uni-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px var(--uni-shadow-hover);
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
          /* Limitar a 2 líneas de texto */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          min-height: 2.6em; /* 1.3 * 2 */
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
          border-bottom: 1px solid var(--uni-border);
          padding-bottom: 5px;
        }

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
          min-height: 28px; /* Altura mínima para alinear */
        }
        .uni-comm-label {
          font-size: 0.9rem; /* Un poco más grande */
          width: 70px;
          font-weight: 700;
          color: var(--uni-text-secondary); /* Gris oscuro */
          flex-shrink: 0;
        }
        .uni-comm-visualizer {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .uni-comm-block {
          width: 28px; /* Más grande */
          height: 28px; /* Más grande */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem; /* Más grande */
          font-weight: bold;
          border-radius: 6px;
          color: var(--uni-primary); /* Texto oscuro */
        }
        .comm-theory { 
          background-color: var(--tag-equip-bg); 
          border: 1px solid #9fcdff;
        }
        .comm-practice { 
          background-color: var(--tag-biblio-bg);
          border: 1px solid #cce4f6;
        }
        .comm-more {
          background-color: #e9ecef;
          border: 1px solid #ced4da;
          color: var(--uni-text-secondary);
          font-weight: bold;
          letter-spacing: -1px;
          padding-bottom: 4px; /* Ajuste para centrar "..." */
        }

        .uni-empty-state {
           font-style: italic;
           color: var(--uni-text-secondary);
           font-size: 0.9rem;
           padding-left: 10px;
        }
        
        /* ESTADO VACÍO GLOBAL */
        .global-empty-state {
          padding: 40px; 
          text-align: center; 
          color: #666; 
          background-color: #fff; 
          border-radius: 12px; 
          border: 2px dashed var(--uni-border);
        }
        .global-empty-icon {
          font-size: 2.5rem; 
          margin-bottom: 15px;
          color: var(--uni-primary);
          opacity: 0.7;
        }


        /* ANIMACIONES Y SKELETON */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        .skeleton-card {
          height: 320px; /* Altura fija para el skeleton */
          background: var(--uni-card-bg);
          border-radius: 12px;
          border: 1px solid var(--uni-border);
          padding: 20px;
          box-shadow: 0 4px 12px var(--uni-shadow);
        }
        .skeleton-line {
          background: #e9ecef;
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 
          0% { background-color: #e9ecef; } 
          50% { background-color: #f8f9fa; } 
          100% { background-color: #e9ecef; } 
        }
      `}</style>

      <div className="uni-header">
        <h2 className="uni-title">Información General</h2>
        {!loading && resumen.length > 0 && (
          /* --- JSX Actualizado --- */
          <span className="uni-badge">{resumen.length} Materias</span>
        )}
      </div>

      {loading ? (
        <div className="uni-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
                <div className="skeleton-line" style={{ width: '25%', height: '24px', marginBottom: '12px' }}></div>
                <div className="skeleton-line" style={{ width: '70%', height: '32px', marginBottom: '30px' }}></div>
                <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '12px' }}></div>
                <div className="skeleton-line" style={{ width: '30%', height: '40px', marginBottom: '30px' }}></div>
                <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '12px' }}></div>
                <div className="skeleton-line" style={{ width: '100%', height: '30px' }}></div>
            </div>
          ))}
        </div>
      ) : resumen.length === 0 ? (
        <div className="global-empty-state">
          <div className="global-empty-icon">📊</div>
          <p style={{fontSize: '1.1rem', fontWeight: 500}}>No hay información general disponible para este departamento.</p>
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
                <h3 className="uni-materia-title" title={fila.nombre}>{fila.nombre}</h3>
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