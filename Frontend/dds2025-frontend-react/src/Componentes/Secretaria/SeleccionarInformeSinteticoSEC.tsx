import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, Loader2 } from "lucide-react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

// Datos ajustados al contexto de "Informes Sintéticos"
const informesHardcodeados = [
  { id: 101, descripcion: "Informe Sintético 2024 Primer Cuatrimestre Departamento de Ingeniería en Sistemas", identificador: "Programación I" },
  { id: 102, descripcion: "Informe Sintético 2024 Segundo Cuatrimestre Departamento de Ingeniería en Sistemas", identificador: "Base de Datos" },
  { id: 103, descripcion: "Informe Sintético 2025 Planificación Anual Departamento de Ingeniería en Sistemas", identificador: "Ingeniería de Software" },
];

const SeleccionarInformeSinteticoSEC = () => {
  const [informes, setInformes] = useState(informesHardcodeados); // Inicializamos con datos locales para el renderizado
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const fetchInformesSinteticos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      // Simulación de fetch. Usaremos datos locales si hay error de conexión.
      const response = await fetch(`http://localhost:8000/informes-sinteticos/`);
      
      if (!response.ok) throw new Error("Error de conexión");
      
      const data = await response.json();
      setInformes(data.length === 0 ? informesHardcodeados : data);
    } catch (err) {
      console.warn("Usando datos locales por error de backend:", err);
      // Aquí se usaría el informe.descripcion + identificador para un mejor display
      setInformes(informesHardcodeados);
      // No seteamos error, solo advertencia, para no romper el flujo con los mocks.
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchInformesSinteticos();
  }, [fetchInformesSinteticos]);

  // --- ESTILOS EN LÍNEA (Integrados y optimizados) ---
  const estilosSecretaria = `
    /* Definición de colores clave para el estado "Pendiente/Revisión" */
    :root {
      --sec-color-principal: #2c3e50; /* Gris azulado oscuro para textos/botones base */
      --sec-color-pendiente: #8e44ad; /* Morado base para el estado pendiente */
      --sec-color-pendiente-hover: #7b3a9a; /* Morado oscuro para hover */
      --sec-color-fondo-icono: #f4ecf7; /* Fondo muy claro para el ícono */
    }

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
      color: var(--sec-color-principal);
    }

    .sec-spinner {
      animation: sec-spin 1s linear infinite;
      margin-bottom: 15px;
      color: var(--sec-color-pendiente);
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
      border-left: 4px solid var(--sec-color-pendiente); /* Borde morado */
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
      border-left-color: var(--sec-color-principal);
    }

    /* Bloque de Información (Icono + Textos) */
    .sec-info-bloque {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .sec-icono-materia {
      color: var(--sec-color-principal);
      background-color: var(--sec-color-fondo-icono);
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
      color: var(--sec-color-principal);
      margin: 0;
      line-height: 1.2;
    }

    .sec-id-informe {
      font-size: 0.85rem;
      color: #7f8c8d;
      font-weight: 500;
    }

    /* --- Botón de Acción (CORRECCIÓN CLAVE AQUÍ) --- */
    .sec-boton-accion {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: var(--sec-color-pendiente); /* Morado Base */
      color: #ffffff; /* Texto Blanco Inicial */
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
      background-color: var(--sec-color-pendiente-hover); /* Morado Oscuro en Hover */
      color: #ffffff; /* <<--- CORRECCIÓN: FUERZA EL TEXTO BLANCO */
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
                  {/* Se mantiene la descripción principal */}
                  <span className="sec-nombre-materia">{inf.descripcion}</span>
                  {/* Se muestra el identificador como info secundaria */}
                  {inf.identificador && (
                    <span className="sec-id-informe">{inf.identificador}</span>
                  )}
                </div>
              </div>

              <Link
                // Usamos la ruta anidada para el detalle confirmada en el turno anterior
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