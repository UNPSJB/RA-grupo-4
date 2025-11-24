import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Send, Loader2 } from "lucide-react"; // Usamos los mismos iconos
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

interface InformeSintetico {
  id: number;
  descripcion: string;
  identificador?: string;
}

const informesHardcodeados: InformeSintetico[] = [
  { id: 101, descripcion: "Informe Sintético: Programación I", identificador: "2024 - 1er Cuatrimestre" },
  { id: 102, descripcion: "Informe Sintético: Base de Datos", identificador: "2024 - Anual" },
  { id: 103, descripcion: "Informe Sintético: Ingeniería de Software", identificador: "2025 - Planificación" },
];

const SeleccionarInformeSinteticoSEC: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInformesSinteticos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/informes-sinteticos/`);
      
      if (!response.ok) throw new Error("Error de conexión");
      
      const data: InformeSintetico[] = await response.json();
      setInformes(data.length === 0 ? informesHardcodeados : data);
      
    } catch (err: any) {
      console.warn("Usando datos locales por error de backend:", err);
      setInformes(informesHardcodeados);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInformesSinteticos();
  }, [fetchInformesSinteticos]);

  if (loading) return (
    <div className="loading-wrapper">
      <Loader2 className="spinner" size={30} />
      <p>Cargando informes...</p>
      <style>{`
        .loading-wrapper { display: flex; flex-direction: column; align-items: center; padding: 40px; color: #003366; }
        .spinner { animation: spin 1s linear infinite; margin-bottom: 10px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (error) return <ErrorCargaDatos mensajeError={error} onReintentar={fetchInformesSinteticos} />;

  return (
    <div className="seleccionar-informes-container">
      {/* Estilos copiados y adaptados de tu ejemplo de Encuestas */}
      <style>{`
        .seleccionar-informes-container {
          padding: 10px 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .lista-informes {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tarjeta-informe {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e8f4ff; /* Mismo borde sutil azul claro */
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .tarjeta-informe:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .informe-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-grow: 1;
          overflow: hidden;
        }

        .icono-informe {
          color: #0078D4; /* Azul del ejemplo */
          flex-shrink: 0;
        }

        .informe-descripcion {
          font-weight: 700;
          color: #003366; /* Azul oscuro para el título */
          font-size: 1.05rem;
          white-space: nowrap;
        }

        .informe-identificador {
          color: #555;
          font-size: 0.95rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
        }

        /* Separador visual opcional entre título e ID si la pantalla es ancha */
        .separador {
            display: inline-block;
            margin: 0 8px;
            color: #ccc;
        }

        .boton-primario {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #0078D4; /* Azul sólido */
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.1s ease;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .boton-primario:hover {
          background-color: #005bb5;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .tarjeta-informe {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .informe-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            width: 100%;
          }
          
          .separador { display: none; }

          .informe-descripcion {
            white-space: normal; /* Permitir salto de línea en móvil */
          }

          .boton-primario {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {informes.length === 0 ? (
        <SinDatos 
          mensaje="No hay informes sintéticos pendientes." 
          titulo="Informes Sintéticos"
        />
      ) : (
        <ul className="lista-informes">
          {informes.map((inf) => (
            <li key={inf.id} className="tarjeta-informe">
              <div className="informe-info">
                {/* Icono a la izquierda */}
                <BookOpen size={20} className="icono-informe" />
                
                {/* Nombre principal (Negrita, Azul Oscuro) */}
                <span className="informe-descripcion">{inf.descripcion}</span>
                
                {/* Identificador (Gris) */}
                {inf.identificador && (
                    <>
                        <span className="separador">|</span>
                        <span className="informe-identificador">{inf.identificador}</span>
                    </>
                )}
              </div>

              {/* Botón Sólido Azul */}
              <Link
                to={`/home/secretaria/informe-sintetico/ver/${inf.id}`} 
                className="boton-primario"
              >
                Previsualizar <Send size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeleccionarInformeSinteticoSEC;