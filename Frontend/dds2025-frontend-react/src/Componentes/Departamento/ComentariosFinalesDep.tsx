import React, { useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Props {
  informeId: number | null; 
  comentariosIniciales?: string | null;
  onChange?: (nuevoComentario: string) => void; 
  modoCreacion?: boolean; 
}

const ComentariosFinalesDep: React.FC<Props> = ({ 
  informeId, 
  comentariosIniciales = "", 
  onChange,
  modoCreacion = false 
}) => {
  const [comentarios, setComentarios] = useState(comentariosIniciales || "");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); 

  // Sincronizar el estado local con la prop inicial
  useEffect(() => {
    if (comentariosIniciales !== undefined && comentariosIniciales !== null) {
      setComentarios(comentariosIniciales);
    }
  }, [comentariosIniciales]);

  const handleChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nuevoValor = e.target.value;
      setComentarios(nuevoValor);
      if (onChange) onChange(nuevoValor);
  };

  const handleGuardarIndividual = useCallback(async () => {
    if (!informeId) return;
    setGuardando(true);
    setMensaje(null);
    try {
      const response = await fetch(`${API_BASE}/informes-sinteticos/${informeId}/comentarios`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentarios: comentarios })
      });
      if (!response.ok) throw new Error("Error al guardar");
      setMensaje({ tipo: 'exito', texto: "Comentarios guardados correctamente." });
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setMensaje({ tipo: 'error', texto: "Error al guardar." });
    } finally {
      setGuardando(false);
    }
  }, [informeId, comentarios]);

  return (
    <div className="comment-wrapper">
        <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #007bff;
          --uni-bg: #f9f9f9;
          --uni-card-bg: #ffffff;
          --uni-border: #e0e0e0;
          --uni-text: #111;
          --uni-input-bg: #cce4f6; 
        }

        .comment-wrapper {
          padding: 10px 0;
          animation: fadeIn 0.6s ease-out;
        }

        /* TARJETA PRINCIPAL (ACORDEÓN) */
        .comment-card {
            background: var(--uni-card-bg);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border: 1px solid var(--uni-border);
            transition: all 0.3s ease;
        }
        .comment-card.expanded {
            /* Sombra diferente al expandir para indicar foco */
            box-shadow: 0 8px 24px rgba(0, 51, 102, 0.15); 
            border-color: var(--uni-primary);
        }

        /* ENCABEZADO (CLICKABLE) - MODIFICADO */
        .comment-header {
            padding: 20px 25px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, var(--uni-primary), #004e92);
            /* Aseguramos color blanco para el texto del header */
            color: white !important; 
            transition: background 0.3s ease;
        }
        .comment-header:hover {
            /* Oscurecemos ligeramente el fondo en hover */
            background: linear-gradient(135deg, #002a55, var(--uni-primary));
        }

        .comment-title {
            font-size: 1.3rem;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: 0.5px;
        }

        .chevron {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
            opacity: 0.8;
            /* Aseguramos color blanco para el chevron */
            color: white !important; 
        }
        .chevron.rotated {
            transform: rotate(180deg);
            opacity: 1;
        }

        /* CUERPO DE LA TARJETA */
        .comment-body {
            padding: 30px;
            background-color: #fff;
            animation: slideDown 0.3s ease-out;
        }

        /* ÁREA DE TEXTO (con el color y ancho ajustado) */
        .comment-textarea {
            width: 96%; 
            margin: 0 auto; 
            display: block;
            min-height: 300px;
            padding: 20px;
            border: 2px solid #c1d1e0; 
            border-radius: 10px;
            font-family: 'Segoe UI', Roboto, sans-serif;
            font-size: 1rem;
            line-height: 1.6;
            color: var(--uni-primary); 
            background-color: var(--uni-input-bg); 
            resize: vertical;
            box-sizing: border-box;
            transition: all 0.2s ease-in-out;
        }
        .comment-textarea:focus {
            outline: none;
            border-color: var(--uni-secondary);
            background-color: #e8f0fe; 
            box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.2);
        }
        .comment-textarea::placeholder {
            color: #6b7c93; 
            opacity: 0.8;
        }
        .comment-textarea:disabled {
             background-color: #e9ecef;
             color: #6c757d;
             cursor: not-allowed;
             border-color: #dee2e6;
        }

        /* PIE DE PÁGINA (BOTÓN) */
        .comment-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 20px;
            width: 96%; 
            margin-left: auto;
            margin-right: auto;
            gap: 15px;
        }
        .btn-guardar {
            background-color: var(--uni-primary);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex; align-items: center; gap: 8px;
        }
        .btn-guardar:hover:not(:disabled) {
            background-color: var(--uni-secondary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        }
        .btn-guardar:active:not(:disabled) { transform: translateY(0); }
        .btn-guardar:disabled { opacity: 0.6; cursor: not-allowed; }

        /* MENSAJES */
        .status-pill { padding: 6px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 600; animation: fadeIn 0.3s ease-out; }
        .pill-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .pill-error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

        @keyframes slideDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div className={`comment-card ${isExpanded ? 'expanded' : ''}`}>
        {/* HEADER CLICKABLE - Emoji eliminado */}
        <div className="comment-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3 className="comment-title">
            Comentarios y Conclusiones Finales
          </h3>
          <span className={`chevron ${isExpanded ? 'rotated' : ''}`}>▼</span>
        </div>

        {/* CUERPO DESPLEGABLE */}
        {isExpanded && (
          <div className="comment-body">
            <textarea
              className="comment-textarea"
              placeholder="Escriba aquí sus observaciones generales, conclusiones y reflexiones finales sobre el período evaluado..."
              value={comentarios}
              onChange={handleChangeLocal}
              disabled={!modoCreacion && !informeId}
            />

            {/* Solo mostramos el botón de guardado individual si NO estamos en modo creación */}
            {!modoCreacion && (
                <div className="comment-footer">
                   {mensaje && (
                      <div className={`status-pill ${mensaje.tipo === 'exito' ? 'pill-success' : 'pill-error'}`}>
                        {mensaje.texto}
                      </div>
                   )}
                   <button 
                      className="btn-guardar" 
                      onClick={handleGuardarIndividual} 
                      disabled={guardando || !informeId}
                   >
                     {guardando ? 'Guardando...' : ' Guardar Comentarios'}
                   </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComentariosFinalesDep;