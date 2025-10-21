import React, { useEffect, useState } from "react";

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

interface Encuesta {
  id_encuesta: number;
  nombre: string;
  preguntas: Pregunta[];
}

interface MostrarEncuestaProps {
  estudianteId: number;
  encuestaId: number;
}

const MostrarEncuesta: React.FC<MostrarEncuestaProps> = ({
  estudianteId,
  encuestaId,
}) => {
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(true); 

  useEffect(() => {
    const fetchEncuesta = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/estudiantes/${estudianteId}/encuestas/${encuestaId}/preguntas`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
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
  }, [estudianteId, encuestaId]);

  if (cargando) return <p style={{ color: "#333" }}>Cargando encuesta...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!encuesta) return <p>No se encontró la encuesta.</p>;

  return (
    <div className="content-card">
      <h3 className="content-title">{encuesta.nombre}</h3>
      {encuesta.preguntas.map((pregunta, index) => (
        <div 
          key={pregunta.id} 
          style={{ 
            marginBottom: "1.5rem", 
            paddingBottom: "1.5rem", 
            borderBottom: index === encuesta.preguntas.length - 1 ? 'none' : '1px solid #444' 
          }}
        >
          <p style={{ fontSize: "1.1rem" }}>
            {pregunta.enunciado}{" "}
            {pregunta.obligatoria ? (
              <span style={{ color: "red", fontWeight: 'bold' }}>*</span>
            ) : null}
          </p>

          {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
            <ul style={{ paddingLeft: "20px", listStyle: 'circle', color: '#ccc' }}>
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
  );
};

export default MostrarEncuesta;
