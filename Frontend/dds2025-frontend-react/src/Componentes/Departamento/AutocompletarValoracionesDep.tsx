import React, { useEffect, useState, useCallback, useMemo } from "react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- TIPOS COMPARTIDOS ---
export type TipoValoracion = 'E' | 'MB' | 'B' | 'R' | 'I';
const VALORACION_OPTIONS: TipoValoracion[] = ['E', 'MB', 'B', 'R', 'I'];

export interface ValoracionMiembro {
  id_docente: number;
  nombre_docente: string;
  materia: string;
  codigo_materia: string;
  valoracion: TipoValoracion | null;
  justificacion: string | null;
}

// =====================================================================
// === COMPONENTE HIJO: TARJETA DE DOCENTE INDIVIDUAL (MEJORADO) ===
// =====================================================================
interface DocenteCardProps {
  docente: ValoracionMiembro;
  isReadOnly: boolean;
  onValoracionChange: (newVal: TipoValoracion) => void;
  onJustificacionChange: (newText: string) => void;
}

const DocenteValoracionCard: React.FC<DocenteCardProps> = ({
  docente,
  isReadOnly,
  onValoracionChange,
  onJustificacionChange,
}) => {
  return (
    <div className="doc-card">
      <div className="doc-header">
        {/* Usamos un SVG como ícono moderno para más flexibilidad y escalabilidad */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="doc-icon-svg">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
        {docente.nombre_docente}
      </div>
      <div className="doc-body">
        {/* SELECTOR DE VALORACIÓN (PILLS MEJORADAS) */}
        <div>
          <span className="val-label">Valoración</span>
          <div className="val-pills-container">
            {VALORACION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`val-pill ${docente.valoracion === opt ? `active-${opt}` : ""}`}
                onClick={() => !isReadOnly && onValoracionChange(opt)}
                disabled={isReadOnly}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* JUSTIFICACIÓN (TEXTAREA MEJORADA) */}
        <div style={{ marginTop: "auto" }}>
          <span className="val-label">Justificación</span>
          <textarea
            className="doc-textarea"
            placeholder={isReadOnly ? "Sin justificación." : "Ingrese justificación..."}
            value={docente.justificacion || ""}
            readOnly={isReadOnly}
            onChange={(e) => onJustificacionChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// === COMPONENTE PADRE PRINCIPAL ===
// =====================================================================
interface AutocompletarValoracionesProps {
  departamentoId: number | null;
}

const AutocompletarValoracionesDep: React.FC<AutocompletarValoracionesProps> = ({ departamentoId }) => {
  const [miembros, setMiembros] = useState<ValoracionMiembro[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materiaExpandida, setMateriaExpandida] = useState<string | null>(null);

  const ANIO_EVALUADO = 2025;
  const MODO_LECTURA = true; // CAMBIAR A false PARA PROBAR EDICIÓN

  const fetchMiembros = useCallback(async () => {
    if (!departamentoId) return;
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/informes-sinteticos/preview/valoraciones-miembros?departamento_id=${departamentoId}&anio=${ANIO_EVALUADO}`
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      console.log("Valoraciones recibidas del backend:", data);
      setMiembros(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido.");
    } finally {
      setCargando(false);
    }
  }, [departamentoId]);

  useEffect(() => { fetchMiembros(); }, [fetchMiembros]);

  const materiasAgrupadas = useMemo(() => {
    const grupos: Record<string, { nombre: string; codigo: string; docentes: ValoracionMiembro[] }> = {};
    miembros.forEach((m) => {
      if (!grupos[m.codigo_materia]) {
        grupos[m.codigo_materia] = { nombre: m.materia, codigo: m.codigo_materia, docentes: [] };
      }
      grupos[m.codigo_materia].docentes.push(m);
    });
    return Object.values(grupos).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [miembros]);

  const handleValoracionChange = (idDocente: number, codigoMateria: string, val: TipoValoracion) => {
    setMiembros((prev) =>
      prev.map((m) => (m.id_docente === idDocente && m.codigo_materia === codigoMateria ? { ...m, valoracion: val } : m))
    );
  };

  const handleJustificacionChange = (idDocente: number, codigoMateria: string, val: string) => {
    setMiembros((prev) =>
      prev.map((m) => (m.id_docente === idDocente && m.codigo_materia === codigoMateria ? { ...m, justificacion: val } : m))
    );
  };

  const toggleMateria = (codigo: string) => setMateriaExpandida((prev) => (prev === codigo ? null : codigo));

  // --- RENDERIZADO PADRE ---
  if (!departamentoId) return <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>🏛️ Seleccione un departamento.</div>;
  if (error) return <ErrorCargaDatos mensajeError={error} onReintentar={fetchMiembros} />;

  return (
    <div className="uni-wrapper">
      <style>{`
        /* PALETA DE COLORES */
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

          /* Colores para las pills de valoración */
          --val-e: #28a745; /* Verde para Excelente */
          --val-mb: #0056b3; /* Azul más oscuro para Muy Bien (tu primario) */
          --val-b: #007bff; /* Azul para Bien (tu secundario) */
          --val-r: #ffc107; /* Amarillo/Naranja para Regular */
          --val-i: #dc3545; /* Rojo para Insuficiente */
        }

        /* TIPOGRAFÍA Y BASE */
        .uni-wrapper { font-family: "Inter", "Segoe UI", Roboto, sans-serif; padding: 20px 0; animation: fadeIn 0.6s ease-out; color: var(--uni-text-primary); }
        h1, h2, h3, h4, h5, h6 { color: var(--uni-text-primary); }

        /* HEADER PRINCIPAL */
        .uni-header { display: flex; align-items: center; margin-bottom: 25px; border-bottom: 3px solid var(--uni-primary); padding-bottom: 15px; }
        .uni-title { font-size: 1.8rem; color: var(--uni-primary); font-weight: 800; margin: 0; }
        .uni-badge { background: var(--uni-secondary); color: white; padding: 6px 15px; border-radius: 25px; font-size: 0.95rem; font-weight: bold; margin-left: 20px; box-shadow: 0 4px 8px rgba(0,123,255,0.2); }

        /* TARJETA MATERIA (ACORDEÓN) */
        .materia-card { background: var(--uni-card-bg); border-radius: 12px; margin-bottom: 25px; overflow: hidden; box-shadow: 0 6px 18px var(--uni-shadow); border: 1px solid var(--uni-border); transition: all 0.3s ease; }
        .materia-card.expanded { border-color: var(--uni-primary); box-shadow: 0 10px 30px var(--uni-shadow-hover); }
        .materia-header { padding: 20px 30px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, var(--uni-primary), #004588); color: white; transition: background 0.3s ease; }
        .materia-header:hover { background: linear-gradient(135deg, #004588, var(--uni-primary)); }
        .materia-title { font-size: 1.35rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 15px; letter-spacing: 0.5px; }
        .materia-code-badge { background: rgba(255,255,255,0.25); color: white; padding: 5px 12px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; }
        .materia-info { display: flex; align-items: center; gap: 20px; font-size: 1rem; opacity: 0.9; }
        .chevron { transition: transform 0.3s ease; font-size: 1.3rem; }
        .chevron.rotated { transform: rotate(180deg); }
        .materia-body { padding: 35px 30px; background: var(--uni-bg); border-top: 1px solid var(--uni-border); animation: slideDown 0.4s ease-out forwards; }
        .docente-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }

        /* TARJETA DOCENTE (NUEVO DISEÑO INTERNO) */
        .doc-card { 
            background: var(--uni-card-bg); border-radius: 12px; border: 1px solid var(--uni-border);
            display: flex; flex-direction: column; min-height: 340px; 
            box-shadow: 0 8px 24px var(--uni-shadow); position: relative; overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .doc-card:hover { transform: translateY(-7px); box-shadow: 0 18px 40px var(--uni-shadow-hover); border-color: var(--uni-secondary); }
        .doc-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 7px; background: linear-gradient(90deg, var(--uni-primary), var(--uni-secondary)); }
        
        .doc-header { 
            padding: 20px 25px 15px; border-bottom: 1px solid var(--uni-border); 
            font-weight: 700; color: var(--uni-primary); font-size: 1.3rem; 
            display: flex; align-items: center; gap: 12px; background: #fdfdfd;
        }
        /* Icono SVG del docente */
        .doc-icon-svg { width: 28px; height: 28px; color: var(--uni-secondary); opacity: 0.85; }
        
        .doc-body { padding: 25px; display: flex; flex-direction: column; gap: 25px; flex-grow: 1; background: #fff; }
        
        /* SELECTOR DE VALORACIÓN (PILLS) MEJORADO */
        .val-label { font-size: 0.9rem; font-weight: 700; color: var(--uni-text-secondary); text-transform: uppercase; margin-bottom: 12px; display: block; letter-spacing: 0.8px; }
        .val-pills-container { display: flex; gap: 10px; justify-content: space-between; }
        
        .val-pill {
            flex: 1; text-align: center; padding: 12px 0px; border-radius: 10px;
            font-weight: 800; font-size: 1.05rem; color: var(--uni-text-secondary); 
            border: 2px solid var(--uni-border); background: var(--uni-bg);
            cursor: pointer; transition: all 0.25s ease-in-out;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); /* Sombra interior sutil */
            user-select: none; /* Evita selección de texto */
        }
        .val-pill:hover:not(:disabled) { 
            border-color: var(--uni-secondary); 
            background: #e9f0f7; /* Ligero hover */
            transform: translateY(-2px); /* Pequeño levantamiento */
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.06), 0 5px 10px rgba(0,0,0,0.08);
        }
        .val-pill:active:not(:disabled) { 
            transform: translateY(0); /* Efecto de click */
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.1); 
        }
        .val-pill:disabled { cursor: not-allowed; opacity: 0.7; }

        /* Colores de pills activos */
        .val-pill.active-E { background: var(--val-e); border-color: var(--val-e); color: white; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(40,167,69,0.4); }
        .val-pill.active-MB { background: var(--val-mb); border-color: var(--val-mb); color: white; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,86,179,0.4); }
        .val-pill.active-B { background: var(--val-b); border-color: var(--val-b); color: white; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,123,255,0.4); }
        .val-pill.active-R { background: var(--val-r); border-color: var(--val-r); color: #343a40; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(255,193,7,0.4); }
        .val-pill.active-I { background: var(--val-i); border-color: var(--val-i); color: white; box-shadow: inset 0 2px 6px rgba(0,0,0,0.2), 0 4px 12px rgba(220,53,69,0.4); }

        /* TEXTAREA MEJORADA */
        .doc-textarea { 
            width: 100%; padding: 15px; border: 2px solid var(--uni-border); border-radius: 10px; 
            font-family: inherit; font-size: 1rem; background: #fdfdfd; color: var(--uni-text-primary);
            resize: vertical; min-height: 100px; box-sizing: border-box; transition: all 0.2s ease-in-out;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.08); /* Sombra interior sutil */
        }
        .doc-textarea:not(:read-only):focus { 
            outline: none; border-color: var(--uni-secondary); 
            background: var(--uni-card-bg); 
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.08), 0 0 0 3px rgba(0,123,255,0.25); /* Focus ring */
        }
        .doc-textarea:read-only { background: var(--uni-bg); color: var(--uni-text-secondary); border-color: #e9ecef; cursor: default; }
        .doc-textarea::placeholder { color: var(--uni-text-secondary); opacity: 0.7; }


        /* ANIMACIONES Y UTILIDADES */
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .skeleton { height: 80px; background: #e0e0e0; margin-bottom: 15px; border-radius: 12px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>

      <div className="uni-header">
        <h2 className="uni-title">3. Valoración de Desempeño Docente</h2>
        {!cargando && materiasAgrupadas.length > 0 && (
          <span className="uni-badge">{materiasAgrupadas.length} Materias</span>
        )}
      </div>

      {cargando ? (
        <div style={{ opacity: 0.6 }}>{[1, 2].map((i) => (<div key={i} className="skeleton"></div>))}</div>
      ) : materiasAgrupadas.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666", backgroundColor: "#fff", borderRadius: "12px", border: "2px dashed #ccc" }}>
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</div>
          <p>No se encontraron docentes para valorar en este periodo.</p>
        </div>
      ) : (
        <div>
          {materiasAgrupadas.map((materia) => {
            const isExpanded = materiaExpandida === materia.codigo;
            return (
              <div key={materia.codigo} className={`materia-card ${isExpanded ? "expanded" : ""}`}>
                <div className="materia-header" onClick={() => toggleMateria(materia.codigo)}>
                  <div className="materia-title">
                    <span className="materia-code-badge">{materia.codigo}</span>
                    {materia.nombre}
                  </div>
                  <div className="materia-info">
                    <span style={{fontWeight: 'bold', color: 'rgba(255,255,255,0.9)'}}>{materia.docentes.length} docentes</span>
                    <span className={`chevron ${isExpanded ? "rotated" : ""}`}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="materia-body">
                    <div className="docente-grid">
                      {materia.docentes.map((doc, i) => (
                        <DocenteValoracionCard
                          key={`${doc.id_docente}-${doc.codigo_materia}-${i}`}
                          docente={doc}
                          isReadOnly={MODO_LECTURA}
                          onValoracionChange={(newVal) => handleValoracionChange(doc.id_docente, doc.codigo_materia, newVal)}
                          onJustificacionChange={(newText) => handleJustificacionChange(doc.id_docente, doc.codigo_materia, newText)}
                        />
                      ))}
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

export default AutocompletarValoracionesDep;