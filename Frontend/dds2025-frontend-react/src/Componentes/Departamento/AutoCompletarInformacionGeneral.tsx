import React, { useEffect, useState, useMemo } from "react";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

interface FilaResumen {
  codigo: string;
  nombre: string;
  alumnos_inscriptos: number;
  comisiones_teoricas: number;
  comisiones_practicas: number;
}

interface Props {
  departamentoId: number | null;
  periodoId: number | null;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AutocompletarInformacionGeneral: React.FC<Props> = ({ departamentoId, periodoId }) => {
  const [resumen, setResumen] = useState<FilaResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departamentoId || !periodoId) {
      setResumen([]);
      return;
    }

    const fetchResumen = async () => {
      setLoading(true);
      setError(null); // Limpiamos errores previos al cambiar de dpto
      try {
        const res = await fetch(
          `${API_BASE}/departamentos/${departamentoId}/resumen?periodoId=${periodoId}`
        );

        if (!res.ok) throw new Error("Error al obtener resumen general");

        setResumen(await res.json());
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [departamentoId, periodoId]);

  const resumenFiltrado = useMemo(() => {
    return resumen.filter(
      (fila) => fila.comisiones_teoricas > 0 || fila.comisiones_practicas > 0
    );
  }, [resumen]);

  // FUNCIÓN ACTUALIZADA: Renderiza el número total de comisiones como un badge.
  const renderCommissionBadge = (count: number, type: 'T' | 'P') => {
    if (count === 0) return <span className="uni-comm-zero">-</span>;

    return (
      <span
        className={`uni-comm-badge ${type === 'T' ? 'comm-theory-badge' : 'comm-practice-badge'}`}
        title={`${count} Comisiones ${type === 'T' ? 'Teóricas' : 'Prácticas'}`}
      >
        {count}
      </span>
    );
  };

  // 1. Caso: No se ha seleccionado departamento
  if (!departamentoId) {
    return (
      <div className="uni-wrapper">
         <div className="uni-content-container">
            <SinDatos mensaje="Seleccione un departamento para ver la información general." />
         </div>
      </div>
    );
  }

  // 2. Caso: Error en la carga
  if (error) {
    return (
      <div className="uni-wrapper">
        <div className="uni-content-container">
            <ErrorCargaDatos error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="uni-wrapper">

<style>{`
  :root {
    --uni-primary: #003366; /* Azul Oscuro Uniforme */
    --uni-secondary: #007bff;
    --uni-bg: #f5f7fa;
    --uni-card-bg: #ffffff;
    --uni-text-primary: #343a40;
    --uni-text-secondary: #6c757d;
    --uni-border: #e9ecef;
    --uni-shadow: rgba(0,0,0,0.08); 
    --uni-shadow-hover: rgba(0,0,0,0.08); 
    --uni-light-text: #495057;

    /* Colores para badges de comisiones */
    --comm-theory-color: var(--uni-secondary); 
    --comm-practice-color: #007bff; 
  }

  .uni-wrapper {
    font-family: "Inter", "Segoe UI", Roboto, sans-serif;
    padding: 20px 0;
    max-width: 1400px; 
    margin: auto;
    /* 💡 MODIFICACIÓN: Fondo blanco para el componente */
    background-color: #ffffff; 
  }
  
  /* Contenedor principal que se ve en la imagen */
  .uni-content-container {
    padding: 20px 30px; /* Añade padding interno para que el contenido no toque los bordes */
    background-color: #ffffff;
  }


  /* --- CABECERA (ESTILO TIPO IMAGEN) --- */
  .uni-header {
    /* 💡 MODIFICACIÓN: Eliminar línea inferior */
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    /* Líneas eliminadas */
    border-bottom: none; 
    padding: 10px 0; 
    margin-bottom: 20px; /* Reducido para parecerse más a la imagen */
    
    background: none; 
    border-radius: 0;
    box-shadow: none; 
  }

  .uni-title {
    /* 💡 MODIFICACIÓN: Aumento de tamaño de fuente para parecerse a la imagen */
    font-size: 2.1rem; 
    font-weight: 800; /* Más peso para mayor impacto */
    color: var(--uni-primary);
    text-transform: uppercase; 
    letter-spacing: 0.5px; /* Menos espaciado para parecerse más al texto normal */
  }

  .uni-badge {
    /* Ajustes para parecerse más al botón azul de la imagen */
    background: #007bff; /* Color azul fuerte, similar a la imagen */
    background: linear-gradient(180deg, #008cff, #0060ff);
    color: white;
    padding: 8px 16px; /* Más padding para que parezca un botón */
    border-radius: 10px; /* Bordes redondeados */
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3); /* Sombra suave de botón */
  }

  /* --- GRID Y TARJETAS (Sin cambios importantes, aunque ahora están sobre fondo blanco) --- */
  .uni-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
    gap: 20px;
    display: grid;
    padding: 0 30px 30px 30px; /* Añadimos padding a la grilla para que no toque los bordes */
  }

  .uni-card {
    background: var(--uni-card-bg); 
    border-radius: 12px;
    overflow: hidden;
    height: auto; 
    border: 1px solid var(--uni-border);
    box-shadow: 0 4px 10px var(--uni-shadow); 
    transition: none; 
    display: flex;
    flex-direction: column;
  }

  .uni-card:hover {
    transform: none; 
    box-shadow: 0 4px 10px var(--uni-shadow-hover); 
  }


  /* --- CABECERA DE LA TARJETA --- */
  .uni-card-header {
    padding: 16px 20px; 
    background: var(--uni-card-bg); 
    border-bottom: none; 
    min-height: 70px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .uni-materia-code {
    font-size: 0.7rem; 
    background: var(--uni-text-secondary); 
    color: white;
    padding: 2px 6px; 
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 4px; 
    align-self: flex-start; 
  }

  .uni-materia-title {
    font-size: 1.05rem; 
    font-weight: 600;
    margin: 0;
    color: var(--uni-primary); 
    white-space: normal; 
    overflow: hidden;
    text-overflow: ellipsis; 
  }

  /* --- CUERPO DE LA TARJETA --- */
  .uni-card-body {
    padding: 20px 20px 15px 20px; 
    display: flex;
    flex-direction: column;
    gap: 20px; 
    flex-grow: 1;
  }

  .uni-content-row {
    display: flex;
    justify-content: space-between; 
    gap: 15px; 
  }

  .uni-inscripciones {
    flex-basis: 40%; 
    padding-right: 15px; 
    border-right: 1px dashed var(--uni-border); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .uni-carga-academica {
    flex-basis: 60%; 
  }

  .uni-section-title {
    font-size: 0.75rem; 
    font-weight: 700;
    color: var(--uni-text-secondary); 
    text-transform: uppercase;
    margin-bottom: 6px; 
    letter-spacing: 0.5px;
  }

  .uni-stat-highlight {
    font-size: 1.8rem; 
    font-weight: 800; 
    color: var(--comm-theory-color); 
    line-height: 1.1;
  }

  .uni-stat-label {
    font-size: 0.75rem; 
    color: var(--uni-text-secondary);
  }

  /* --- ESTILO DE COMISIONES (ETIQUETAS) - BOLD y LIMPIO --- */
  .uni-comm-row {
    display: flex;
    align-items: center; 
    justify-content: space-between; 
    padding: 8px 0; 
    border-bottom: 1px solid var(--uni-border); 
  }

  .uni-comm-row:last-child {
    border-bottom: none;
    margin-bottom: -8px; 
  }
  
  .uni-comm-label {
    flex-grow: 1;
    font-size: 0.9rem; 
    font-weight: 600; 
    color: var(--uni-text-primary); 
  }

  .uni-comm-badge {
    min-width: 35px; 
    padding: 4px 10px; 
    border-radius: 6px; 
    font-size: 0.9rem; 
    font-weight: 700;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .comm-theory-badge { 
    background: var(--comm-theory-color); 
    color: white; 
  }
  .comm-practice-badge { 
    background: var(--comm-practice-color); 
    color: white; 
  }

  .uni-comm-zero {
    font-size: 0.9rem;
    color: var(--uni-text-secondary);
    font-weight: 500;
    padding: 4px 10px;
    min-width: 35px;
    text-align: center;
  }

`}</style>
      <div className="uni-content-container">
        <div className="uni-header">
          <h2 className="uni-title">Información General</h2>
          {!loading && resumenFiltrado.length > 0 && (
            <span className="uni-badge">
              {resumenFiltrado.length} Materias
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="uni-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="uni-card" style={{ opacity: 0.6, height: '200px' }}></div>
          ))}
        </div>
      ) : resumenFiltrado.length === 0 ? (
        <div className="uni-content-container">
            {/* 3. Caso: Departamento seleccionado pero sin datos */}
            <SinDatos mensaje="No hay materias con carga académica registrada para este departamento." />
        </div>
      ) : (
        <div className="uni-grid">
          {resumenFiltrado.map((fila, index) => (
            <div key={index} className="uni-card">
              <div className="uni-card-header">
                <span className="uni-materia-code">{fila.codigo}</span>
                <h3 className="uni-materia-title" title={fila.nombre}>
                  {fila.nombre}
                </h3>
              </div>

              <div className="uni-card-body">
                <div className="uni-content-row">
                  {/* Bloque de Inscripciones (Izquierda) */}
                  <div className="uni-inscripciones">
                    <div className="uni-section-title">
                      Inscripciones
                    </div>
                    <div className="uni-stat-highlight">
                      {fila.alumnos_inscriptos}
                    </div>
                    <div className="uni-stat-label">Alumnos totales</div>
                  </div>

                  {/* Bloque de Carga Académica (Derecha) */}
                  <div className="uni-carga-academica">
                    <div className="uni-section-title">
                      Comisiones
                    </div>

                    {/* Fila de Comisiones Teóricas con badge */}
                    <div className="uni-comm-row">
                      <span className="uni-comm-label">Teóricas</span>
                      {renderCommissionBadge(fila.comisiones_teoricas, "T")}
                    </div>

                    {/* Fila de Comisiones Prácticas con badge */}
                    <div className="uni-comm-row">
                      <span className="uni-comm-label">Prácticas</span>
                      {renderCommissionBadge(fila.comisiones_practicas, "P")}
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