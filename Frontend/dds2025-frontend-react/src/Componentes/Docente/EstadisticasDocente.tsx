import React, { useState, useEffect, memo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    Cell
} from "recharts";

type OpcionRespuestaStat = {
    descripcion: string;
    cantidad: number;
    porcentaje: number;
};

type PreguntaStat = {
    pregunta_id: number;
    enunciado: string;
    opciones: OpcionRespuestaStat[];
    respuestas_abiertas: string[]; // El docente SI ve esto
};

type SeccionStat = {
    seccion_id: number;
    sigla: string;
    descripcion: string;
    preguntas: PreguntaStat[];
};

type MateriaEstadisticasData = {
    materia_id: number;
    nombre_materia: string;
    total_inscriptos: number;
    total_encuestas_procesadas: number;
    secciones: SeccionStat[];
};

/* --- GRÁFICO DOCENTE --- */
const DocenteGrafico: React.FC<{ opciones: OpcionRespuestaStat[] }> = memo(({ opciones }) => (
    <ResponsiveContainer width="100%" height={Math.max(50 * opciones.length, 150)}>
        <BarChart
            data={opciones}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
            barCategoryGap="20%"
        >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
                type="category"
                dataKey="descripcion"
                width={220}
                tick={{ fontSize: 12, fill: "#333", fontWeight: 500 }}
                style={{ whiteSpace: 'normal' }} 
            />
            <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Porcentaje']}
            />
            <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]} barSize={30}>
                {opciones.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.porcentaje > 50 ? "#2b5c8a" : "#6da5d6"} />
                ))}
                <LabelList
                    dataKey="porcentaje"
                    position="right"
                    formatter={(v: number) => `${v.toFixed(1)}%`}
                    style={{ fill: "#2b5c8a", fontWeight: "bold", fontSize: 12 }}
                />
            </Bar>
        </BarChart>
    </ResponsiveContainer>
));

/* --- COMPONENTE PRINCIPAL --- */
const EstadisticasDocente: React.FC<{ materiaId: number }> = ({ materiaId }) => {
    const [data, setData] = useState<MateriaEstadisticasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [seccionesAbiertas, setSeccionesAbiertas] = useState<number[]>([]);
    const [preguntasExpandidas, setPreguntasExpandidas] = useState<number[]>([]);

    useEffect(() => {
        if (!materiaId) return;
        setLoading(true);
        setError(null);

        fetch(`http://localhost:8000/encuestas/estadisticas/materia/${materiaId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error ${res.status}: No se pudo cargar la información.`);
                }
                return res.json();
            })
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
                if (jsonData.secciones && jsonData.secciones.length > 0) {
                    setSeccionesAbiertas([jsonData.secciones[0].seccion_id]);
                }
            })
            .catch((err) => {
                console.error("Error fetching docente stats:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [materiaId]);

    const toggleSeccion = (id: number) => {
        setSeccionesAbiertas((prev) => 
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const togglePregunta = (id: number) => {
        setPreguntasExpandidas((prev) => 
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Cargando reporte...</div>;
    if (error) return <div style={{ color: '#dc3545', padding: 20 }}>Error: {error}</div>;
    if (!data) return <div style={{ padding: 20 }}>No hay datos disponibles.</div>;

    return (
        <div style={{ fontFamily: '"Segoe UI", sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
            <header style={{ marginBottom: '30px', borderBottom: '2px solid #2b5c8a', paddingBottom: '15px' }}>
                <h1 style={{ color: '#2b5c8a', margin: '0 0 10px 0', fontSize: '28px' }}>
                    Reporte Docente: {data.nombre_materia}
                </h1>
                <div style={{ display: 'flex', gap: '15px', color: '#555', fontSize: '15px' }}>
                    <span style={{ backgroundColor: '#eef6fc', padding: '5px 12px', borderRadius: '20px' }}>
                        Total Inscriptos: <strong>{data.total_inscriptos}</strong>
                    </span>
                    <span style={{ backgroundColor: '#eef6fc', padding: '5px 12px', borderRadius: '20px' }}>
                        Encuestas: <strong>{data.total_encuestas_procesadas}</strong>
                    </span>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {data.secciones?.map((seccion) => {
                    const isOpen = seccionesAbiertas.includes(seccion.seccion_id);
                    return (
                        <div key={seccion.seccion_id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <button
                                onClick={() => toggleSeccion(seccion.seccion_id)}
                                style={{
                                    width: '100%', padding: '18px 25px', background: isOpen ? '#2b5c8a' : '#f8f9fa',
                                    color: isOpen ? '#fff' : '#333', border: 'none', cursor: 'pointer',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 'bold'
                                }}
                            >
                                <span>{seccion.sigla} - {seccion.descripcion}</span>
                                <span>{isOpen ? '−' : '+'}</span>
                            </button>

                            {isOpen && (
                                <div style={{ padding: '25px', backgroundColor: '#fff' }}>
                                    {seccion.preguntas.map((pregunta) => {
                                        const tieneComentarios = pregunta.respuestas_abiertas && pregunta.respuestas_abiertas.length > 0;
                                        const mostrandoComentarios = preguntasExpandidas.includes(pregunta.pregunta_id);

                                        return (
                                            <div key={pregunta.pregunta_id} style={{ marginBottom: '35px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                                <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>{pregunta.enunciado}</h3>
                                                
                                                {pregunta.opciones && pregunta.opciones.length > 0 && (
                                                    <div style={{ padding: '15px', background: '#fafafa', borderRadius: '8px' }}>
                                                        <DocenteGrafico opciones={pregunta.opciones} />
                                                    </div>
                                                )}

                                                {tieneComentarios && (
                                                    <div style={{ marginTop: '15px' }}>
                                                        <button
                                                            onClick={() => togglePregunta(pregunta.pregunta_id)}
                                                            style={{
                                                                background: 'transparent', border: '1px solid #2b5c8a', color: '#2b5c8a',
                                                                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 600
                                                            }}
                                                        >
                                                            {mostrandoComentarios ? 'Ocultar' : 'Ver'} Comentarios ({pregunta.respuestas_abiertas.length})
                                                        </button>
                                                        
                                                        {mostrandoComentarios && (
                                                            <div style={{ marginTop: '15px', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f9fbfd', border: '1px solid #e1e8ed', borderRadius: '6px', padding: '10px' }}>
                                                                {pregunta.respuestas_abiertas.map((resp, idx) => (
                                                                    <div key={idx} style={{ background: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '8px', fontSize: '14px', color: '#444', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                                        "{resp}"
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EstadisticasDocente;