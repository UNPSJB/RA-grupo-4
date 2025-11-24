import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, Loader2 } from "lucide-react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

interface InformeSintetico {
  id: number;
  descripcion: string;
  identificador?: string;
}

// Datos ajustados al contexto de "Informes Sintéticos"
const informesHardcodeados: InformeSintetico[] = [
  { id: 101, descripcion: "Informe Sintético: Programación I", identificador: "2024 - 1er Cuatrimestre" },
  { id: 102, descripcion: "Informe Sintético: Base de Datos", identificador: "2024 - Anual" },
  { id: 103, descripcion: "Informe Sintético: Ingeniería de Software", identificador: "2025 - Planificación" },
];

const SeleccionarInformeSinteticoSEC: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInformesSinteticos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/informes-sinteticos/`);
      if (!response.ok) throw new Error("Error de conexión");
      const data: InformeSintetico[] = await response.json();
      setInformes(data.length === 0 ? informesHardcodeados : data);
    } catch (err: any) {
      console.warn("Usando datos locales por error de backend:", err);
      setInformes(informesHardcodeados);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchInformesSinteticos();
  }, [fetchInformesSinteticos]);

  if (cargando) return (
    <div className="loading-wrapper">
      <Loader2 className="spinner" size={32} />
      <p style={{fontSize: '0.9rem'}}>Cargando informes...</p>
      <style>{`
        .loading-wrapper { display: flex; flex-direction: column; align-items: center; padding: 30px; color: #0056b3; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (error) return <ErrorCargaDatos mensajeError={error} onReintentar={fetchInformesSinteticos} />;

  return (
    <>
      <style>{`
        :root {
          --primary: #0056b3;
          --primary-dark: #004494;
          --bg-capsule: #ffffff;
          --border-color: #dbeafe; /* Azul muy suave */
          --border-hover: #0056b3;
          --text-main: #0f172a;    /* Color oscuro para texto principal */
          --text-sub: #64748b;     /* Gris para identificador */
        }

        .contenedor-principal {
          width: 100%;
          padding: 1rem 0; /* Menos padding vertical, pegado a los lados */
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          box-sizing: border-box;
        }

        .lista-informes {
          display: flex;
          flex-direction: column;
          gap: 0.8rem; /* Espacio más pequeño entre cápsulas */
          width: 100%;
        }

        /* DISEÑO CÁPSULA COMPACTA */
        .capsula-informe {
          background: var(--bg-capsule);
          border: 2px solid var(--border-color);
          border-radius: 12px; /* Redondeado, pero no exagerado */
          padding: 0.75rem 1.2rem; /* Relleno mucho más chico (compacto) */
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .capsula-informe:hover {
          border-color: var(--border-hover);
          background-color: #f8fafc;
        }

        .info-bloque {
          display: flex;
          align-items: center;
          gap: 0.8rem; /* Icono más cerca del texto */
        }

        .icono-azul {
          color: var(--primary);
          display: flex; /* Asegura centrado del icono */
        }

        .textos {
          display: flex;
          flex-direction: row;
          align-items: center; /* Centrado vertical con el texto */
          gap: 0.8rem;
          flex-wrap: wrap; /* Permite bajar si la pantalla es muy chica */
        }

        .nombre-materia {
          font-size: 1rem; /* Tamaño controlado */
          font-weight: 800; /* MUY NEGRITA */
          color: var(--primary);
          margin: 0;
          line-height: 1.2;
        }

        .id-informe {
          font-size: 0.85rem;
          color: var(--text-sub);
          font-weight: 400;
          padding-left: 0.5rem;
          border-left: 1px solid #cbd5e1; /* Pequeña línea divisoria visual */
          line-height: 1;
        }

        .boton-accion {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--primary);
          color: #ffffff;
          padding: 0.5rem 1rem; /* Botón más chico */
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background-color 0.2s;
          white-space: nowrap;
        }

        .boton-accion:hover {
          background-color: var(--primary-dark);
        }

        /* Ajustes responsive */
        @media (max-width: 600px) {
          .contenedor-principal { padding: 0.5rem; }
          .capsula-informe {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
          .boton-accion {
            width: 100%;
            justify-content: center;
          }
          .textos {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }
          .id-informe {
            border-left: none;
            padding-left: 0;
          }
        }
      `}</style>

      <div className="contenedor-principal">
        {informes.length === 0 ? (
          <SinDatos 
            mensaje="No hay informes sintéticos pendientes." 
            titulo="Sin Informes"
          />
        ) : (
          <div className="lista-informes">
            {informes.map((inf) => (
              <div key={inf.id} className="capsula-informe">
                <div className="info-bloque">
                  <div className="icono-azul">
                    {/* Icono un poco más chico para acompañar el diseño compacto */}
                    <BookOpen size={20} strokeWidth={2.5} />
                  </div>
                  
                  <div className="textos">
                    {/* Nombre de la materia en negrita */}
                    <span className="nombre-materia">{inf.descripcion}</span>
                    
                    {inf.identificador && (
                      <span className="id-informe">{inf.identificador}</span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/home/secretaria/informe-sintetico/ver/${inf.id}`}
                  className="boton-accion"
                >
                  Previsualizar
                  <Send size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SeleccionarInformeSinteticoSEC;