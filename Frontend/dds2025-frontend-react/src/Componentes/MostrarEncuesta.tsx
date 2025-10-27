import React, { useEffect, useState } from "react";
// --- AÑADIDO: Importar useParams ---
import { useParams } from "react-router-dom";

// Interfaces (Asegúrate de que coincidan con tu backend y ResponderEncuesta)
interface OpcionRespuesta {
  id: number;
  descripcion: string;
  pregunta_id: number;
}
interface Pregunta {
  id: number;
  enunciado: string;
  tipo: "ABIERTA" | "CERRADA";
  obligatoria: boolean;
  opciones_respuestas?: OpcionRespuesta[];
}
interface Seccion {
    id: number;
    sigla: string;
    descripcion: string;
    preguntas: Pregunta[];
}
interface Encuesta {
  id_encuesta: number;
  nombre: string;
  secciones: Seccion[];
}

// Props ya no son necesarias si leemos de la URL
// interface MostrarEncuestaProps {
//   estudianteId: number;
//   encuestaId: number; // Ya no se usa directamente
// }

const MostrarEncuesta: React.FC</*Ya no recibe props */> = (/* props */) => {

  // --- CAMBIO: Leer inscripcionId de la URL ---
  const { inscripcionId: inscripcionIdFromUrl } = useParams<{ inscripcionId: string }>();
  const inscripcionId = inscripcionIdFromUrl ? parseInt(inscripcionIdFromUrl, 10) : null;
  // Hardcodear estudianteId por ahora
  const estudianteId = 1;
  // --- FIN CAMBIO ---

  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // Solo cargar si el ID es válido
    if (!inscripcionId) {
      setError("ID de inscripción inválido en la URL.");
      setCargando(false);
      return;
    }

    const fetchEncuesta = async () => {
      try {
        setCargando(true); // Poner cargando al inicio
        setError(null);   // Limpiar errores

        // --- CAMBIO: Usar la URL correcta con inscripcionId ---
        const res = await fetch(
          `http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/preguntas`
        );
        // --- FIN CAMBIO ---

        if (!res.ok) {
          throw new Error(`Error ${res.status} al cargar la encuesta`);
        }

        const data: Encuesta = await res.json();
        setEncuesta(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchEncuesta();
  // --- CAMBIO: Dependencias actualizadas ---
  }, [estudianteId, inscripcionId]); // Usar inscripcionId

  // Renderizado
  if (!inscripcionId) return <p style={{ color: "red" }}>Error: No se proporcionó un ID de inscripción válido.</p>;
  if (cargando) return <p style={{ color: "#333" }}>Cargando encuesta...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!encuesta) return <p style={{ color: "#333" }}>No se encontró la encuesta para esta inscripción.</p>;

  return (
    // Aplicamos el estilo unificado
    <div className="content-card">
      <h3 className="content-title">{encuesta.nombre}</h3>
      {/* Iteramos sobre secciones y luego preguntas */}
      {encuesta.secciones?.map((seccion) => (
          <div key={seccion.id} style={{ marginBottom: '2rem', /* Estilos opcionales para la sección */ }}>
              <h4 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#eee", marginBottom: "1.5rem", borderBottom: "1px solid #555", paddingBottom: "0.5rem" }}>
                  {seccion.sigla} - {seccion.descripcion}
              </h4>
              {seccion.preguntas?.map((pregunta, index) => (
                <div
                  key={pregunta.id}
                  style={{
                    marginBottom: "1.5rem",
                    paddingBottom: "1.5rem",
                    borderBottom: index === (seccion.preguntas?.length ?? 0) - 1 ? 'none' : '1px solid #444'
                  }}
                >
                  <p style={{ fontSize: "1.1rem" }}>
                    {pregunta.enunciado}{" "}
                    {pregunta.obligatoria && <span style={{ color: "red", fontWeight: 'bold' }}>*</span>}
                  </p>
                  {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
                    <ul style={{ paddingLeft: "20px", listStyle: 'disc', color: '#ccc' }}>
                      {pregunta.opciones_respuestas.map((opcion) => (
                        <li key={opcion.id} style={{ margin: '5px 0' }}>{opcion.descripcion}</li>
                      ))}
                    </ul>
                  )}
                  {pregunta.tipo === "ABIERTA" && (
                    <p style={{ fontStyle: "italic", color: "#888" }}>
                      (Pregunta de respuesta abierta)
                    </p>
                  )}
                </div>
              ))}
          </div>
       ))}
    </div>
  );
};

export default MostrarEncuesta;
