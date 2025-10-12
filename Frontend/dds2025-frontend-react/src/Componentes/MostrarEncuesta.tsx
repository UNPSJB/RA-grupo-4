// ./Componentes/MostrarEncuesta.tsx

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
    if (!encuesta) return <p>No se encontró la encuesta.</p>;

    return (
        <div>
            <h2>{encuesta.nombre}</h2>
            {encuesta.preguntas.map((pregunta) => (
                <div key={pregunta.id} style={{ marginBottom: "1.5rem" }}>
                    <p>
                        {pregunta.enunciado}{" "}
                        {pregunta.obligatoria ? (
                            <span style={{ color: "red" }}>*</span>
                        ) : null}
                    </p>

                    {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
                        <ul style={{ paddingLeft: "20px" }}>
                            {pregunta.opciones_respuestas.map((opcion) => (
                                <li key={opcion.id}>{opcion.descripcion}</li>
                            ))}
                        </ul>
                    )}

                    {pregunta.tipo === "ABIERTA" && (
                        <p style={{ fontStyle: "italic", color: "#555" }}>
                            Respuesta abierta
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MostrarEncuesta;
