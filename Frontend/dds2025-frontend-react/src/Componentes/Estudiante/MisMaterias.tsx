import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle } from "lucide-react";
import EstadisticasAlumno from "./EstadisticasAlumno"; 

type MateriaHistorial = {
    id: number;
    nombre: string;
    anio: number;
    codigo: string;
    encuesta_nombre?: string;
    encuesta_disponible: boolean;
    encuesta_procesada: boolean;
};

const MisMaterias: React.FC = () => {
    const [materias, setMaterias] = useState<MateriaHistorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const estudianteId = 1; 

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/historial`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo conectar con el servidor");
                return res.json();
            })
            .then(data => { setMaterias(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando tus materias...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline'}}/> {error}</div>;

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "30px", fontFamily: "'Segoe UI', sans-serif" }}>
            <h2 style={{ color: "#0056b3", borderBottom: "2px solid #eee", paddingBottom: "15px", marginBottom: "30px", display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={28} /> Mis Materias
            </h2>

            {materias.length === 0 && <div style={{ padding: 40, textAlign: 'center', background: '#f8f9fa' }}>No estás inscripto en materias.</div>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "25px" }}>
                {materias.map((materia) => (
                    <div key={materia.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: 'flex', flexDirection: 'column' }}>
                        
                        {/* Header Tarjeta */}
                        <div style={{ padding: "15px 20px", backgroundColor: "#f0f7ff", borderBottom: '1px solid #eee' }}>
                            <h3 style={{ margin: 0, fontSize: "18px", color: "#333" }}>{materia.nombre}</h3>
                            <div style={{ fontSize: "13px", color: "#666", marginTop: '5px' }}>Año: {materia.anio} • Cód: {materia.codigo}</div>
                        </div>

                        {/* Cuerpo Tarjeta */}
                        <div style={{ padding: "20px", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '0.9rem', textAlign: 'center' }}>Participación General</h4>
                                {/* El gráfico */}
                                <EstadisticasAlumno materiaId={materia.id} />
                            </div>
                            
                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600, color: '#555', fontSize: '0.85rem' }}>Estado:</span>
                                {materia.encuesta_procesada ? 
                                    <span style={{ background: '#d4edda', color: '#155724', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600 }}>Respondida</span> :
                                    (materia.encuesta_disponible ? 
                                        <span style={{ background: '#fff3cd', color: '#856404', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600 }}>Pendiente</span> :
                                        <span style={{ background: '#e9ecef', color: '#495057', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600 }}>No Disponible</span>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MisMaterias;