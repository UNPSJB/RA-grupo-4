import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, Loader2 } from "lucide-react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

// Datos ajustados al contexto de "Informes Sintéticos"
const informesHardcodeados = [
  { id: 101, descripcion: "Informe Sintético: Programación I", identificador: "2024 - 1er Cuatrimestre" },
  { id: 102, descripcion: "Informe Sintético: Base de Datos", identificador: "2024 - Anual" },
  { id: 103, descripcion: "Informe Sintético: Ingeniería de Software", identificador: "2025 - Planificación" },
];

const SeleccionarInformeSinteticoSEC = () => {
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const fetchInformesSinteticos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      // URL de ejemplo - Ajustar según tu backend real
      const response = await fetch(`http://localhost:8000/informes-sinteticos/`);
      
      if (!response.ok) throw new Error("Error de conexión");
      
      const data = await response.json();
      setInformes(data.length === 0 ? informesHardcodeados : data);
    } catch (err) {
      console.warn("Usando datos locales por error de backend:", err);
      setInformes(informesHardcodeados);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchInformesSinteticos();
  }, [fetchInformesSinteticos]);

  // --- ESTILOS EN LÍNEA (Integrados) ---
  // Usamos variables CSS que coinciden con MenuSecretaria.css, con fallbacks por si se usa aislado.
  const estilosSecretaria = `
    .sec-informes-wrapper {
        width: 100%;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        box-sizing: border-box;
    }

    /* Loading State */
    .sec-loading-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        color: var(--sec-color-principal, #2c3e50);
    }

    .sec-spinner {
        animation: sec-spin 1s linear infinite;
        margin-bottom: 15px;
        color: var(--sec-color-secundario, #8e44ad);
    }

    @keyframes sec-spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
    }

    /* Contenedor de la lista */
    .sec-lista-informes {
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 100%;
    }

    /* --- CÁPSULA (ITEM DE LISTA) --- */
    .sec-capsula-informe {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-left: 4px solid var(--sec-color-secundario, #8e44ad); /* Borde violeta característico */
        border-radius: 8px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease-in-out;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .sec-capsula-informe:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border-color: #d0d0d0;
        border-left-color: var(--sec-color-principal, #2c3e50);
    }

    /* Bloque de Información (Icono + Textos) */
    .sec-info-bloque {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .sec-icono-materia {
        color: var(--sec-color-principal, #2c3e50);
        background-color: var(--sec-color-terciario, #f4ecf7);
        padding: 10px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sec-textos {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .sec-nombre-materia {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--sec-color-principal, #2c3e50);
        margin: 0;
        line-height: 1.2;
    }

    .sec-id-informe {
        font-size: 0.85rem;
        color: #7f8c8d;
        font-weight: 500;
    }

    /* Botón de Acción */
    .sec-boton-accion {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--sec-color-principal, #2c3e50);
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 600;
        transition: background-color 0.2s, box-shadow 0.2s;
        white-space: nowrap;
        border: none;
        cursor: pointer;
    }

    .sec-boton-accion:hover {
        background-color: var(--sec-color-secundario, #8e44ad);
        box-shadow: 0 2px 8px rgba(142, 68, 173, 0.3);
    }

    /* Responsive */
    @media (max-width: 650px) {
        .sec-capsula-informe {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .sec-boton-accion {
            width: 100%;
            justify-content: center;
        }
    }
  `;

  // --- Renderizado de Estados ---

  if (cargando) return (
    <div className="sec-loading-wrapper">
      <style>{estilosSecretaria}</style>
      <Loader2 className="sec-spinner" size={32} />
      <p style={{fontSize: '0.95rem', fontWeight: 500}}>Cargando informes...</p>
    </div>
  );

  if (error) return (
    <>
      <style>{estilosSecretaria}</style>
      <ErrorCargaDatos 
        mensajeError={error} 
        onReintentar={fetchInformesSinteticos} 
      />
    </>
  );

  // --- Renderizado Principal ---
  return (
    <div className="sec-informes-wrapper">
      {/* Inyectamos los estilos aquí */}
      <style>{estilosSecretaria}</style>

      {informes.length === 0 ? (
        <SinDatos 
          mensaje="No hay informes sintéticos pendientes." 
          titulo="Sin Informes"
        />
      ) : (
        <div className="sec-lista-informes">
          {informes.map((inf) => (
            <div key={inf.id} className="sec-capsula-informe">
              
              <div className="sec-info-bloque">
                <div className="sec-icono-materia">
                  <BookOpen size={20} />
                </div>
                
                <div className="sec-textos">
                  <span className="sec-nombre-materia">{inf.descripcion}</span>
                  {inf.identificador && (
                    <span className="sec-id-informe">{inf.identificador}</span>
                  )}
                </div>
              </div>

              <Link
                to={`/home/secretaria/informe-sintetico/ver/${inf.id}`}
                className="sec-boton-accion"
              >
                Previsualizar
                <Send size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeleccionarInformeSinteticoSEC;