import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList,
} from "recharts";

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
    disabled?: boolean; 
}

const styles: { [key: string]: React.CSSProperties } = {
    title: { 
        fontSize: "1.8rem", 
        fontWeight: "700", 
        color: '#003366', 
        marginBottom: "20px", 
        paddingBottom: '10px',
        borderBottom: '2px solid #17a2b8', 
    },
    instructionBlock: {
        color: '#272727ff', 
        fontSize: '15px', 
        lineHeight: '1.5', 
        marginBottom: '24px',
        padding: '14px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '8px', 
        border: '1px solid #ddd', 
        fontWeight: 500,
    },
    chartsGrid: {
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center", 
        gap: "20px",
        marginBottom: "30px",
    },
    chartCard: { 
        flex: "1 1 calc(33.33% - 20px)", 
        minWidth: "280px", 
        maxWidth: "400px", 
        padding: "15px", 
        border: "1px solid #e0e0e0", 
        borderRadius: "10px", 
        backgroundColor: "#ffffff",
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
    },
    chartTitle: { 
        fontWeight: "600", 
        fontSize: "1.1rem", 
        marginBottom: "10px", 
        textAlign: "center",
        color: '#003366',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '8px',
    },
    commentSection: {
        padding: "20px", 
        border: "2px solid #003366", 
        borderRadius: "12px", 
        backgroundColor: "#fff",
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    },
    commentTitle: { 
        fontWeight: "600", 
        fontSize: "1.1rem", 
        marginBottom: "10px",
        color: '#003366',
    },
    fieldEditable: {
        width: '100%',
        minHeight: '100px',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #aaa',
        fontSize: '15px',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        backgroundColor: '#cce4f6', 
        color: '#111',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box' as const,
        resize: 'vertical' as const,
    },
    fieldReadOnly: {
        width: '100%',
        minHeight: '100px',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '10px 0',
        color: '#000',
        fontSize: '15px',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        cursor: 'default',
        fontWeight: 500,
        outline: 'none',
        boxShadow: 'none',
        resize: 'none' as const,
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap' as const,
    }
};

const ResumenSecciones: React.FC<Props> = ({ idInforme, idMateria, handleChange, disabled = false }) => {
    const [resumen, setResumen] = useState<SeccionResumen[]>([]);
    const [comentario, setComentario] = useState<string>("");

    useEffect(() => {
        if (idInforme) {
            fetch(`http://localhost:8000/informesAC/${idInforme}`)
                .then(res => res.json())
                .then((data: { resumenSecciones: SeccionResumen[]; opinionSobreResumen?: string }) => {
                    setResumen(data.resumenSecciones || []);
                    setComentario(data.opinionSobreResumen || "");
                })
                .catch(error => console.error("Error fetching informe data:", error));
        } else if (idMateria) {
            fetch(`http://localhost:8000/informesAC/resumen/materia/${idMateria}`)
                .then(res => res.json())
                .then((data: SeccionResumen[]) => setResumen(data || []))
                .catch(error => console.error("Error fetching materia resumen data:", error));
        }
    }, [idInforme, idMateria]);

    const handleComentarioLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (disabled) return; 
        const nuevoComentario = e.target.value;
        setComentario(nuevoComentario);
        handleChange?.(resumen, nuevoComentario);
    };

    if (!resumen || resumen.length === 0) return <div style={styles.container}>Cargando resumen de encuestas...</div>;

    const seccionesFiltradas = resumen.filter(s =>
        ["B", "C", "D", "E-Teoria", "E-Practica"].includes(s.sigla)
    );

    const textAreaStyle = disabled ? styles.fieldReadOnly : styles.fieldEditable;

    return (
        <div style={styles.container}>

            {!disabled && (
                <p style={styles.instructionBlock}>
                    2.B. Consigne los valores que figuran en el reporte de la Encuesta a alumnos correspondientes a: B: “Comunicación y desarrollo de la asignatura”, C: “Metodología”, D “ Evaluación”, E “Actuación de los miembros de la Cátedra”. Emita un juicio de valor en el caso que lo considere oportuno.
                </p>
            )}

            <div style={styles.chartsGrid}>
                {seccionesFiltradas.map((seccion, index) => {
                    return (
                        <div key={seccion.id} style={styles.chartCard}>
                            <h3 style={styles.chartTitle}>
                                {seccion.sigla} - {seccion.nombre}
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart 
                                    data={Object.entries(seccion.porcentajes_opciones).map(([opcion, porcentaje]) => ({ opcion, porcentaje }))} 
                                    margin={{ top: 20, right: 10, left: 0, bottom: 50 }}
                                >
                                    <XAxis 
                                        dataKey="opcion" 
                                        interval={0} 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={60} 
                                        tick={{ fontSize: 11, fill: '#333' }} 
                                    />
                                    <YAxis 
                                        domain={[0, 100]} 
                                        tick={{ fontSize: 11, fill: '#333' }} 
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#e6f2ff' }}
                                        formatter={(value: any) => [`${value}%`, 'Porcentaje']} 
                                        labelFormatter={(label) => `Opción: ${label}`}
                                    />
                                    <Bar dataKey="porcentaje" fill="#2284e7ff" barSize={30}>
                                        <LabelList 
                                            dataKey="porcentaje" 
                                            position="top" 
                                            formatter={(value: any) => (typeof value === "number" ? `${Math.round(value)}%` : value)} 
                                            style={{ fill: '#003366', fontWeight: 600, fontSize: 12 }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>

            <div style={styles.commentSection}>
                <h3 style={styles.commentTitle}>
                    Observaciones sobre valores de la encuesta:
                </h3>
                {disabled && !comentario ? (
                    <p style={{...styles.fieldReadOnly, color: '#777'}}>Sin observaciones registradas.</p>
                ) : (
                    <textarea
                        style={textAreaStyle}
                        value={comentario}
                        onChange={handleComentarioLocalChange}
                        rows={4}
                        disabled={disabled} 
                        placeholder={!disabled ? "Escriba aquí su análisis o comentarios sobre los resultados..." : ""}
                    />
                )}
            </div>
        </div>
    );
};

export default ResumenSecciones;