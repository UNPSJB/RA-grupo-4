import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importar useParams

// Interfaces
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
interface Seccion { // Interfaz para Seccion
    id: number;
    sigla: string;
    descripcion: string;
    preguntas: Pregunta[];
}
interface Encuesta { // Encuesta ahora tiene secciones
  id_encuesta: number;
  nombre: string;
  secciones: Seccion[];
}
interface RespuestaInput {
  pregunta_id: number;
  inscripcion_id: number;
  opcion_respuesta_id?: number | null;
  respuesta_abierta?: string | null;
}

// Subcomponentes (sin cambios funcionales)
const PreguntaCerrada: React.FC<{
    pregunta: Pregunta;
    respuesta: RespuestaInput;
    onChange: (preguntaId: number, opcionId: number) => void;
}> = ({ pregunta, respuesta, onChange }) => {
  return (
    <div>
        {pregunta.opciones_respuestas?.map((opcion) => (
            <label key={opcion.id} style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem", backgroundColor: "#2b2b2b", borderRadius: "4px" }}>
                <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuesta.opcion_respuesta_id === opcion.id}
                    onChange={() => onChange(pregunta.id, opcion.id)}
                     style={{ marginRight: "10px" }}
                />{" "}
                {opcion.descripcion}
            </label>
        ))}
    </div>
  );
};

const PreguntaAbierta: React.FC<{
    pregunta: Pregunta;
    respuesta: RespuestaInput;
    onChange: (preguntaId: number, texto: string) => void;
}> = ({ pregunta, respuesta, onChange }) => {
  return (
    <input
        type="text"
        name={`pregunta-${pregunta.id}`}
        value={respuesta.respuesta_abierta || ""}
        onChange={(e) => onChange(pregunta.id, e.target.value)}
        placeholder="Escribe tu respuesta..."
        style={{ width: "100%", padding: "0.6rem", backgroundColor: "#333", border: "1px solid #555", color: "#fff", borderRadius: "4px", boxSizing: "border-box" }}
    />
  );
};


// Componente Principal
const ResponderEncuesta: React.FC = (/* No necesita props */) => {
  // Leer inscripcionId de la URL
  const { inscripcionId: inscripcionIdFromUrl } = useParams<{ inscripcionId: string }>();
  const inscripcionId = inscripcionIdFromUrl ? parseInt(inscripcionIdFromUrl, 10) : null;
  const estudianteId = 1; // ID Hardcodeado

  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestaInput[]>([]);
  const [cargandoPagina, setCargandoPagina] = useState<boolean>(true);
  const [cargandoEnvio, setCargandoEnvio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!inscripcionId) {
      setError("ID de inscripción inválido en la URL.");
      setCargandoPagina(false);
      return;
    }

    const fetchEncuesta = async () => {
      try {
        setCargandoPagina(true);
        setError(null);
        // Usar la URL correcta con inscripcionId
        const res = await fetch(
          `http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/preguntas`
        );

        if (!res.ok) {
           let errorDetail = `Error ${res.status} al cargar la encuesta`;
           try {
               const errorData = await res.clone().json();
               if (errorData.detail) {
                   errorDetail = errorData.detail;
               }
           } catch (jsonError) { /* No hacer nada si no es JSON */ }

           if (res.status === 400 && errorDetail.includes("ya ha sido respondida")) {
               setError("Ya has respondido esta encuesta.");
           } else {
               throw new Error(errorDetail);
           }
        } else {
            const data: Encuesta = await res.json();
            setEncuesta(data);
            // Inicializar respuestas iterando secciones y preguntas
            const initRespuestas = data.secciones?.flatMap((s) =>
                s.preguntas?.map((p) => ({
                  pregunta_id: p.id,
                  inscripcion_id: inscripcionId,
                  opcion_respuesta_id: null,
                  respuesta_abierta: "",
                })) ?? []
            ) ?? [];
            setRespuestas(initRespuestas);
        }
      } catch (err: any) {
        console.error("Error en fetchEncuesta:", err);
        setError(err.message || "Error desconocido al cargar la encuesta.");
      } finally {
        setCargandoPagina(false);
      }
    };
    fetchEncuesta();
  }, [inscripcionId, estudianteId]);

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
    if (!inscripcionId) {
        setError("No se puede enviar: ID de inscripción inválido.");
        return;
    }
    // Obtener todas las preguntas de todas las secciones
    const todasLasPreguntas = encuesta?.secciones?.flatMap(s => s.preguntas) ?? [];
    if (!encuesta || todasLasPreguntas.length === 0) return;

    // Validación de obligatorias
    const preguntasObligatorias = todasLasPreguntas.filter((p) => p.obligatoria);
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

    // Envío
    setCargandoEnvio(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/respuestas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(respuestas),
        }
      );
      if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.detail || `Error al enviar: ${res.status}`);
      }
      setExito(true);
      setTimeout(() => {
        navigate('/home/seleccionar'); // Volver a la lista
      }, 2000);
    } catch (err: any) {
      console.error("Error en enviarRespuestas:", err);
      setError(err.message || "Error desconocido al enviar.");
    } finally {
      setCargandoEnvio(false);
    }
  };

  // Renderizado
  if (!inscripcionId) return <p style={{ color: "red" }}>Error: No se proporcionó un ID de inscripción válido.</p>;
  if (cargandoPagina) return <p style={{ color: "#333" }}>Cargando encuesta...</p>;
  if (error && !encuesta) return <p style={{ color: "red" }}>{error}</p>; // Error fatal al cargar
  if (exito) return <p style={{ color: "green", fontSize: "1.2rem", textAlign: "center" }}>¡Encuesta enviada correctamente! Gracias por participar.</p>;
  // Mostrar error si la encuesta ya fue respondida (detectado al cargar)
  if (error && error.includes("Ya has respondido")) return <p style={{ color: "orange", textAlign: "center" }}>{error}</p>;
  // Otros errores después de intentar cargar
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!encuesta) return <p style={{ color: "#333" }}>No se encontró la encuesta para esta inscripción.</p>;

  return (
    <div className="content-card">
      <h2 className="content-title">
        {encuesta.nombre}
      </h2>

      {/* Iterar sobre Secciones */}
      {encuesta.secciones?.map((seccion) => (
          <div key={seccion.id} style={{ marginBottom: '2rem', border: '1px solid #444', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#2b2b2b' }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#eee", marginBottom: "1.5rem", borderBottom: "1px solid #555", paddingBottom: "0.5rem" }}>
                  {seccion.sigla} - {seccion.descripcion}
              </h3>

              {/* Iterar sobre Preguntas de la sección */}
              {seccion.preguntas?.map((pregunta, index) => {
                   const respuesta = respuestas.find(r => r.pregunta_id === pregunta.id);
                   // Si por alguna razón no se inicializó la respuesta, no renderizar
                   if (!respuesta) return null;

                   return (
                    <div
                      key={pregunta.id}
                      style={{
                        marginBottom: "1.5rem",
                        paddingBottom: "1.5rem",
                        borderBottom: index === (seccion.preguntas?.length ?? 0) - 1 ? 'none' : '1px solid #444'
                      }}
                    >
                      <p style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                        {pregunta.enunciado}{" "}
                        {pregunta.obligatoria && <span style={{ color: "red", fontWeight: "bold" }}>*</span>}
                      </p>

                      {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
                         <PreguntaCerrada
                            pregunta={pregunta}
                            respuesta={respuesta}
                            onChange={manejarCambioCerrada}
                         />
                      )}

                      {pregunta.tipo === "ABIERTA" && (
                         <PreguntaAbierta
                            pregunta={pregunta}
                            respuesta={respuesta}
                            onChange={manejarCambioAbierta}
                         />
                      )}
                    </div>
                   );
               })}
          </div>
      ))}

      <button
        onClick={enviarRespuestas}
        disabled={cargandoEnvio}
        className="styled-button"
        style={{ marginTop: "20px" }}
      >
        {cargandoEnvio ? "Enviando..." : "Confirmar y Enviar Encuesta"}
      </button>

       {/* Mostrar error de envío/validación */}
       {error && !exito && <p style={{color: 'red', textAlign: 'center', marginTop: '15px'}}>{error}</p>}
    </div>
  );
};
export default ResponderEncuesta;