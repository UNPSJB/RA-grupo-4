import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, CheckCircle, AlertCircle } from "lucide-react";
import MisRespuestas from "./MisRespuestas";

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

    const [showRespuestas, setShowRespuestas] = useState<boolean>(false);

    const estudianteId = 1; 

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/historial`)
            .then(res => {
                if (!res.ok) throw new Error("Error al conectar con el servidor.");
                return res.json();
            })
            .then(data => { 
                // Filtramos solo las materias donde YA se respondió la encuesta
                const respondidas = data.filter((m: any) => m.encuesta_procesada);
                setMaterias(respondidas); 
                setLoading(false); 
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setShowRespuestas(false);
        } else {
            setExpandedId(id);
            setShowRespuestas(false); 
        }
    };

    const toggleRespuestas = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowRespuestas(!showRespuestas);
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Cargando historial...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline'}}/> {error}</div>;

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px", fontFamily: "Segoe UI, sans-serif" }}>
            <h2 style={{ color: "#28a745", borderBottom: "2px solid #eee", paddingBottom: "15px", marginBottom: "20px", display:'flex', alignItems:'center', gap:'10px' }}>
                <CheckCircle size={28} /> Historial de Encuestas
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {materias.length === 0 && (
                    <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: 10, color: '#666' }}>
                        No tienes encuestas completadas en el historial.
                    </div>
                )}

                {materias.map((materia) => {
                    const isExpanded = expandedId === materia.id;

                    return (
                        <div key={materia.id} style={{ border: "1px solid #e0e0e0", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                            
                            {/* Cabecera Clickable */}
                            <div 
                                onClick={() => toggleExpand(materia.id)}
                                style={{ padding: "20px", backgroundColor: isExpanded ? "#f0f9f4" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: isExpanded ? '1px solid #eee' : 'none' }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                    <div style={{ backgroundColor: '#d4edda', padding: 8, borderRadius: '50%', color: '#155724' }}>
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>{materia.nombre}</h3>
                                        <span style={{ fontSize: "13px", color: "#888" }}>
                                            {materia.encuesta_nombre || "Encuesta Finalizada"}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Completada</span>
                                    {isExpanded ? <ChevronUp size={20} color="#28a745"/> : <ChevronDown size={20} color="#888"/>}
                                </div>
                            </div>

                            {/* Contenido Desplegado */}
                            {isExpanded && (
                                <div style={{ padding: "20px", backgroundColor: "#fafafa" }}>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                        <button 
                                            onClick={toggleRespuestas}
                                            style={{ 
                                                backgroundColor: showRespuestas ? '#0056b3' : 'white', 
                                                color: showRespuestas ? 'white' : '#0056b3', 
                                                border: '1px solid #0056b3', 
                                                padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' 
                                            }}
                                        >
                                            <FileText size={16} />
                                            {showRespuestas ? 'Ocultar Mis Respuestas' : 'Ver Qué Respondí'}
                                        </button>
                                    </div>

                                    {showRespuestas && (
                                        <div style={{ animation: "fadeIn 0.3s ease" }}>
                                            <MisRespuestas materiaId={materia.id} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default HistorialEncuestasRealizadasEstudiante;