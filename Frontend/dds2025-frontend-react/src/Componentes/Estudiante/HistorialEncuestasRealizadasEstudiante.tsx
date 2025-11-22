import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle, AlertCircle, BarChart2 } from "lucide-react";
import MisRespuestas from "./MisRespuestas";
import EstadisticasAlumno from "./EstadisticasAlumno";

type MateriaHistorial = {
    id: number;
    nombre: string;
    anio: number;
    codigo: string;
    encuesta_nombre?: string;
    encuesta_procesada: boolean;
};

const HistorialEncuestasRealizadasEstudiante: React.FC = () => {
    const [materias, setMaterias] = useState<MateriaHistorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<{ id: number, type: 'stats' | 'respuestas' } | null>(null);
    const estudianteId = 1; 

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/historial`)
            .then(res => res.json())
            .then(data => { 
                const respondidas = data.filter((m: any) => m.encuesta_procesada);
                setMaterias(respondidas); 
                setLoading(false); 
            })
            .catch(err => { setError("Error cargando historial"); setLoading(false); });
    }, []);

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setActiveView(null);
        } else {
            setExpandedId(id);
            setActiveView(null);
        }
    };

    const handleAction = (e: React.MouseEvent, id: number, type: 'stats' | 'respuestas') => {
        e.stopPropagation();
        setActiveView((prev) => (prev?.id === id && prev.type === type) ? null : { id, type });
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando historial...</div>;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px", fontFamily: "Segoe UI, sans-serif" }}>
            <h2 style={{ color: "#28a745", borderBottom: "2px solid #eee", paddingBottom: "15px", marginBottom: "20px", display:'flex', alignItems:'center', gap:'10px' }}>
                <CheckCircle size={28} /> Historial de Encuestas
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {materias.map((materia) => {
                    const isExpanded = expandedId === materia.id;
                    const showStats = activeView?.id === materia.id && activeView?.type === 'stats';
                    const showRespuestas = activeView?.id === materia.id && activeView?.type === 'respuestas';

                    return (
                        <div key={materia.id} style={{ border: "1px solid #e0e0e0", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                            <div onClick={() => toggleExpand(materia.id)} style={{ padding: "20px", backgroundColor: isExpanded ? "#f0f9f4" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>{materia.nombre}</h3>
                                    <span style={{ fontSize: "13px", color: "#888" }}>{materia.encuesta_nombre}</span>
                                </div>
                                {isExpanded ? <ChevronUp size={20} color="#28a745"/> : <ChevronDown size={20} color="#888"/>}
                            </div>

                            {isExpanded && (
                                <div style={{ padding: "20px", backgroundColor: "#fafafa" }}>
                                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                                        <button onClick={(e) => handleAction(e, materia.id, 'stats')} style={{ backgroundColor: showStats ? '#28a745' : 'white', color: showStats ? 'white' : '#28a745', border: '1px solid #28a745', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <BarChart2 size={16} /> Participación
                                        </button>
                                        <button onClick={(e) => handleAction(e, materia.id, 'respuestas')} style={{ backgroundColor: showRespuestas ? '#0056b3' : 'white', color: showRespuestas ? 'white' : '#0056b3', border: '1px solid #0056b3', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <FileText size={16} /> Mis Respuestas
                                        </button>
                                    </div>
                                    {showStats && <div style={{background:'white', borderRadius:8, padding:15, border:'1px solid #eee'}}><EstadisticasAlumno materiaId={materia.id} /></div>}
                                    {showRespuestas && <MisRespuestas materiaId={materia.id} />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default HistorialEncuestasRealizadasEstudiante;