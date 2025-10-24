import React, { useEffect, useState } from "react";

interface OpcionRespuesta {
    id: number;
    descripcion: string;
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
            }
        };

        fetchEncuesta();
    }, [estudianteId, encuestaId]);

    if (error) return <p>Error: {error}</p>;
    if (!encuesta) return <p>Cargando encuesta...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                {encuesta.nombre}
            </h2>

            {encuesta.secciones.map((seccion) => (
                <div
                    key={seccion.id}
                    style={{
                        marginBottom: "2rem",
                        padding: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1.2rem",
                            color: "#333",
                            marginBottom: "1rem",
                        }}
                    >
                        {seccion.sigla} - {seccion.descripcion}
                    </h3>

                    {seccion.preguntas.map((pregunta, index) => (
                        <div
                            key={pregunta.id}
                            style={{
                                marginBottom: "1.5rem",
                                padding: "0.5rem 0",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <p style={{ marginBottom: "0.5rem" }}>
                                <strong>
                                    {index + 1}. {pregunta.enunciado}
                                </strong>{" "}
                                {pregunta.obligatoria && (
                                    <span style={{ color: "red" }}>*</span>
                                )}
                            </p>

                            {pregunta.tipo === "CERRADA" &&
                                pregunta.opciones_respuestas &&
                                pregunta.opciones_respuestas.length > 0 && (
                                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                                        {pregunta.opciones_respuestas.map(
                                            (opcion) => (
                                                <li
                                                    key={opcion.id}
                                                    style={{
                                                        marginBottom: "0.25rem",
                                                        color: "#444",
                                                    }}
                                                >
                                                    • {opcion.descripcion}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}

                            {pregunta.tipo === "ABIERTA" && (
                                <p
                                    style={{
                                        fontStyle: "italic",
                                        color: "#666",
                                        marginTop: "0.3rem",
                                    }}
                                >
                                    (Respuesta abierta)
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