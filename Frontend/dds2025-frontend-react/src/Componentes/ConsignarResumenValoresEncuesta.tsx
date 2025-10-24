import React, { useEffect, useState } from "react";
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
export interface SeccionResumen {
    id: number;
    sigla: string;
    nombre: string;
    porcentajes_opciones: Record<string, number>;
}

interface Props {
    idInforme?: number;
    idMateria: number;
    handleChange?: (nuevoResumen: SeccionResumen[], nuevoComentario: string) => void;
}

const ResumenSecciones: React.FC<Props> = ({ idInforme, idMateria, handleChange }) => {
    const [resumen, setResumen] = useState<SeccionResumen[]>([]);
    const [comentario, setComentario] = useState<string>("");

    // --- Fetch de datos ---
    useEffect(() => {
        if (idInforme) {
            fetch(`http://localhost:8000/informesAC/${idInforme}`)
                .then(res => res.json())
                .then((data: { resumenSecciones: SeccionResumen[]; opinionSobreResumen?: string }) => {
                    setResumen(data.resumenSecciones || []);
                    setComentario(data.opinionSobreResumen || "");
                });
        } else if (idMateria) {
            fetch(`http://localhost:8000/informesAC/resumen/materia/${idMateria}`)
                .then(res => res.json())
                .then((data: SeccionResumen[]) => setResumen(data || []));
        }
    }, [idInforme, idMateria]);

    // --- Manejo local de cambios en el comentario ---
        const handleComentarioLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const nuevoComentario = e.target.value;
            setComentario(nuevoComentario);

            // Notificar al componente padre
            handleChange?.(resumen, nuevoComentario);
        };


    if (!resumen || resumen.length === 0) return <div>Cargando resumen...</div>;

    // Filtrar solo las secciones deseadas
    const seccionesFiltradas = resumen.filter(s =>
        ["B", "C", "D", "E-Teoria", "E-Practica"].includes(s.sigla)
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h2 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                Resumen valores de encuesta
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.6rem" }}>
                {seccionesFiltradas.map((seccion, index) => {
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
                            <h3 style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "0.3rem", textAlign: "center" }}>
                                {seccion.nombre}
                            </h3>

                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={Object.entries(seccion.porcentajes_opciones).map(([opcion, porcentaje]) => ({
                                        opcion,
                                        porcentaje,
                                    }))}
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
                                            formatter={(value: any) => (typeof value === "number" ? `${value}%` : value)}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px", backgroundColor: "#fff" }}>
                <h3 style={{ fontWeight: "600", fontSize: "1rem", marginBottom: "0.3rem" }}>
                    Juicio de valor sobre los valores
                </h3>
                <textarea
                    style={{ width: "100%", border: "1px solid #ccc", padding: "0.3rem", borderRadius: "4px" }}
                    value={comentario}
                    onChange={handleComentarioLocalChange}
                    rows={3}
                />
            </div>
        </div>
    );
};

export default ResumenSecciones;
