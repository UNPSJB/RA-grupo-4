import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

// --- CAMBIO: Interfaz actualizada para coincidir con EncuestaDisponibleOut ---
interface EncuestaDisponible {
  inscripcion_id: number;
  encuesta_id: number;
  nombre_encuesta: string;
  nombre_materia: string;
}

const SeleccionarEncuestas: React.FC = () => {
  // --- CAMBIO: Usamos la nueva interfaz ---
  const [encuestas, setEncuestas] = useState<EncuestaDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulamos un alumno logeado (mantenemos hardcodeado)
  const idAlumno = 1;

  useEffect(() => {
    const obtenerEncuestas = async () => {
      try {
        setLoading(true); // Asegurarse de poner loading al inicio
        setError(null);   // Limpiar errores previos

        // --- CAMBIO: Usamos el endpoint correcto del backend que filtra ---
        const response = await fetch(`http://localhost:8000/estudiantes/${idAlumno}/encuestas`);
        if (!response.ok) throw new Error("Error al obtener encuestas disponibles");
        // --- CAMBIO: Usamos la nueva interfaz ---
        const data: EncuestaDisponible[] = await response.json();
        setEncuestas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    obtenerEncuestas();
  }, [idAlumno]); // Dependencia idAlumno por si cambiara en el futuro

  // Mensajes de carga/error visibles en el fondo claro
  if (loading) return <p style={{ color: "#333" }}>Cargando encuestas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="content-card">
      <h3 className="content-title">Encuestas Disponibles</h3>
      {encuestas.length === 0 ? (
        <p>
          <SinDatos/>
        </p>
      ) : (
        <ul className="styled-list">
          {encuestas.map((encuesta) => (
            // --- CAMBIO: Usamos inscripcion_id como key ---
            <li key={encuesta.inscripcion_id}>
              {/* --- CAMBIO: Mostramos los nombres correctos --- */}
              <span><strong>{encuesta.nombre_encuesta}</strong> - {encuesta.nombre_materia}</span>
              {/* --- CAMBIO: El Link ahora usa inscripcion_id en la URL --- */}
              <Link to={`/menuAlumno/responder-encuesta/${encuesta.inscripcion_id}`} className="styled-button">
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