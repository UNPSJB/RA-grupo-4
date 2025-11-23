import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    
    const [indiceSeccionActual, setIndiceSeccionActual] = useState(0);

    const estudianteId = 1; 
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/respuestas/materia/${materiaId}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar respuestas.");
                return res.json();
            })
            .then(d => { 
                setData(d); 
                setLoading(false); 
                setIndiceSeccionActual(0); 
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [materiaId]);

    // Navegación entre secciones
    const irSiguiente = () => {
        if (data && indiceSeccionActual < data.secciones.length - 1) {
            setIndiceSeccionActual(prev => prev + 1);
            window.scrollTo(0, 0); 
        }
    };

    const irAnterior = () => {
        if (indiceSeccionActual > 0) {
            setIndiceSeccionActual(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    const finalizarRevision = () => {
        navigate('/home/alumno/historial-encuestas');
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Cargando encuesta...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline'}}/> {error}</div>;
    if (!data || data.secciones.length === 0) return <div style={{ padding: 40, textAlign: 'center' }}>No hay datos disponibles.</div>;

    const seccionActual = data.secciones[indiceSeccionActual];
    const totalSecciones = data.secciones.length;
    const progreso = ((indiceSeccionActual + 1) / totalSecciones) * 100;
    
    // Título de la sección
    const tituloSeccion = seccionActual.enunciado || `Sección ${indiceSeccionActual + 1}`;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            
            {/* HEADER DE LA ENCUESTA */}
            <div style={{ padding: '30px 30px 10px 30px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                <h2 style={{ color: '#0056b3', margin: '0 0 10px 0', fontSize: '1.6rem' }}>{data.encuesta_nombre}</h2>
                <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>Materia: <strong>{data.materia_nombre}</strong></p>
            </div>

            {/* BARRA DE PROGRESO */}
            <div style={{ padding: '20px 30px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                    <span>Sección {indiceSeccionActual + 1} de {totalSecciones}</span>
                    <span>{Math.round(progreso)}% Completado</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progreso}%`, height: '100%', backgroundColor: '#0056b3', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>

            {/* CONTENIDO DE LA SECCIÓN */}
            <div style={{ padding: '30px' }}>
                
                {/* Título de la Sección Actual */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '30px', 
                    padding: '15px', 
                    backgroundColor: '#f0f7ff', 
                    borderLeft: '5px solid #0056b3',
                    borderRadius: '0 4px 4px 0'
                }}>
                    <h3 style={{ margin: 0, color: '#003366', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {tituloSeccion}
                    </h3>
                </div>

                {/* Lista de Preguntas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {seccionActual.preguntas.map((pregunta, index) => (
                        <div key={pregunta.id} style={{ 
                            padding: '20px', 
                            border: '1px solid #e0e0e0', 
                            borderRadius: '8px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)' 
                        }}>
                            <p style={{ fontWeight: 600, marginBottom: '15px', color: '#333', fontSize: '1rem' }}>
                                {index + 1}. {pregunta.enunciado}
                            </p>

                            {/* RENDERIZADO DE OPCIONES  */}
                            {(pregunta.opciones && pregunta.opciones.length > 0) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {pregunta.opciones.map((opcion) => {
                                        const isSelected = opcion.id === pregunta.respuesta_seleccionada_id;
                                        return (
                                            <label key={opcion.id} style={{ 
                                                display: 'flex', alignItems: 'center', gap: '12px', 
                                                padding: '10px 15px', borderRadius: '6px', 
                                                backgroundColor: isSelected ? '#e8f0fe' : '#fff',
                                                border: isSelected ? '1px solid #1967d2' : '1px solid #ddd',
                                                cursor: 'default', 
                                                transition: 'background-color 0.2s'
                                            }}>
                                                <div style={{
                                                    width: '18px', height: '18px', borderRadius: '50%', 
                                                    border: `2px solid ${isSelected ? '#1967d2' : '#757575'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                    backgroundColor: '#fff'
                                                }}>
                                                    {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1967d2' }}></div>}
                                                </div>
                                                <span style={{ color: isSelected ? '#155724' : '#495057', fontWeight: isSelected ? 600 : 400 }}>
                                                    {opcion.descripcion}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                /* RENDERIZADO DE TEXTO (Si fue pregunta abierta) */
                                <div style={{ marginTop: '5px' }}>
                                    <textarea 
                                        readOnly
                                        value={pregunta.respuesta_texto || ''}
                                        style={{ 
                                            width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', 
                                            backgroundColor: '#f8f9fa', color: '#333', resize: 'none', minHeight: '80px',
                                            fontSize: '0.95rem', fontFamily: 'inherit'
                                        }}
                                        placeholder="No se registró respuesta de texto."
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER DE NAVEGACIÓN */}
            <div style={{ 
                padding: '20px 30px', 
                backgroundColor: '#fff', 
                borderTop: '1px solid #eee', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                bottom: 0,
                zIndex: 10
            }}>
                <button 
                    onClick={irAnterior}
                    disabled={indiceSeccionActual === 0}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc',
                        backgroundColor: indiceSeccionActual === 0 ? '#f1f1f1' : '#fff',
                        color: indiceSeccionActual === 0 ? '#999' : '#333',
                        cursor: indiceSeccionActual === 0 ? 'not-allowed' : 'pointer',
                        fontWeight: 600
                    }}
                >
                    <ChevronLeft size={18} /> Anterior
                </button>

                {indiceSeccionActual < totalSecciones - 1 ? (
                    <button 
                        onClick={irSiguiente}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '10px 25px', borderRadius: '4px', border: 'none',
                            backgroundColor: '#0056b3', color: '#fff',
                            cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        Siguiente <ChevronRight size={18} />
                    </button>
                ) : (
                    <button 
                        onClick={finalizarRevision}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '10px 25px', borderRadius: '4px', border: 'none',
                            backgroundColor: '#28a745', color: '#fff',
                            cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        Finalizar Revisión
                    </button>
                )}
            </div>
        </div>
    );
};

export default MisRespuestas;