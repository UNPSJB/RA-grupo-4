import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos

    const obtenerEncuestas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8000/estudiantes/${idAlumno}/encuestas`,
          { signal: controller.signal }
        );

        console.log("Respuesta del backend:", response);

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

  if (loading) return <p style={{ color: "#333" }}>Cargando encuestas...</p>;

  if (error) return <ErrorCargaDatos mensaje={error} />;

  return (
    <div className="content-card">
      <h3 className="content-title">Encuestas Disponibles</h3>

      {encuestas.length === 0 ? (
        <SinDatos mensaje="No hay encuestas disponibles para responder en este momento." />
      ) : (
        <ul className="styled-list">
          {encuestas.map((encuesta) => (
            <li key={encuesta.inscripcion_id}>
              <span>
                <strong>{encuesta.nombre_encuesta}</strong> – {encuesta.nombre_materia}
              </span>
              <Link
                to={`/menuAlumno/responder-encuesta/${encuesta.inscripcion_id}`}
                className="styled-button"
              >
                Seleccionar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SeleccionarEncuestas;
