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
                if (!res.ok) throw new Error("No se pudo conectar para ver las respuestas.");
                return res.json();
            })
            .then(d => { setData(d); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [materiaId]);

    if (loading) return <div style={{ padding: 30, textAlign: 'center', color: '#666' }}>Cargando formulario...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline', verticalAlign:'middle'}}/> {error}</div>;
    if (!data) return <div style={{ padding: 30, textAlign: 'center' }}>No hay datos.</div>;

    return (
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <h4 style={{ color: '#0056b3', margin: '0 0 5px 0', fontSize: '1.4rem' }}>{data.encuesta_nombre}</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', margin: 0 }}>Materia: <strong>{data.materia_nombre}</strong></p>
            </div>

            {data.secciones.map((seccion) => (
                <div key={seccion.id} style={{ marginBottom: '35px' }}>
                    {seccion.enunciado && (
                        <h5 style={{ backgroundColor: '#f1f3f5', padding: '10px 15px', borderRadius: '5px', marginBottom: '15px', color: '#333', fontSize: '1rem', borderLeft: '4px solid #0056b3', fontWeight: 'bold' }}>
                            {seccion.enunciado}
                        </h5>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingLeft: '5px' }}>
                        {seccion.preguntas.map((pregunta) => (
                            <div key={pregunta.id} style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fff' }}>
                                <p style={{ fontWeight: 600, marginBottom: '12px', color: '#222', fontSize: '0.95rem' }}>{pregunta.enunciado}</p>

                                {/* RENDERIZADO TIPO FORMULARIO */}
                                {(pregunta.opciones && pregunta.opciones.length > 0) ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {pregunta.opciones.map((opcion) => {
                                            const isSelected = opcion.id === pregunta.respuesta_seleccionada_id;
                                            return (
                                                <label key={opcion.id} style={{ 
                                                    display: 'flex', alignItems: 'center', gap: '10px', 
                                                    padding: '8px 12px', borderRadius: '6px', 
                                                    backgroundColor: isSelected ? '#e7f1ff' : 'transparent',
                                                    border: isSelected ? '1px solid #b3d7ff' : '1px solid transparent',
                                                    cursor: 'default'
                                                }}>
                                                    <input 
                                                        type="radio" 
                                                        checked={isSelected} 
                                                        readOnly 
                                                        style={{ accentColor: '#0056b3', transform: 'scale(1.1)', margin: 0 }} 
                                                    />
                                                    <span style={{ color: isSelected ? '#004085' : '#495057', fontWeight: isSelected ? 600 : 400, fontSize: '0.9rem' }}>
                                                        {opcion.descripcion}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '5px' }}>
                                        <textarea 
                                            readOnly
                                            value={pregunta.respuesta_texto || ''}
                                            style={{ 
                                                width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ced4da', 
                                                backgroundColor: '#f8f9fa', color: '#495057', resize: 'none', minHeight: '70px', 
                                                fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none'
                                            }}
                                            placeholder="Sin respuesta de texto."
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