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
    <div
        style={{
            padding: "2rem",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#111",
            backgroundColor: "#f8fafc",
            minHeight: "100vh",
        }}
    >
        <h2
            style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                marginBottom: "2rem",
                color: "#1e293b",
                textAlign: "center",
            }}
        >
            {encuesta.nombre}
        </h2>

        {encuesta.secciones.map((seccion) => (
            <div
                key={seccion.id}
                style={{
                    marginBottom: "2rem",
                    padding: "1.5rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.1)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                        "0 2px 6px rgba(0, 0, 0, 0.05)")
                }
            >
                <h3
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "1rem",
                        borderBottom: "2px solid #e2e8f0",
                        paddingBottom: "0.3rem",
                    }}
                >
                    {seccion.sigla} — {seccion.descripcion}
                </h3>

                {seccion.preguntas.map((pregunta, index) => (
                    <div
                        key={pregunta.id}
                        style={{
                            marginBottom: "1.25rem",
                            padding: "0.75rem 0",
                            borderBottom: "1px solid #f1f5f9",
                        }}
                    >
                        <p
                            style={{
                                marginBottom: "0.5rem",
                                fontSize: "1rem",
                                lineHeight: 1.5,
                                color: "#1e293b",
                            }}
                        >
                            <strong>
                                {index + 1}. {pregunta.enunciado}
                            </strong>{" "}
                            {pregunta.obligatoria && (
                                <span
                                    style={{
                                        color: "#dc2626",
                                        marginLeft: "4px",
                                        fontWeight: 600,
                                    }}
                                >
                                    *
                                </span>
                            )}
                        </p>

                        {pregunta.tipo === "CERRADA" &&
                            pregunta.opciones_respuestas &&
                            pregunta.opciones_respuestas.length > 0 && (
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        paddingLeft: "1rem",
                                        margin: 0,
                                    }}
                                >
                                    {pregunta.opciones_respuestas.map(
                                        (opcion) => (
                                            <li
                                                key={opcion.id}
                                                style={{
                                                    marginBottom: "0.4rem",
                                                    color: "#475569",
                                                    fontSize: "0.95rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: "#6366f1",
                                                        marginRight: "0.5rem",
                                                    }}
                                                >
                                                    ●
                                                </span>
                                                {opcion.descripcion}
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}

                        {pregunta.tipo === "ABIERTA" && (
                            <p
                                style={{
                                    fontStyle: "italic",
                                    color: "#64748b",
                                    fontSize: "0.95rem",
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