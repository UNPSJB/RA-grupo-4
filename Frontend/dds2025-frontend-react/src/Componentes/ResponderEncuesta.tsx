import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    descripcion: string;
    preguntas: Pregunta[];
}

interface Encuesta {
  id_encuesta: number;
  nombre: string;
  preguntas: Pregunta[];
}

interface RespuestaInput {
  pregunta_id: number;
  inscripcion_id: number;
  opcion_respuesta_id?: number | null;
  respuesta_abierta?: string | null;
}

interface ResponderEncuestaProps {
  estudianteId: number;
  inscripcionId: number;
  encuestaId: number;
}

const PreguntaCerrada: React.FC<{
    pregunta: Pregunta;
    respuesta: RespuestaInput;
    onChange: (preguntaId: number, opcionId: number) => void;
}> = ({ pregunta, respuesta, onChange }) => (
    <div>
        {pregunta.opciones_respuestas?.map((opcion) => (
            <label key={opcion.id} style={{ display: "block", margin: "0.3rem 0" }}>
                <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuesta.opcion_respuesta_id === opcion.id}
                    onChange={() => onChange(pregunta.id, opcion.id)}
                />{" "}
                {opcion.descripcion}
            </label>
        ))}
    </div>
);

const PreguntaAbierta: React.FC<{
    pregunta: Pregunta;
    respuesta: RespuestaInput;
    onChange: (preguntaId: number, texto: string) => void;
}> = ({ pregunta, respuesta, onChange }) => (
    <input
        type="text"
        name={`pregunta-${pregunta.id}`}
        value={respuesta.respuesta_abierta || ""}
        onChange={(e) => onChange(pregunta.id, e.target.value)}
        placeholder="Escribe tu respuesta..."
        style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
    />
);

const ResponderEncuesta: React.FC<ResponderEncuestaProps> = ({
  estudianteId,
  inscripcionId,
  encuestaId,
}) => {
  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestaInput[]>([]);
  
  
  const [cargandoPagina, setCargandoPagina] = useState<boolean>(true);
  const [cargandoEnvio, setCargandoEnvio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<boolean>(false);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEncuesta = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/estudiantes/${estudianteId}/encuestas/${encuestaId}/preguntas`
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Encuesta = await res.json();
        setEncuesta(data);

        const initRespuestas = data.preguntas.map((p) => ({
          pregunta_id: p.id,
          inscripcion_id: inscripcionId,
          opcion_respuesta_id: null,
          respuesta_abierta: "", 
        }));
        setRespuestas(initRespuestas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setCargandoPagina(false); 
      }
    };

    fetchEncuesta();
  }, [estudianteId, encuestaId, inscripcionId]);

  const manejarCambioCerrada = (preguntaId: number, opcionId: number) => {
    setRespuestas((prev) =>
      prev.map((r) =>
        r.pregunta_id === preguntaId
          ? { ...r, opcion_respuesta_id: opcionId, respuesta_abierta: null }
          : r
      )
    );
  };

  const manejarCambioAbierta = (preguntaId: number, texto: string) => {
    setRespuestas((prev) =>
      prev.map((r) =>
        r.pregunta_id === preguntaId
          ? { ...r, respuesta_abierta: texto, opcion_respuesta_id: null }
          : r
      )
    );
  };

  const enviarRespuestas = async () => {
    
    // 1. Validar preguntas obligatorias
    if (!encuesta) return;
    const preguntasObligatorias = encuesta.preguntas.filter((p) => p.obligatoria);
    let primeraIncompleta: Pregunta | null = null;

    for (const preg of preguntasObligatorias) {
      const respuesta = respuestas.find((r) => r.pregunta_id === preg.id);
      
      const noRespondida = 
        !respuesta || 
        (preg.tipo === "CERRADA" && !respuesta.opcion_respuesta_id) ||
        (preg.tipo === "ABIERTA" && !respuesta.respuesta_abierta?.trim());

      if (noRespondida) {
        primeraIncompleta = preg;
        break; 
      }
    }

    if (primeraIncompleta) {
      setError(`Error: Debe responder la pregunta obligatoria: "${primeraIncompleta.enunciado}"`);
      return; 
    }

    // 2. Si la validación pasa, enviar
    setCargandoEnvio(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/respuestas/`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(respuestas), 
        }
      );

      if (!res.ok) throw new Error(`Error al enviar: ${res.status}`);
      
      setExito(true);
      setTimeout(() => {
        navigate('/home'); 
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargandoEnvio(false);
    }
  };

  if (cargandoPagina) return <p style={{ color: "#ccc" }}>Cargando encuesta...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (exito) return <p style={{ color: "green", fontSize: "1.2rem" }}>¡Encuesta enviada correctamente! Gracias por participar.</p>;
  if (!encuesta) return <p style={{ color: "#ccc" }}>No se encontró la encuesta.</p>;

  return (
    <div style={{ 
      color: "#fff", 
      backgroundColor: "#222", 
      padding: "20px", 
      borderRadius: "6px",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      <h2 style={{ 
        marginBottom: "25px", 
        color: "#fff", 
        borderBottom: "1px solid #444", 
        paddingBottom: "10px" 
      }}>
        {encuesta.nombre}
      </h2>
      
      {encuesta.preguntas.map((pregunta) => (
        <div key={pregunta.id} style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
            {pregunta.enunciado}{" "}
            {pregunta.obligatoria && <span style={{ color: "red", fontWeight: "bold" }}>*</span>}
          </p>

          {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
            <div>
              {pregunta.opciones_respuestas.map((opcion) => (
                <label key={opcion.id} style={{ 
                  display: "block", 
                  margin: "0.5rem 0", 
                  padding: "0.5rem",
                  backgroundColor: "#2b2b2b",
                  borderRadius: "4px"
                }}>
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={
                      respuestas.find((r) => r.pregunta_id === pregunta.id)
                        ?.opcion_respuesta_id === opcion.id
                    }
                    onChange={() =>
                      manejarCambioCerrada(pregunta.id, opcion.id)
                    }
                    style={{ marginRight: "10px" }}
                  />{" "}
                  {opcion.descripcion}
                </label>
              ))}
            </div>
          )}

          {pregunta.tipo === "ABIERTA" && (
            <div>
              <input
                type="text"
                name={`pregunta-${pregunta.id}`}
                value={
                  respuestas.find((r) => r.pregunta_id === pregunta.id)
                    ?.respuesta_abierta || ""
                }
                onChange={(e) =>
                  manejarCambioAbierta(pregunta.id, e.target.value)
                }
                placeholder="Escribe tu respuesta..."
                style={{ 
                  width: "100%", 
                  padding: "0.6rem", 
                  backgroundColor: "#333", 
                  border: "1px solid #555",
                  color: "#fff",
                  borderRadius: "4px",
                  boxSizing: "border-box" 
                }}
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={enviarRespuestas}
        disabled={cargandoEnvio} // <-- Deshabilitar mientras se envía
        style={{ 
          marginTop: "20px", 
          padding: "0.8rem 1.5rem",
          backgroundColor: cargandoEnvio ? "#555" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        {cargandoEnvio ? "Enviando..." : "Confirmar y Enviar Encuesta"}
      </button>
    </div>
  );
};

export default ResponderEncuesta;