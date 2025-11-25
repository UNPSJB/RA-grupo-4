import React, { useEffect, useState } from "react";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:8000";

interface AutocompletarNecesidadesDepProps {
  departamentoId: number | null;
  periodoId: number | null;
}

interface NecesidadMateria {
  codigo_materia: string;
  nombre_materia: string;
  necesidades_equipamiento: string[];
  necesidades_bibliografia: string[];
}

const AutocompletarNecesidadesDep: React.FC<AutocompletarNecesidadesDepProps> = ({ departamentoId, periodoId }) => {
  const [resumen, setResumen] = useState<NecesidadMateria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerResumen = async () => {
      if (!departamentoId) {
        setResumen([]); // Limpiar datos si no hay ID
        setError(null);
        return;
      }
      setCargando(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE}/departamentos/${departamentoId}/necesidades?periodo_id=${periodoId}`
        );
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
  }, [departamentoId, periodoId]);

  // Renderizado principal
  return (
    <div className="uni-wrapper">
      {/* Estilos unificados del diseño guardado */}
      <style>{`
        /* PALETA DE COLORES (Diseño guardado) */
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
          --tag-equip-bg: #cce4f6;
          --tag-biblio-bg: #e6f2ff;
        }

        /* TIPOGRAFÍA Y BASE (Diseño guardado) */
        .uni-wrapper {
          font-family: "Inter", "Segoe UI", Roboto, sans-serif; /* Fuente guardada */
          padding: 20px 0;
          animation: fadeIn 0.6s ease-out;
          color: var(--uni-text-primary);
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Contenedor para estados vacíos y errores */
        .uni-content-container {
            padding: 20px 30px;
            background-color: #ffffff;
            border-radius: 12px;
        }

        /* HEADER PRINCIPAL (Diseño guardado) */
        .uni-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 15px;
        }
        .uni-title {
          font-size: 1.8rem; /* Tamaño guardado */
          color: var(--uni-primary);
          font-weight: 800;
          margin: 0;
        }
        .uni-badge { /* Clase de badge guardada */
          background: var(--uni-secondary);
          color: white;
          padding: 6px 15px;
          border-radius: 25px;
          font-size: 0.95rem;
          font-weight: bold;
          margin-left: 20px;
          box-shadow: 0 4px 8px rgba(0,123,255,0.2);
        }

        /* Grid de Tarjetas */
        .uni-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        /* Tarjeta Individual - Adaptada al diseño guardado */
        .uni-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 24px var(--uni-shadow); /* Sombra guardada */
          border: 1px solid var(--uni-border); /* Borde guardado */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .uni-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 18px 40px var(--uni-shadow-hover); /* Sombra hover guardada */
          border-color: var(--uni-secondary); /* Color hover guardado */
        }
        /* Barra superior de color (como en el diseño guardado de DocenteCard) */
        .uni-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 7px; /* Grosor guardado */
          background: linear-gradient(90deg, var(--uni-primary), var(--uni-secondary));
        }

        .uni-card-header {
          padding: 20px 20px 15px;
          padding-top: 27px; /* Espacio para la barra superior */
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
          /* Limitar a 2 líneas */
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
        .uni-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        /* Estilos de Tags */
        .uni-tag {
          font-size: 0.9rem;
          padding: 6px 12px;
          border-radius: 8px; /* Más redondeado */
          font-weight: 600;
          color: var(--uni-text-primary);
          border: 1px solid transparent; /* Borde transparente por defecto */
        }
        .tag-equip {
          background-color: var(--tag-equip-bg);
          border-color: #a6d5f7; /* Borde sutil */
        }
        .tag-biblio {
          background-color: var(--tag-biblio-bg);
          border-color: #cce4f6; /* Borde sutil */
        }
        .uni-empty-state {
            font-style: italic;
            color: var(--uni-text-secondary);
            font-size: 0.9rem;
            padding: 6px 0;
        }
        
        /* SKELETON (Diseño guardado) */
        .skeleton-card {
          height: 300px; /* Altura fija para el skeleton */
          background: var(--uni-card-bg);
          border-radius: 12px;
          border: 1px solid var(--uni-border);
          padding: 20px;
          padding-top: 27px; /* Espacio para la barra ::before */
          box-shadow: 0 8px 24px var(--uni-shadow);
          position: relative;
          overflow: hidden;
        }
        .skeleton-card::before { /* Skeleton también tiene la barra */
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 7px;
          background: #e9ecef; /* Barra en gris */
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
      
      {/* Lógica de control de estados */}
      {(() => {
        // 1. Caso: No se ha seleccionado departamento
        if (!departamentoId) {
            return (
                <div className="uni-content-container">
                    <SinDatos mensaje="Seleccione un departamento para ver sus requerimientos." />
                </div>
            );
        }

        // 2. Caso: Error en la carga
        if (error) {
            return (
                <div className="uni-content-container">
                    <ErrorCargaDatos error={error} />
                </div>
            );
        }

        // 3. Renderizado Normal
        return (
            <>
                <div className="uni-header">
                    <h2 className="uni-title">Resumen de Necesidades</h2>
                    {!cargando && resumen.length > 0 && (
                        <span className="uni-badge">{resumen.length} Materias</span>
                    )}
                </div>

                {cargando ? (
                    <div className="uni-grid">
                        {[1, 2].map((i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-line" style={{ width: '25%', height: '24px', marginBottom: '12px', background: '#e0e0e0' }}></div>
                                <div className="skeleton-line" style={{ width: '70%', height: '32px', marginBottom: '30px', background: '#e0e0e0' }}></div>
                                <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '12px' }}></div>
                                <div className="skeleton-line" style={{ width: '100%', height: '40px', marginBottom: '30px' }}></div>
                                <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '12px' }}></div>
                                <div className="skeleton-line" style={{ width: '100%', height: '40px' }}></div>
                            </div>
                        ))}
                    </div>
                ) : resumen.length === 0 ? (
                    <div className="uni-content-container">
                        <SinDatos mensaje="No hay necesidades registradas para este departamento actualmente." />
                    </div>
                ) : (
                    <div className="uni-grid">
                        {resumen.map((item, index) => (
                            <div
                                key={index}
                                className="uni-card"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="uni-card-header">
                                    <span className="uni-materia-code">{item.codigo_materia}</span>
                                    <h3 className="uni-materia-title" title={item.nombre_materia}>{item.nombre_materia}</h3>
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
            </>
        );
      })()}
    </div>
  );
};

export default AutocompletarNecesidadesDep;