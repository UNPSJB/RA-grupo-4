import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

type OpcionRespuesta = { id: number; descripcion: string; };
type PreguntaDetalle = { 
    id: number; 
    enunciado: string; 
    tipo_pregunta: string; 
    opciones: OpcionRespuesta[]; 
    respuesta_seleccionada_id: number | null; 
    respuesta_texto: string | null; 
};
type SeccionDetalle = { id: number; enunciado: string; preguntas: PreguntaDetalle[]; };
type HistorialDetalleData = { materia_nombre: string; encuesta_nombre: string; secciones: SeccionDetalle[]; };

const MisRespuestas: React.FC<{ materiaId: number }> = ({ materiaId }) => {
    const [data, setData] = useState<HistorialDetalleData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const estudianteId = 1; 

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/respuestas/materia/${materiaId}`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudieron cargar las respuestas.");
                return res.json();
            })
            .then(d => { setData(d); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [materiaId]);

    if (loading) return <div style={{ padding: 30, textAlign: 'center', color: '#666' }}>Cargando formulario...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline'}}/> {error}</div>;
    if (!data) return <div style={{ padding: 30 }}>No hay datos.</div>;

    return (
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: '20px' }}>
            <h4 style={{ color: '#0056b3', marginBottom: '25px', fontSize: '1.4rem', textAlign: 'center' }}>{data.encuesta_nombre}</h4>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '-15px', marginBottom: '30px' }}>Materia: {data.materia_nombre}</p>

            {data.secciones.map((seccion) => (
                <div key={seccion.id} style={{ marginBottom: '35px', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fdfdfd' }}>
                    {seccion.enunciado && (
                        <h5 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '1.1rem', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
                            {seccion.enunciado}
                        </h5>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {seccion.preguntas.map((pregunta) => (
                            <div key={pregunta.id} style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '5px', border: '1px solid #e0e0e0' }}>
                                <p style={{ fontWeight: 600, marginBottom: '12px', color: '#222' }}>{pregunta.enunciado}</p>

                                {/* --- RENDERIZADO TIPO FORMULARIO --- */}
                                {(pregunta.tipo_pregunta === 'CERRADA' || (pregunta.opciones && pregunta.opciones.length > 0)) ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {pregunta.opciones.map((opcion) => {
                                            const isSelected = opcion.id === pregunta.respuesta_seleccionada_id;
                                            return (
                                                <div 
                                                    key={opcion.id} 
                                                    style={{ 
                                                        display: 'flex', alignItems: 'center', padding: '10px 15px', borderRadius: '6px', 
                                                        backgroundColor: isSelected ? '#e3f2fd' : '#fff', 
                                                        border: isSelected ? '2px solid #1967d2' : '1px solid #ccc',
                                                        opacity: isSelected ? 1 : 0.7 
                                                    }}
                                                >
                                                    {/* Radio Button Simulado */}
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '50%', 
                                                        border: `2px solid ${isSelected ? '#1967d2' : '#757575'}`,
                                                        marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        backgroundColor: '#fff'
                                                    }}>
                                                        {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1967d2' }}></div>}
                                                    </div>
                                                    
                                                    <span style={{ color: isSelected ? '#0d47a1' : '#333', fontWeight: isSelected ? 'bold' : 'normal', fontSize: '1rem' }}>
                                                        {opcion.descripcion}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Área de Texto */
                                    <div>
                                        <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>Tu respuesta:</div>
                                        <textarea 
                                            readOnly
                                            value={pregunta.respuesta_texto || ''}
                                            style={{ 
                                                width: '100%', padding: '15px', borderRadius: '6px', border: '1px solid #ccc', 
                                                backgroundColor: '#fff', color: '#333', resize: 'none', minHeight: '100px',
                                                fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.5'
                                            }}
                                            placeholder="Sin respuesta"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MisRespuestas;