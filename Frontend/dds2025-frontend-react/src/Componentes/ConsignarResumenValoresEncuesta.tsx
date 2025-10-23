import React, { useEffect, useState } from "react";
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

// --- Tipos ---
interface SeccionResumen {
    id: number;
    sigla: string;
    nombre: string;
    porcentajes_opciones: Record<string, number>;
}

interface InformeAC {
    id_informesAC: number;
    resumenSecciones: SeccionResumen[];
    opinionSobreResumen?: string;
}

interface Props {
    idInforme: number;
}

// --- Componente principal ---
const ResumenSecciones: React.FC<Props> = ({ idInforme }) => {
    const [informe, setInforme] = useState<InformeAC | null>(null);
    const [comentario, setComentario] = useState<string>("");

    useEffect(() => {
        fetch(`http://localhost:8000/informesAC/${idInforme}`)
            .then(res => res.json())
            .then(data => {
                setInforme(data);
                setComentario(data.opinionSobreResumen || "");
            });
    }, [idInforme]);

    const guardarComentario = async () => {
        if (!informe) return;

        await fetch(`http://localhost:8000/informesAC/${idInforme}/opinion`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ opinion: comentario }),
        });

        setInforme({ ...informe, opinionSobreResumen: comentario });
    };

    if (!informe) return <div>Cargando informe...</div>;

    // Filtrar solo las secciones deseadas
    const seccionesFiltradas = informe.resumenSecciones.filter(s =>
        ["B", "C", "D", "E-Teoria", "E-Practica"].includes(s.sigla)
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Título principal */}
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    marginBottom: "0.5rem",
                }}
            >
                Resumen valores de encuesta
            </h2>

            {/* Contenedor de secciones */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "0.6rem",
                }}
            >
                {seccionesFiltradas.map((seccion, index) => {
                    // Determinar si está en la última fila incompleta
                    const itemsRestantes = seccionesFiltradas.length - index;
                    const isUltimos =
                        seccionesFiltradas.length % 3 !== 0 &&
                        index >= seccionesFiltradas.length - (seccionesFiltradas.length % 3);

                    const flexBasis = isUltimos
                        ? `calc(${100 / (seccionesFiltradas.length % 3)}% - 0.6rem)`
                        : "calc(33.33% - 0.6rem)";

                    return (
                        <div
                            key={seccion.id}
                            style={{
                                flex: `1 1 ${flexBasis}`,
                                minWidth: "280px",
                                maxWidth: "400px",
                                padding: "0.5rem",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                backgroundColor: "#fff",
                            }}
                        >
                            <h3
                                style={{
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginBottom: "0.3rem",
                                    textAlign: "center",
                                }}
                            >
                                {seccion.nombre}
                            </h3>

                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={Object.entries(seccion.porcentajes_opciones).map(
                                        ([opcion, porcentaje]) => ({
                                            opcion,
                                            porcentaje,
                                        })
                                    )}
                                    margin={{ top: 20, right: 10, left: 0, bottom: 70 }}
                                >
                                    <XAxis
                                        dataKey="opcion"
                                        interval={0}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                        tick={{ fontSize: 13 }}
                                    />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value: any) => `${value}%`} />
                                    <Bar dataKey="porcentaje" fill="#4f46e5" barSize={25}>
                                        <LabelList
                                            dataKey="porcentaje"
                                            position="top"
                                            formatter={(value: any) =>
                                                typeof value === "number" ? `${value}%` : value
                                            }
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>

            {/* Comentario del docente */}
            <div
                style={{
                    padding: "0.5rem",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                }}
            >
                <h3
                    style={{
                        fontWeight: "600",
                        fontSize: "1rem",
                        marginBottom: "0.3rem",
                    }}
                >
                    Juicio de valor sobre los valores
                </h3>
                <textarea
                    style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        padding: "0.3rem",
                        borderRadius: "4px",
                    }}
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={3}
                />
                <button
                    style={{
                        marginTop: "0.3rem",
                        padding: "0.3rem 0.6rem",
                        backgroundColor: "#4f46e5",
                        color: "white",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={guardarComentario}
                >
                    Guardar Comentario
                </button>
            </div>
        </div>
    );
};

// --- Wrapper ---
const ResumenSeccionesWrapper: React.FC = () => {
    const { idInforme } = useParams<{ idInforme: string }>();
    if (!idInforme) return <div>ID de informe no proporcionado</div>;
    const id = parseInt(idInforme, 10);
    if (isNaN(id)) return <div>ID de informe inválido</div>;
    return <ResumenSecciones idInforme={id} />;
};

export default ResumenSeccionesWrapper;
