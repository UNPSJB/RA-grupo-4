import React, { useState, useEffect, memo } from "react";
import { useParams } from "react-router-dom"; 
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";

type OpcionRespuesta = {
    descripcion: string;
    cantidad: number;
    porcentaje: number;
};

type Pregunta = {
    pregunta_id: number;
    enunciado: string;
    opciones?: OpcionRespuesta[];
    respuestas_abiertas?: string[];
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

/* --- Componente memoizado para gráficos  */
const PreguntaGrafico: React.FC<{ opciones: OpcionRespuesta[] }> = memo(({ opciones }) => (
    <ResponsiveContainer width="100%" height={40 * opciones.length}>
        <BarChart
            data={opciones}
            layout="vertical"
            margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
            barCategoryGap="15%"
        >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
                type="category"
                dataKey="descripcion"
                width={250}
                tick={{ fontSize: 13, fill: "#000", textAnchor: "end" }}
            />
            <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Bar dataKey="porcentaje" fill="#0078D4" radius={[4, 4, 4, 4]}>
                <LabelList
                    dataKey="porcentaje"
                    position="right"
                    formatter={(v: number) => `${v.toFixed(1)}%`}
                    style={{
                        fill: "#003366",
                        fontWeight: "bold",
                        fontSize: 12,
                    }}
                />
            </Bar>
        </BarChart>
    </ResponsiveContainer>
));

/* --- Componente de Acordeones --- */
export const MateriaEstadisticasAcordeones: React.FC<{ data: MateriaEstadisticasProps }> = ({
    data,
}) => {
    const [abiertas, setAbiertas] = useState<number[]>([]);
    const [preguntasAbiertas, setPreguntasAbiertas] = useState<number[]>([]);

    const toggleSeccion = (id: number) => {
        setAbiertas((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const togglePregunta = (id: number) => {
        setPreguntasAbiertas((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
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
                .scroll-area::-webkit-scrollbar { width: 8px; }
                .scroll-area::-webkit-scrollbar-thumb { background-color: #a5c7e6; border-radius: 8px; }
                .scroll-area::-webkit-scrollbar-thumb:hover { background-color: #7aaed6; }
                `}
            </style>

            <h2 style={{ color: "#003366", fontWeight: "bold", marginBottom: "8px" }}>
                {data.nombre_materia}
            </h2>
            <p style={{ color: "#000", fontSize: "15px", marginBottom: "20px" }}>
                Total inscriptos: <strong>{data.total_inscriptos}</strong> | Encuestas procesadas:{" "}
                <strong>{data.total_encuestas_procesadas}</strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {data.secciones?.map((seccion) => {
                    const abierta = abiertas.includes(seccion.seccion_id);
                    return (
                        <div key={seccion.seccion_id} style={{ borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
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
                                <span>{seccion.sigla} – {seccion.descripcion}</span>
                                <span style={{ fontSize: "18px" }}>{abierta ? "▲" : "▼"}</span>
                            </button>

                            <div style={{ maxHeight: abierta ? "5000px" : "0", overflow: "hidden", opacity: abierta ? 1 : 0, transition: "all 0.5s ease", backgroundColor: "#f9f9f9" }}>
                                <fieldset style={{ border: "2px solid #003366", borderTop: "none", borderRadius: "0 0 8px 8px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <legend style={{ display: "none" }} />
                                    {seccion.preguntas?.map((pregunta) => {
                                        const esAbierta = pregunta.respuestas_abiertas && pregunta.respuestas_abiertas.length > 0;
                                        const preguntaAbierta = preguntasAbiertas.includes(pregunta.pregunta_id);

                                        return (
                                            <div key={pregunta.pregunta_id} style={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <h4 style={{ color: "#000", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pregunta.enunciado}</h4>
                                                    {esAbierta && (
                                                        <button
                                                            onClick={() => togglePregunta(pregunta.pregunta_id)}
                                                            style={{ backgroundColor: "#e6f2ff", border: "1px solid #a5c7e6", color: "#003366", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "bold", width: "90px", height: "58px", lineHeight: "1.1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", transition: "background-color 0.2s ease" }}
                                                        >
                                                            {preguntaAbierta ? <><span>Ocultar</span><span>Respuestas</span><span>▲</span></> : <><span>Ver</span><span>Respuestas</span><span>▼</span></>}
                                                        </button>
                                                    )}
                                                </div>

                                                {pregunta.opciones && pregunta.opciones.length > 0 && (
                                                    <div style={{ backgroundColor: "#f3f7fb", borderRadius: "6px", padding: "10px 20px" }}>
                                                        <PreguntaGrafico opciones={pregunta.opciones} />
                                                    </div>
                                                )}

                                                {esAbierta && preguntaAbierta && (
                                                    <div className="scroll-area" style={{ marginTop: "12px", backgroundColor: "#f3f7fb", borderRadius: "8px", padding: "12px", maxHeight: "350px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                                                        {pregunta.respuestas_abiertas?.map((resp, idx) => (
                                                            <div key={idx} style={{ backgroundColor: "#fff", border: "1px solid #cce4f6", borderRadius: "8px", padding: "12px 14px", fontSize: "14px", color: "#000", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.5 }}>
                                                                {resp}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </fieldset>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* --- Componente Principal --- */
const EstadisticasPorPregunta: React.FC = () => {
    const { materiaId } = useParams<{ materiaId: string }>(); 
    
    const [data, setData] = useState<MateriaEstadisticasProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!materiaId) return;

        fetch(`http://localhost:8000/materias/${materiaId}/estadisticas/preguntas`)
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
    }, [materiaId]); 

    if (loading)
        return <p style={{ fontFamily: '"Segoe UI", "Roboto", sans-serif', padding: '20px' }}>Cargando estadísticas...</p>;
    if (error) return <p style={{ color: "#dc3545", fontWeight: "bold", padding: '20px' }}>Error: {error}</p>;
    if (!data) return <p style={{ padding: '20px' }}>No hay datos para mostrar.</p>;

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

export default EstadisticasPorPregunta;