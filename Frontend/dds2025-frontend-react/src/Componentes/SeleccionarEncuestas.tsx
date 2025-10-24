import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Encuesta {
  id: number; 
  nombre: string;
  materia: string;
  habilitada: boolean;
}

const SeleccionarEncuestas: React.FC = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulamos un alumno logeado
  const idAlumno = 1;

  useEffect(() => {
    const obtenerEncuestas = async () => {
      try {
        const response = await fetch(`http://localhost:8000/encuestas/estudiantes/${idAlumno}`);
        if (!response.ok) throw new Error("Error al obtener encuestas");
        const data = await response.json();
        setEncuestas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    obtenerEncuestas();
  }, []);

  if (loading) return <p style={{ color: "#333" }}>Cargando encuestas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="content-card">
      <h3 className="content-title">Encuestas Disponibles</h3>
      {encuestas.length === 0 ? (
        <p>No hay encuestas disponibles para ti.</p>
      ) : (
        <ul className="styled-list">
          {encuestas.map((encuesta) => (
            <li key={encuesta.id}>
              <span><strong>{encuesta.nombre}</strong> - {encuesta.materia}</span>
              <Link to={`/home/responder-encuesta/${encuesta.id}`} className="styled-button">
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
