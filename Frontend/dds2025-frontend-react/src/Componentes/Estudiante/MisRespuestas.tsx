import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

const ETIQUETAS_FIJAS = [
    "A",   
    "B",  
    "C",   
    "D",  
    "E-T", 
    "E-P",  
    "G"     
];


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

    const seleccionarSeccion = useCallback((index: number) => {
        setIndiceSeccionActual(index);
        window.scrollTo(0, 0);
    }, []);

    const irSiguiente = useCallback(() => {
        if (data && indiceSeccionActual < data.secciones.length - 1) {
            seleccionarSeccion(indiceSeccionActual + 1);
        }
    }, [data, indiceSeccionActual, seleccionarSeccion]);

    const irAnterior = useCallback(() => {
        if (indiceSeccionActual > 0) {
            seleccionarSeccion(indiceSeccionActual - 1);
        }
    }, [indiceSeccionActual, seleccionarSeccion]);
    
    const estilos = {
        contenedorPrincipal: {
            maxWidth: '100%', 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            overflow: 'hidden',
        },
        header: {
            padding: '20px 30px 10px 30px', 
            textAlign: 'center', 
            borderBottom: '1px solid #eee', 
            backgroundColor: '#fff',
        },
        tituloEncuesta: { 
            color: '#0056b3', 
            margin: '0 0 5px 0', 
            fontSize: '1.6rem',
            fontWeight: '700'
        },
        subtituloMateria: { 
            color: '#666', 
            fontSize: '1rem', 
            margin: 0,
            fontWeight: 600,
        },
        tabsBar: {
            display: 'flex',
            justifyContent: 'center' as 'center',
            flexWrap: 'wrap' as 'wrap',
            borderBottom: '2px solid #ddd',
            padding: '10px 30px 0',
        },
        tab: {
            padding: '8px 15px', 
            margin: '0 5px 10px',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
            color: '#666',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
        },
        tabActivo: {
            backgroundColor: '#0056b3',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0, 86, 179, 0.3)',
        },
        preguntaBox: {
            padding: '20px', 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            backgroundColor: '#fafafa',
            marginBottom: '20px',
        },
        enunciadoPregunta: { 
            fontWeight: 700, 
            marginBottom: '15px', 
            color: '#333', 
            fontSize: '1rem',
            lineHeight: 1.5 
        },
        opcionSeleccionada: { 
            backgroundColor: '#e6ffed', 
            border: '1px solid #b7e3c9', 
            color: '#155724', 
            fontWeight: 600,
        },
        opcionNoSeleccionada: { 
            backgroundColor: '#fff', 
            border: '1px solid #eee', 
            color: '#495057',
        },
        respuestaTexto: {
            width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', 
            backgroundColor: '#fff', color: '#333', resize: 'none', minHeight: '80px',
            fontSize: '0.95rem', fontFamily: 'inherit', readOnly: true 
        },
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Cargando historial de respuestas...</div>;
    if (error) return <div style={{ padding: 20, color: '#dc3545', textAlign: 'center' }}><AlertCircle style={{display:'inline'}}/> {error}</div>;
    if (!data || data.secciones.length === 0) return <div style={{ padding: 40, textAlign: 'center' }}>No hay respuestas registradas para esta materia.</div>;

    const totalSecciones = data.secciones.length;
    const seccionActual = data.secciones[indiceSeccionActual];

    return (
        <div style={estilos.contenedorPrincipal}>
            
            <div style={estilos.header}>
                <h2 style={estilos.tituloEncuesta}>{data.encuesta_nombre}</h2>
                <p style={estilos.subtituloMateria}>Materia: {data.materia_nombre}</p> 
            </div>

            {/* Barra Tabs*/}
            <div style={estilos.tabsBar}>
                {data.secciones.map((seccion, index) => (
                    <div 
                        key={seccion.id} 
                        style={{ ...estilos.tab, ...(indiceSeccionActual === index ? estilos.tabActivo : {}) }}
                        onClick={() => seleccionarSeccion(index)}
                        title={seccion.enunciado || `Sección ${index + 1}`} 
                    >
                    
                        {ETIQUETAS_FIJAS[index] || (index + 1)} 
                    </div>
                ))}
            </div>

            <div style={{ padding: '30px' }}>
                
                <h4 style={{ 
                    marginTop: 0, 
                    color: '#0056b3', 
                    borderBottom: '1px dotted #ccc', 
                    paddingBottom: '10px', 
                    marginBottom: '25px' 
                }}>
                    {indiceSeccionActual + 1}. {seccionActual.enunciado || `Sección ${indiceSeccionActual + 1}`}
                </h4>

                {/* Lista de Preguntas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {seccionActual.preguntas.map((pregunta, index) => (
                        <div key={pregunta.id} style={estilos.preguntaBox}>
                            <p style={estilos.enunciadoPregunta}>
                                {index + 1}. {pregunta.enunciado}
                            </p>

                            {(pregunta.opciones && pregunta.opciones.length > 0) ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {pregunta.opciones.map((opcion) => {
                                        const isSelected = opcion.id === pregunta.respuesta_seleccionada_id;
                                        
                                        const opcionStyle = {
                                            display: 'flex', alignItems: 'center', gap: '12px', 
                                            padding: '12px 18px', borderRadius: '8px', 
                                            cursor: 'default', 
                                            ...estilos.opcionNoSeleccionada,
                                            ...(isSelected ? estilos.opcionSeleccionada : {}),
                                        };
                                        
                                        return (
                                            <div key={opcion.id} style={opcionStyle}>
                                                <div style={{
                                                    width: '18px', height: '18px', borderRadius: '50%', 
                                                    border: `2px solid ${isSelected ? '#155724' : '#757575'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                    backgroundColor: isSelected ? estilos.opcionSeleccionada.backgroundColor : 'transparent',
                                                }}>
                                                    {isSelected && <CheckCircle size={14} color="#155724" fill={estilos.opcionSeleccionada.backgroundColor} />} 
                                                </div>
                                                <span style={{ marginLeft: '4px', color: isSelected ? '#155724' : '#495057', fontWeight: isSelected ? 700 : 400 }}>
                                                    {opcion.descripcion}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ marginTop: '5px' }}>
                                    <textarea 
                                        readOnly
                                        value={pregunta.respuesta_texto || ''}
                                        style={estilos.respuestaTexto}
                                        placeholder="No se registró respuesta de texto."
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingBottom: '20px' }}>
                    
                    <button 
                        onClick={irAnterior}
                        disabled={indiceSeccionActual === 0}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '10px 20px', borderRadius: '6px', border: '1px solid #ccc',
                            backgroundColor: indiceSeccionActual === 0 ? '#f1f1f1' : '#fff',
                            color: indiceSeccionActual === 0 ? '#999' : '#333',
                            cursor: indiceSeccionActual === 0 ? 'not-allowed' : 'pointer',
                            fontWeight: 600, transition: 'background-color 0.2s'
                        }}
                    >
                        <ChevronLeft size={18} /> Anterior
                    </button>
                    {indiceSeccionActual < totalSecciones - 1 && (
                        <button 
                            onClick={irSiguiente}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '10px 25px', borderRadius: '6px', border: 'none',
                                backgroundColor: '#0056b3', color: '#fff',
                                cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'background-color 0.2s'
                            }}
                        >
                            Siguiente Sección <ChevronRight size={18} />
                        </button>
                    )}
                    {indiceSeccionActual === totalSecciones - 1 && (
                        <button 
                            onClick={() => navigate('/home/alumno/historial-encuestas')}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '10px 25px', borderRadius: '6px', border: 'none',
                                backgroundColor: '#28a745', color: '#fff',
                                cursor: 'pointer', fontWeight: 600, fontSize: '1rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'background-color 0.2s'
                            }}
                        >
                            Finalizar Revisión
                        </button>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default MisRespuestas;