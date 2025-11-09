import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface AutocompletarNecesidadesDepProps {
  departamentoId: number | null;
}

interface NecesidadMateria {
  codigo_materia: string;
  nombre_materia: string;
  necesidades_equipamiento: string[];
  necesidades_bibliografia: string[];
}

const AutocompletarNecesidadesDep: React.FC<AutocompletarNecesidadesDepProps> = ({ departamentoId }) => {
  const [resumen, setResumen] = useState<NecesidadMateria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerResumen = async () => {
      if (!departamentoId) return;
      setCargando(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/departamentos/${departamentoId}/necesidades`);
        if (!response.ok) throw new Error("Error al obtener datos institucionales");
        const data = await response.json();
        setResumen(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerResumen();
  }, [departamentoId]);

  // --- Renderizado ---

  // Estados de error y vacio inicial (usando estilos inline básicos para estos mensajes simples)
  if (!departamentoId) {
    return <div style={{ padding: '30px', textAlign: 'center', color: '#555', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
      🏛️ Seleccione un departamento para ver sus requerimientos.
    </div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: '#dc3545', backgroundColor: '#f8d7da', borderRadius: '8px', border: '1px solid #f5c6cb' }}>
      ⚠️ {error}
    </div>;
  }

  return (
    <div className="uni-wrapper">
      {/* Inyectamos tus nuevos colores en las variables CSS */}
      <style>{`
        :root {
          --uni-primary: #003366;       /* Tu azul marino fuerte */
          --uni-secondary: #007bff;     /* Tu azul brillante de acción */
          --uni-bg: #f9f9f9;            /* Fondo general claro */
          --uni-card-bg: #ffffff;       /* Fondo de tarjeta blanco */
          --uni-text-primary: #111;     /* Texto casi negro como en tus inputs */
          --uni-text-secondary: #555;   /* Texto secundario */
          
          /* Tus colores específicos para fondos de elementos */
          --tag-equip-bg: #cce4f6;      
          --tag-biblio-bg: #e6f2ff;
        }

        .uni-wrapper {
          font-family: "Roboto", "Segoe UI", sans-serif; /* Tu fuente preferida */
          padding: 20px 0;
          animation: fadeIn 0.6s ease-out;
        }

        .uni-header {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          border-bottom: 3px solid var(--uni-primary); /* Usando tu azul fuerte */
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

        /* Grid de Tarjetas */
        .uni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        /* Tarjeta Individual - Ahora con bordes más definidos como te gustan */
        .uni-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 2px solid #e0e0e0; /* Un borde base sólido */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .uni-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(0, 51, 102, 0.2);
          border-color: var(--uni-primary); /* Al hacer hover, el borde se pone de tu azul fuerte */
        }
        /* La barra superior de color ahora usa tus dos azules */
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
          background: var(--uni-primary); /* Fondo oscuro para el código */
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
          color: var(--uni-primary); /* Títulos de sección en azul fuerte */
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .uni-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        /* Estilos de Tags actualizados a tu paleta */
        .uni-tag {
          font-size: 0.9rem;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          color: #111;
          border: 1px solid var(--uni-primary); /* Borde sólido azul oscuro para los tags */
        }
        .tag-equip {
          background-color: var(--tag-equip-bg); /* Tu color #cce4f6 */
        }
        .tag-biblio {
          background-color: var(--tag-biblio-bg); /* Tu color #e6f2ff */
        }
        .uni-empty-state {
           font-style: italic;
           color: #999;
           font-size: 0.9rem;
        }

        /* Animaciones */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        
        .skeleton {
          background: #e0e0e0;
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="uni-header">
        <h2 className="uni-title">Resumen de Necesidades</h2>
        {!cargando && resumen.length > 0 && (
          <span className="uni-badge-count">{resumen.length} Materias</span>
        )}
      </div>

      {cargando ? (
        <div className="uni-grid">
          {[1, 2].map((i) => (
            <div key={i} className="uni-card" style={{ height: '280px', padding: '25px', border: 'none', background: '#f0f0f0' }}>
               <div className="skeleton" style={{ width: '25%', height: '24px', marginBottom: '20px', background: '#d1dae6' }}></div>
               <div className="skeleton" style={{ width: '70%', height: '32px', marginBottom: '40px', background: '#d1dae6' }}></div>
               <div className="skeleton" style={{ width: '100%', height: '100px', background: '#e8edf5' }}></div>
            </div>
          ))}
        </div>
      ) : resumen.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666', backgroundColor: '#fff', borderRadius: '12px', border: '2px dashed #ccc' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.7 }}>✨</div>
          <p>No hay necesidades registradas para este departamento actualmente.</p>
        </div>
      ) : (
        <div className="uni-grid">
          {resumen.map((item, index) => (
            <div 
              key={index} 
              className="uni-card" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="uni-card-header">
                <span className="uni-materia-code">{item.codigo_materia}</span>
                <h3 className="uni-materia-title">{item.nombre_materia}</h3>
              </div>
              
              <div className="uni-card-body">
                <div>
                  <div className="uni-section-title">
                    <span>🛠️</span> Equipamiento
                  </div>
                  <div className="uni-tags-container">
                    {item.necesidades_equipamiento?.length > 0 ? (
                      item.necesidades_equipamiento.map((req, idx) => (
                        <span key={idx} className="uni-tag tag-equip">{req}</span>
                      ))
                    ) : (
                      <span className="uni-empty-state">— Ninguno —</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div className="uni-section-title">
                    <span>📚</span> Bibliografía
                  </div>
                  <div className="uni-tags-container">
                    {item.necesidades_bibliografia?.length > 0 ? (
                      item.necesidades_bibliografia.map((bib, idx) => (
                        <span key={idx} className="uni-tag tag-biblio">{bib}</span>
                      ))
                    ) : (
                      <span className="uni-empty-state">— Ninguna —</span>
                    )}
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

export default AutocompletarNecesidadesDep;