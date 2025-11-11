import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

interface ResumenSeccion {
    id: number;
    sigla: string;
    nombre: string;
    porcentajes_opciones: Record<string, number>;
}

interface InformeAC {
    id_informeAC: number;
    codigoMateria: string;
    nombreMateria: string;
    porcentaje_contenido_abordado: number;
    porcentaje_teoricas: number;
    porcentaje_practicas: number;
    justificacion_porcentaje: string;
    resumenSecciones: ResumenSeccion[];
    opinionSobreResumen: string;
}

interface Props {
    departamentoId: number;
    anio: number;
}

const colores = [
    "#007bff",
    "#00bcd4",
    "#003366",
    "#1a73e8",
    "#2e7dba",
    "#5b9bd5",
    "#4682b4",
];

const SECCIONES_PERMITIDAS = ["B", "C", "D", "E-Teoria", "E-Practica"];

const PorcentajesInformeSintetico: React.FC<Props> = ({ departamentoId, anio }) => {
    const [informes, setInformes] = useState<InformeAC[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInformes = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/informes-sinteticos/departamento/${departamentoId}/periodo/${anio}/informesAC/porcentajes`
                );
                const data = await response.json();
                setInformes(data);
            } catch (error) {
                console.error("Error al cargar informes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInformes();
    }, [departamentoId, anio]);

    if (loading)
        return <p style={{ color: "#003366" }}>Cargando informes...</p>;

    if (!informes || informes.length === 0)
        return <p style={{ color: "#003366" }}>No hay informes disponibles.</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Porcentajes de los Informes de Actividad Curricular</h2>

            <div style={styles.grid}>
                {informes.map((info) => {
                    // Filtrar las secciones deseadas
                    const seccionesFiltradas = info.resumenSecciones.filter((s) =>
                        SECCIONES_PERMITIDAS.includes(s.sigla)
                    );

                    // Armar los datos del gráfico
                    const allOptions: Record<string, any> = {};
                    seccionesFiltradas.forEach((sec) => {
                        Object.entries(sec.porcentajes_opciones).forEach(([opcion, valor]) => {
                            if (!allOptions[opcion]) allOptions[opcion] = {};
                            allOptions[opcion][`${sec.sigla} - ${sec.nombre}`] = valor;
                        });
                    });

                    const chartData = Object.entries(allOptions).map(([opcion, valores]) => ({
                        opcion,
                        ...valores,
                    }));

                    return (
                        <div key={info.id_informeAC} style={styles.card}>
                            {/* 🔷 Legend institucional */}
                            <div style={styles.legendBox}>
                                <h3 style={styles.legendTitle}>
                                    {info.codigoMateria} — {info.nombreMateria}
                                </h3>
                                <p style={styles.legendSub}>
                                    Informe detallado de porcentajes de clases y valoración de encuestas por secciones.
                                </p>
                            </div>

                            {/* 📊 Porcentajes + Justificación */}
                            <div style={styles.percentagesBlock}>
                                <div style={styles.percentagesLeft}>
                                    <div style={styles.percentItem}>
                                        <span style={styles.percentTitle}>Clases Teóricas</span>
                                        <span style={styles.percentValue}>
                                            {info.porcentaje_teoricas}%
                                        </span>
                                        <p style={styles.percentDesc}>
                                            Se dictó el {info.porcentaje_teoricas}% de las clases teóricas programadas.
                                        </p>
                                    </div>

                                    <div style={styles.percentItem}>
                                        <span style={styles.percentTitle}>Clases Prácticas</span>
                                        <span style={styles.percentValue}>
                                            {info.porcentaje_practicas}%
                                        </span>
                                        <p style={styles.percentDesc}>
                                            Se realizaron el {info.porcentaje_practicas}% de las actividades prácticas previstas.
                                        </p>
                                    </div>

                                    <div style={styles.percentItem}>
                                        <span style={styles.percentTitle}>Contenido Abordado</span>
                                        <span style={styles.percentValue}>
                                            {info.porcentaje_contenido_abordado}%
                                        </span>
                                        <p style={styles.percentDesc}>
                                            Del total de contenidos del plan de estudio, se logró cubrir el {info.porcentaje_contenido_abordado}%.
                                        </p>
                                    </div>
                                </div>

                                <div style={styles.justificacionBox}>
                                    <label style={styles.label}>Justificación del porcentaje de clases dictadas:</label>
                                    <textarea
                                        value={
                                            info.justificacion_porcentaje ||
                                            "No se ha registrado una justificación para este informe."
                                        }
                                        readOnly
                                        style={styles.textarea}
                                    />
                                </div>
                            </div>

                            {/* 📈 Gráfico por secciones */}
                            <div style={styles.chartBlock}>
                                <h2 style={styles.chartTitle}>Resumen valores de encuestas por Sección</h2>
                                <p style={styles.chartContext}>
                                    Porcentajes promedio de respuestas en las encuestas de las siguientes secciones.
                                </p>

                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart
                                        data={chartData}
                                        layout="vertical"
                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                        barGap={6} 
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis
                                            dataKey="opcion"
                                            type="category"
                                            width={160}
                                            tick={{ fontSize: 13 }}
                                        />
                                        <Tooltip 
                                            formatter={(value: number) => `${value}%`}
                                            labelFormatter={(label) => `Opción: ${label}`}
                                        />
                                        <Legend />
                                        {seccionesFiltradas.map((sec, i) => (
                                            <Bar
                                                key={sec.sigla}
                                                dataKey={`${sec.sigla} - ${sec.nombre}`}
                                                fill={colores[i % colores.length]}
                                                name={`${sec.sigla} - ${sec.nombre}`}
                                                barSize={18} // 🔹 Barras un poco más grandes
                                                radius={[0, 6, 6, 0]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* 💬 Opinión final */}
                            <div style={styles.opinionBox}>
                                <label style={styles.label}>Opinión general sobre el resumen</label>
                                <textarea
                                    value={
                                        info.opinionSobreResumen ||
                                        "No se registró una opinión específica sobre el resumen."
                                    }
                                    readOnly
                                    style={styles.textarea}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PorcentajesInformeSintetico;

/* 🎨 Estilos */
const styles: Record<string, React.CSSProperties> = {
    container: {
        backgroundColor: "#f9f9f9",
        padding: "24px",
        fontFamily: '"Inter", "Roboto", sans-serif',
        color: "#003366",
    },
    heading: {
        marginBottom: "24px",
        fontSize: "26px", // 🔹 Aumenté tamaño
        fontWeight: 700,
    },
    grid: {
        display: "grid",
        gap: "24px",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    legendBox: {
        backgroundColor: "#003366",
        color: "#fff",
        padding: "14px 18px",
    },
    legendTitle: {
        fontSize: "22px",
        fontWeight: 700,
        margin: 0,
    },
    legendSub: {
        fontSize: "14px",
        margin: 0,
        opacity: 0.85,
    },
    percentagesBlock: {
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "16px",
        backgroundColor: "#f4f8fb",
        padding: "14px",
        borderRadius: "0 0 12px 12px",
    },
    percentagesLeft: {
        display: "flex",
        flexDirection: "column",
        gap: "12px", // 🔹 Más separación entre items
    },
    percentItem: {
        backgroundColor: "#ffffffb3",
        borderRadius: "8px",
        padding: "10px 12px",
    },
    percentTitle: { fontWeight: 600, fontSize: "18px" },
    percentValue: {
        marginLeft: "8px",
        fontSize: "18px",
        fontWeight: 700,
        color: "#007bff",
    },
    percentDesc: {
        fontSize: "14px",
        color: "#333",
        marginTop: "4px",
    },
    justificacionBox: {
        backgroundColor: "#ffffffb3",
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: "18px",
        fontWeight: 600,
        marginBottom: "4px",
    },
    textarea: {
        width: "100%",
        minHeight: "80px",
        resize: "none",
        borderRadius: "6px",
        border: "1px solid #c2d4ea",
        padding: "2px",
        fontFamily: '"Inter", sans-serif',
        fontSize: "13px",
        color: "#003366",
        backgroundColor: "#e8f1fb",
    },
    chartBlock: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    },
    chartTitle: {
        fontSize: "22px", // 🔹 Más grande
        fontWeight: 600,
        marginBottom: "4px",
    },
    chartContext: {
        fontSize: "13px",
        color: "#555",
        marginBottom: "8px",
    },
    opinionBox: {
        backgroundColor: "#f4f8fb",
        borderRadius: "8px",
        padding: "10px",
    },
};
