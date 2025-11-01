import React, { useState, useEffect } from "react";

type OpcionRespuesta = {
    descripcion: string;
    cantidad: number;
    porcentaje: number;
};

type Pregunta = {
    pregunta_id: number;
    enunciado: string;
    opciones: OpcionRespuesta[];
};

type Seccion = {
    seccion_id: number;
    sigla: string;
    descripcion: string;
    preguntas: Pregunta[];
};

type MateriaEstadisticasProps = {
    materia_id: number;
    nombre_materia: string;
    total_inscriptos: number;
    total_encuestas_procesadas: number;
    secciones: Seccion[];
};

export const MateriaEstadisticasAcordeones: React.FC<{ data: MateriaEstadisticasProps }> = ({
    data,
}) => {
    const [abiertas, setAbiertas] = useState<number[]>(data.secciones.map((s) => s.seccion_id));

    const toggleSeccion = (id: number) => {
        setAbiertas((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    return (
        <div
            style={{
                fontFamily: '"Segoe UI", "Roboto", sans-serif',
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                padding: "28px",
                animation: "fadeIn 0.6s ease forwards",
            }}
        >
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .barra-animada {
                    transition: width 0.6s ease;
                    position: relative;
                }
                `}
            </style>

            <h2 style={{ color: "#003366", fontWeight: "bold", marginBottom: "8px" }}>
                {data.nombre_materia}
            </h2>
            <p style={{ color: "#000", fontSize: "15px", marginBottom: "20px" }}>
                Total inscriptos: <strong>{data.total_inscriptos}</strong> | Encuestas procesadas:{" "}
                <strong>{data.total_encuestas_procesadas}</strong>
            </p>

            {/* Acordeones de secciones */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {data.secciones.map((seccion) => {
                    const abierta = abiertas.includes(seccion.seccion_id);
                    return (
                        <div
                            key={seccion.seccion_id}
                            style={{
                                borderRadius: "10px",
                                overflow: "hidden",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Encabezado del acordeón */}
                            <button
                                onClick={() => toggleSeccion(seccion.seccion_id)}
                                style={{
                                    width: "100%",
                                    backgroundColor: "#e6f2ff",
                                    color: "#003366",
                                    textAlign: "left",
                                    padding: "16px 20px",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                aria-expanded={abierta}
                            >
                                <span>
                                    {seccion.sigla} – {seccion.descripcion}
                                </span>
                                <span style={{ fontSize: "18px" }}>{abierta ? "▲" : "▼"}</span>
                            </button>

                            {/* Contenido de preguntas */}
                            {abierta && (
                                <fieldset
                                    style={{
                                        border: "2px solid #003366",
                                        borderTop: "none",
                                        borderRadius: "0 0 8px 8px",
                                        backgroundColor: "#f9f9f9",
                                        padding: "20px",
                                        marginTop: "0",
                                        transition: "all 0.3s ease",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "12px",
                                    }}
                                >
                                    <legend style={{ display: "none" }} />

                                    {seccion.preguntas.map((pregunta) => (
                                        <div
                                            key={pregunta.pregunta_id}
                                            style={{
                                                backgroundColor: "#fff",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "8px",
                                                padding: "12px 16px 24px 16px",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                                position: "relative",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    color: "#000",
                                                    fontWeight: "bold",
                                                    fontSize: "15px",
                                                    marginBottom: "4px",
                                                }}
                                            >
                                                {pregunta.enunciado}
                                            </h4>

                                            {/* Barras horizontales */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "8px",
                                                    position: "relative",
                                                    borderTop: "1px dashed rgba(0,0,0,0.1)",
                                                    paddingTop: "10px",
                                                }}
                                            >
                                                {pregunta.opciones.map((op, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "160px 1fr",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#000",
                                                                textAlign: "right",
                                                            }}
                                                        >
                                                            {op.descripcion}
                                                        </span>

                                                        <div
                                                            style={{
                                                                position: "relative",
                                                                backgroundColor: "#eef5fb",
                                                                borderRadius: "6px",
                                                                height: "22px",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            <div
                                                                className="barra-animada"
                                                                style={{
                                                                    height: "100%",
                                                                    width: `${op.porcentaje}%`,
                                                                    backgroundColor: "#0078D4",
                                                                    borderRadius: "6px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "flex-end",
                                                                    color: "#fff",
                                                                    fontSize: "12px",
                                                                    fontWeight: "bold",
                                                                    paddingRight: "6px",
                                                                    whiteSpace: "nowrap",
                                                                }}
                                                            >
                                                                {op.porcentaje > 5 && `${op.porcentaje.toFixed(1)}%`}
                                                            </div>

                                                            {/* Si la barra es muy corta, mostrar el % afuera */}
                                                            {op.porcentaje <= 5 && (
                                                                <span
                                                                    style={{
                                                                        position: "absolute",
                                                                        left: `${op.porcentaje + 1}%`,
                                                                        top: "50%",
                                                                        transform: "translateY(-50%)",
                                                                        fontSize: "12px",
                                                                        color: "#003366",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    {op.porcentaje.toFixed(1)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </fieldset>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EstadisticasPreguntasPage: React.FC = () => {
    const [data, setData] = useState<MateriaEstadisticasProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:8000/materias/1/estadisticas/preguntas")
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar datos");
                return res.json();
            })
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading)
        return <p style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif' }}>Cargando estadísticas...</p>;
    if (error)
        return <p style={{ color: "#dc3545", fontWeight: "bold" }}>Error: {error}</p>;
    if (!data)
        return <p>No hay datos para mostrar.</p>;

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
            }}
        >
            <MateriaEstadisticasAcordeones data={data} />
        </div>
    );
};

export default EstadisticasPreguntasPage;
