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

interface Seccion {
    id: number;
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
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<boolean>(false);

    useEffect(() => {
        const fetchEncuesta = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/estudiantes/${estudianteId}/encuestas/${encuestaId}/preguntas`
                );
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data: Encuesta = await res.json();
                setEncuesta(data);

                // Inicializar respuestas para todas las preguntas de todas las secciones
                const initRespuestas = data.secciones.flatMap((s) =>
                    s.preguntas.map((p) => ({
                        pregunta_id: p.id,
                        inscripcion_id: inscripcionId,
                        opcion_respuesta_id: null,
                        respuesta_abierta: "",
                    }))
                );
                setRespuestas(initRespuestas);
            } catch (err: any) {
                setError(err.message);
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
        try {
            const res = await fetch(
                `http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/respuestas`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(respuestas),
                }
            );
            if (!res.ok) throw new Error(`Error ${res.status}`);
            setExito(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (error) return <p>Error: {error}</p>;
    if (!encuesta) return <p>Cargando encuesta...</p>;
    if (exito) return <p>¡Respuestas enviadas correctamente!</p>;

    return (
        <div>
            <h2>{encuesta.nombre}</h2>
            {encuesta.secciones?.map((seccion) => (
                <div key={seccion.id} style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "0.8rem" }}>{seccion.descripcion}</h3>

                    {seccion.preguntas?.map((pregunta) => {
                        const respuesta = respuestas.find((r) => r.pregunta_id === pregunta.id);
                        if (!respuesta) return null;

                        return (
                            <div key={pregunta.id} style={{ marginBottom: "1.5rem" }}>
                                <p>
                                    {pregunta.enunciado}{" "}
                                    {pregunta.obligatoria && (
                                        <span style={{ color: "red" }}>*</span>
                                    )}
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
            ))}

            <button
                onClick={enviarRespuestas}
                style={{ marginTop: "20px", padding: "0.6rem 1rem" }}
            >
                Enviar respuestas
            </button>
        </div>
    );
};

export default ResponderEncuesta;
