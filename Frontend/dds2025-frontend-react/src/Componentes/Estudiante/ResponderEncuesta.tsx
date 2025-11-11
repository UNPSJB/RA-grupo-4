import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Iconos para estados internos (Carga, Éxito, Navegación)
import { Loader2, AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

// --- ¡TUS COMPONENTES IMPORTADOS! ---
// Los usamos para los estados de página completa
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

// --- ========================================= --- */
// --- CSS INTEGRADO EN EL COMPONENTE            --- */
// --- ========================================= --- */
const ResponderEncuestaStyles = () => (
  <style>{`
    /* --- Contenedor Principal --- */
    .responder-encuesta-container {
      max-width: 900px;
      margin: 40px auto; /* Más margen superior */
      background: var(--card-bg, #fff);
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.07);
      border: 1px solid #eee;
      animation: fadeInUp 0.5s ease-out;
      overflow: hidden; /* Para contener los bordes */
    }

    /* --- Header de la Encuesta --- */
    .encuesta-header {
      padding: 25px 30px;
      border-bottom: 2px solid #f0f0f0;
    }
    .encuesta-header h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    /* --- Tabs de Secciones --- */
    .seccion-tabs-container {
      display: flex;
      flex-wrap: wrap; /* Para móviles */
      background-color: #f8f9fa;
      padding: 10px 25px;
      border-bottom: 2px solid #eee;
    }
    .seccion-tab {
      padding: 12px 20px;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color-light);
      background-color: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease-out;
      margin-right: 10px;
    }
    .seccion-tab:hover {
      color: var(--primary-color);
    }
    .seccion-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    
    /* --- Contenido de la Sección (Preguntas) --- */
    .seccion-content {
      padding: 30px;
    }
    .seccion-titulo {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 25px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    /* --- Tarjeta de Pregunta --- */
    .pregunta-card {
      margin-bottom: 25px;
      padding-bottom: 25px;
      border-bottom: 1px solid #f0f0f0;
    }
    .pregunta-card:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 10px;
    }
    .pregunta-enunciado {
      font-size: 1.15rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 15px;
    }
    .pregunta-enunciado .obligatorio-asterisco {
      color: var(--color-secretaria, #dc3545);
      font-weight: bold;
      margin-left: 4px;
    }

    /* --- Opciones Cerradas (Radio) --- */
    .opciones-cerradas-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .opcion-cerrada-label {
      display: flex;
      align-items: center;
      padding: 14px 18px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 2px solid #eee;
      cursor: pointer;
      transition: all 0.2s ease-out;
    }
    .opcion-cerrada-label:hover {
      background-color: #f1f3f5;
      border-color: #ccc;
    }
    /* Ocultamos el radio real */
    .opcion-cerrada-input {
      display: none;
    }
    /* Círculo personalizado */
    .opcion-cerrada-input + .opcion-radio-custom {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #aaa;
      margin-right: 12px;
      display: inline-block;
      transition: all 0.2s ease;
      position: relative;
    }
    /* Círculo interior (cuando está checked) */
    .opcion-cerrada-input:checked + .opcion-radio-custom {
      border-color: var(--primary-color);
      background-color: var(--primary-color);
    }
    .opcion-cerrada-input:checked + .opcion-radio-custom::after {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    /* Estilo del label cuando está checked */
    .opcion-cerrada-input:checked ~ .opcion-cerrada-text {
      font-weight: 600;
      color: var(--primary-color);
    }
    .opcion-cerrada-input:checked + .opcion-radio-custom + .opcion-cerrada-text {
      font-weight: 600;
      color: var(--primary-color);
    }

    /* --- Respuesta Abierta (Input) --- */
    .respuesta-abierta-input {
      width: 100%;
      padding: 12px 15px;
      font-size: 1rem;
      background-color: #f8f9fa;
      border: 2px solid #eee;
      color: #333;
      border-radius: 8px;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    .respuesta-abierta-input:focus {
      outline: none;
      border-color: var(--primary-color);
      background-color: #fff;
      box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb, 0, 86, 179), 0.1);
    }

    /* --- Navegación y Envío --- */
    .navegacion-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      background-color: #f8f9fa;
      border-top: 2px solid #eee;
    }
    .boton-navegacion, .boton-enviar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 25px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #e9ecef;
      color: #333;
    }
    .boton-navegacion:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .boton-navegacion:not(:disabled):hover {
      background-color: #dfe3e6;
    }
    .boton-enviar {
      background-color: var(--primary-color);
      color: white;
      box-shadow: 0 4px 15px -5px var(--primary-color);
    }
    .boton-enviar:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .boton-enviar:not(:disabled):hover {
      background-color: #004a99; /* Azul más oscuro */
      transform: translateY(-2px);
      box-shadow: 0 6px 20px -5px var(--primary-color);
    }

    /* --- Contenedor de estado (para Carga/Éxito) --- */
    .encuesta-estado-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 30px;
      text-align: center;
      animation: fadeInUp 0.5s ease-out;
      margin: 40px auto;
      max-width: 900px;
      background: var(--card-bg, #fff);
      border-radius: 12px;
    }
    .encuesta-estado-container p {
      font-size: 1.3rem;
      font-weight: 500;
      margin: 20px 0 0 0;
    }
    /* Icono de Carga (Spinner) */
    .encuesta-loading-icon {
      animation: spin 1.5s linear infinite;
      color: var(--primary-color);
    }
    /* Icono de Éxito */
    .encuesta-exito-icon {
      color: var(--color-alumno, #28a745);
    }
    /* Mensaje de error (al enviar) */
    .error-envio {
      color: var(--color-secretaria, #dc3545);
      text-align: center;
      margin-top: 15px;
      font-weight: 500;
      font-size: 1.1rem;
      padding: 0 30px 10px; /* Espacio para que no se pegue al footer */
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);


// --- ========================================= --- */
// --- INTERFACES (Lógica sin cambios)           --- */
// --- ========================================= --- */
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
interface RespuestaInput {
  pregunta_id: number;
  inscripcion_id: number;
  opcion_respuesta_id?: number | null;
  respuesta_abierta?: string | null;
}

// --- ========================================= --- */
// --- SUBCOMPONENTES DE PREGUNTAS (Con Clases)  --- */
// --- ========================================= --- */
const PreguntaCerrada: React.FC<{
  pregunta: Pregunta;
  respuesta: RespuestaInput;
  onChange: (preguntaId: number, opcionId: number) => void;
}> = ({ pregunta, respuesta, onChange }) => {
  return (
    <div className="opciones-cerradas-container">
      {pregunta.opciones_respuestas?.map((opcion) => (
        <label key={opcion.id} className="opcion-cerrada-label">
          <input
            type="radio"
            className="opcion-cerrada-input" // Clase para ocultar
            name={`pregunta-${pregunta.id}`}
            value={opcion.id}
            checked={respuesta.opcion_respuesta_id === opcion.id}
            onChange={() => onChange(pregunta.id, opcion.id)}
          />
          <span className="opcion-radio-custom"></span> 
          <span className="opcion-cerrada-text">{opcion.descripcion}</span>
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
      className="respuesta-abierta-input" // Clase de estilo
      name={`pregunta-${pregunta.id}`}
      value={respuesta.respuesta_abierta || ""}
      onChange={(e) => onChange(pregunta.id, e.target.value)}
      placeholder="Escribe tu respuesta..."
    />
  );
};

// --- ========================================= --- */
// --- COMPONENTE PRINCIPAL                      --- */
// --- ========================================= --- */
const ResponderEncuesta: React.FC = () => {
  const { inscripcionId: inscripcionIdFromUrl } = useParams<{ inscripcionId: string }>();
  const inscripcionId = inscripcionIdFromUrl ? parseInt(inscripcionIdFromUrl, 10) : null;
  const estudianteId = 1; // ID Hardcodeado

  const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
  const [respuestas, setRespuestas] = useState<RespuestaInput[]>([]);
  const [cargandoPagina, setCargandoPagina] = useState<boolean>(true);
  const [cargandoEnvio, setCargandoEnvio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<boolean>(false);
  
  const [seccionActivaIndex, setSeccionActivaIndex] = useState(0);
  
  const navigate = useNavigate();

  // --- LÓGICA DE FETCH (Sin cambios) ---
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
        const res = await fetch(
          `http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/preguntas`
        );
        if (!res.ok) {
          let errorDetail = `Error ${res.status} al cargar la encuesta`;
          try {
            const errorData = await res.clone().json();
            if (errorData.detail) errorDetail = errorData.detail;
          } catch (jsonError) { /* No hacer nada si no es JSON */ }
          if (res.status === 400 && errorDetail.includes("ya ha sido respondida")) {
            setError("Ya has respondido esta encuesta.");
          } else {
            throw new Error(errorDetail);
          }
        } else {
          const data: Encuesta = await res.json();
          setEncuesta(data);
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

  // --- LÓGICA DE MANEJO DE CAMBIOS (Sin cambios) ---
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

  // --- LÓGICA DE ENVÍO (Lógica sin cambios, ruta de navigate corregida) ---
  const enviarRespuestas = async () => {
    if (!inscripcionId) {
      setError("No se puede enviar: ID de inscripción inválido.");
      return;
    }
    const todasLasPreguntas = encuesta?.secciones?.flatMap(s => s.preguntas) ?? [];
    if (!encuesta || todasLasPreguntas.length === 0) return;

    let primeraIncompleta: Pregunta | null = null;
    for (const preg of todasLasPreguntas.filter((p) => p.obligatoria)) {
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
      const seccionIncompletaIndex = encuesta.secciones.findIndex(s => 
        s.preguntas.some(p => p.id === primeraIncompleta!.id)
      );
      if (seccionIncompletaIndex !== -1) {
        setSeccionActivaIndex(seccionIncompletaIndex);
      }
      setError(`Error: Debe responder la pregunta obligatoria: "${primeraIncompleta.enunciado}"`);
      return;
    }

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
        navigate('/home/alumno/seleccionar'); 
      }, 2000);
    } catch (err: any) {
      console.error("Error en enviarRespuestas:", err);
      setError(err.message || "Error desconocido al enviar.");
    } finally {
      setCargandoEnvio(false);
    }
  };

  // --- NUEVAS FUNCIONES DE NAVEGACIÓN ---
  const handleSiguiente = () => {
    if (encuesta && seccionActivaIndex < encuesta.secciones.length - 1) {
      setSeccionActivaIndex(seccionActivaIndex + 1);
    }
  };
  const handleAnterior = () => {
    if (seccionActivaIndex > 0) {
      setSeccionActivaIndex(seccionActivaIndex - 1);
    }
  };

  // --- ========================================= --- */
  // --- RENDERIZADO (Con tus componentes)         --- */
  // --- ========================================= --- */

  // --- ESTADO 1: ID Inválido (USA ERRORCARGADATOS) ---
  if (!inscripcionId) {
    return (
      <>
        <ResponderEncuestaStyles />
        <ErrorCargaDatos mensaje="No se proporcionó un ID de inscripción válido en la URL." />
      </>
    );
  }

  // --- ESTADO 2: Cargando (Usa loader simple) ---
  if (cargandoPagina) {
    return (
      <>
        <ResponderEncuestaStyles />
        <div className="encuesta-estado-container">
          <Loader2 size={48} className="encuesta-loading-icon" />
          <p>Cargando encuesta...</p>
        </div>
      </>
    );
  }

  // --- ESTADO 3: Éxito (Usa mensaje simple) ---
  if (exito) {
    return (
      <>
        <ResponderEncuestaStyles />
        <div className="encuesta-estado-container">
          <CheckCircle size={48} className="encuesta-exito-icon" />
          <p>¡Encuesta enviada correctamente! Gracias por participar.</p>
        </div>
      </>
    );
  }

  // --- ESTADO 4: Ya respondida (USA SINDATOS) ---
  if (error && error.includes("Ya has respondido")) {
    return (
      <>
        <ResponderEncuestaStyles />
        <SinDatos 
          titulo="Encuesta ya respondida" 
          mensaje={error}
        />
      </>
    );
  }
  
  // --- ESTADO 5: Error fatal de carga (USA ERRORCARGADATOS) ---
  if (error && !encuesta) {
    return (
      <>
        <ResponderEncuestaStyles />
        <ErrorCargaDatos mensaje={error} />
      </>
    );
  }

  // --- ESTADO 6: No encontrada (USA SINDATOS) ---
  if (!encuesta) {
    return (
      <>
        <ResponderEncuestaStyles />
        <SinDatos 
          titulo="Encuesta no encontrada" 
          mensaje="No se encontró la encuesta para esta inscripción."
        />
      </>
    );
  }
  
  // --- ESTADO 7: Renderizado normal de la encuesta ---
  const seccionActiva = encuesta.secciones[seccionActivaIndex];
  const preguntasActivas = seccionActiva?.preguntas ?? [];
  const esUltimaSeccion = seccionActivaIndex === encuesta.secciones.length - 1;

  return (
    <>
      <ResponderEncuestaStyles />
      <div className="responder-encuesta-container">
        <div className="encuesta-header">
          <h2>{encuesta.nombre}</h2>
        </div>

        <div className="seccion-tabs-container">
          {encuesta.secciones.map((seccion, index) => (
            <button
              key={seccion.id}
              className={`seccion-tab ${index === seccionActivaIndex ? 'active' : ''}`}
              onClick={() => setSeccionActivaIndex(index)}
            >
              {seccion.sigla}
            </button>
          ))}
        </div>

        <div className="seccion-content">
          <h3 className="seccion-titulo">{seccionActiva.descripcion}</h3>
          
          {preguntasActivas.map((pregunta) => {
            const respuesta = respuestas.find(r => r.pregunta_id === pregunta.id);
            if (!respuesta) return null; 

            return (
              <div key={pregunta.id} className="pregunta-card">
                <p className="pregunta-enunciado">
                  {pregunta.enunciado}
                  {pregunta.obligatoria && <span className="obligatorio-asterisco">*</span>}
                </p>

                {pregunta.tipo === "CERRADA" && (
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

        {/* Error de validación (no es un estado de página completa) */}
        {error && !exito && <p className="error-envio">{error}</p>}

        <div className="navegacion-footer">
          <button
            onClick={handleAnterior}
            disabled={seccionActivaIndex === 0 || cargandoEnvio}
            className="boton-navegacion"
          >
            <ArrowLeft size={18} />
            Anterior
          </button>

          {!esUltimaSeccion ? (
            <button
              onClick={handleSiguiente}
              disabled={cargandoEnvio}
              className="boton-navegacion"
              style={{backgroundColor: 'var(--primary-color)', color: 'white'}}
            >
              Siguiente
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={enviarRespuestas}
              disabled={cargandoEnvio}
              className="boton-enviar"
            >
              {cargandoEnvio ? "Enviando..." : "Confirmar y Enviar"}
              <CheckCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ResponderEncuesta;