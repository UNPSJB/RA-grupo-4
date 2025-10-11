import React, { useEffect, useState } from "react";

interface Encuesta {
  id: number;
  nombre: string;
  materia: string;
  habilitada: boolean;
}

const SeleccionarEncuesta: React.FC = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionada, setSeleccionada] = useState<Encuesta | null>(null);

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

  const manejarSeleccion = (encuesta: Encuesta) => {
    setSeleccionada(encuesta);
  };

  if (loading) return <p>Cargando encuestas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Encuestas disponibles</h2>
      {encuestas.length === 0 ? (
        <p>No hay encuestas disponibles para ti.</p>
      ) : (
        <ul>
          {encuestas.map((encuesta) => (
            <li key={encuesta.id} style={{ margin: "8px 0" }}>
              <strong>{encuesta.nombre}</strong> - {encuesta.materia}
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => manejarSeleccion(encuesta)}
              >
                Seleccionar
              </button>
            </li>
          ))}
        </ul>
      )}

      {seleccionada && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <h3>Encuesta seleccionada:</h3>
          <p><strong>{seleccionada.nombre}</strong> - {seleccionada.materia}</p>
        </div>
      )}
    </div>
  );
};

export default SeleccionarEncuesta;
