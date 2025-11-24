import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, BookOpen } from "lucide-react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

interface EncuestaDisponible {
  inscripcion_id: number;
  encuesta_id: number;
  nombre_encuesta: string;
  nombre_materia: string;
}

const SeleccionarEncuestas: React.FC = () => {
  const [encuestas, setEncuestas] = useState<EncuestaDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idAlumno = 1;

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const obtenerEncuestas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8000/estudiantes/${idAlumno}/encuestas`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("No se pudieron obtener las encuestas disponibles.");
        }

        const data: EncuestaDisponible[] = await response.json();
        setEncuestas(data);
      } catch (err: any) {
        console.error("Error al obtener encuestas:", err);
        if (err.name === "AbortError") {
          setError("Tiempo de espera agotado. El servidor no respondió.");
        } else {
          setError(err.message || "Error inesperado al cargar las encuestas.");
        }
      } finally {
        setLoading(false);
      }
    };

    obtenerEncuestas();

    return () => clearTimeout(timeoutId);
  }, [idAlumno]);

  if (loading) return <p style={{ color: "#003366", padding: "20px" }}>Cargando encuestas...</p>;
  if (error) return <ErrorCargaDatos mensaje={error} />;

  return (
    <div className="seleccionar-encuestas-container">
      <style>{`
        .seleccionar-encuestas-container {
          padding: 10px 0;
        }

        .lista-encuestas {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tarjeta-encuesta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e8f4ff;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .tarjeta-encuesta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .encuesta-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-grow: 1;
          overflow: hidden;
        }

        .icono-materia {
          color: #0078D4;
          flex-shrink: 0;
        }

        .materia-nombre {
          font-weight: 700;
          color: #003366;
          font-size: 1.05rem;
          white-space: nowrap;
        }

        .encuesta-nombre {
          color: #555;
          font-size: 0.95rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
        }

        .boton-primario {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #0078D4;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .boton-primario:hover {
          background-color: #005bb5;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .tarjeta-encuesta {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .encuesta-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .boton-primario {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {encuestas.length === 0 ? (
        <SinDatos 
          mensaje="No hay encuestas disponibles para responder en este momento." 
          titulo="Encuestas Pendientes"
        />
      ) : (
        <ul className="lista-encuestas">
          {encuestas.map((encuesta) => (
            <li key={encuesta.inscripcion_id} className="tarjeta-encuesta">
              <div className="encuesta-info">
                <BookOpen size={20} className="icono-materia" />
                <span className="materia-nombre">{encuesta.nombre_materia}</span>
                <span className="encuesta-nombre">{encuesta.nombre_encuesta}</span>
              </div>
              <Link
                to={`responder-encuesta/${encuesta.inscripcion_id}`} 
                className="boton-primario"
              >
                Responder <Send size={16} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeleccionarEncuestas;