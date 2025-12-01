import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, ClipboardList, Calendar, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks';
// --- TIPOS DE DATOS ---
interface EncuestaResuelta {
    id: number;
    materia_nombre: string;
    encuesta_nombre: string;
    fecha_finalizacion?: string;
    ciclo_lectivo: number;
    cuatrimestre: string;
    materia_id: number;
}

const SinDatos: React.FC<{ mensaje: string; titulo: string }> = ({ mensaje, titulo }) => (
    <div style={{ textAlign: 'center', padding: '40px', color: '#555', border: '1px solid #e8f4ff', borderRadius: '12px', background: '#ffffff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        <ListChecks size={48} color="#cbd5e1" style={{ marginBottom: '15px' }} />
        <h2>{titulo}</h2>
        <p>{mensaje}</p>
    </div>
);

const ErrorCargaDatos: React.FC<{ mensaje: string }> = ({ mensaje }) => (
    <div style={{ textAlign: 'center', padding: '40px', color: '#B30000', backgroundColor: '#FFF0F0', border: '1px solid #B30000', borderRadius: '12px' }}>
        <h3>Error de Carga</h3>
        <p>{mensaje}</p>
    </div>
);


const HistorialEncuestasRealizadasEstudiante: React.FC = () => {
    const [historial, setHistorial] = useState<EncuestaResuelta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate('/home/alumno');
    };

    const { currentUser } = useAuth();
    const estudianteId = currentUser?.alumno_id;

    // --- LÓGICA ---
    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const obtenerHistorial = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://localhost:8000/encuestas/estudiantes/${estudianteId}/respuestas`,
                    { signal: controller.signal }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error("No se pudo obtener el historial de encuestas");
                }

                const data: EncuestaResuelta[] = await response.json();
                setHistorial(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error("Error al obtener historial:", err);
                if (err.name === "AbortError") {
                    setError("Tiempo de espera agotado. El servidor no respondió.");
                } else {
                    setError(err.message || "Error inesperado al cargar el historial.");
                }
            } finally {
                setLoading(false);
            }
        };

        obtenerHistorial();
        return () => clearTimeout(timeoutId);
    }, [estudianteId]);

    const handleCardClick = (materiaId: number) => {
        navigate(`/home/alumno/respuestas-encuesta/${materiaId}`);
    };



    if (loading) return <p style={{ color: "#003366", padding: "20px" }}>Cargando historial...</p>;
    if (error) return <ErrorCargaDatos mensaje={error} />;

    const historialCompleto = historial;

    return (
        <div className="historial-encuestas-container">
            <style>{`
                .historial-encuestas-container {
                    padding: 10px 0;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
                    padding: 20px; 
                }

                .header-historial {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .go-back-button {
                    background-color: #f0f4f8;
                    color: #0078D4;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease;
                }

                .go-back-button:hover {
                    background-color: #e8f4ff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .lista-encuestas {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .tarjeta-encuesta-historial {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #e8f4ff;
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                    cursor: pointer;
                }

                .tarjeta-encuesta-historial:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                    background-color: #f9fbfd;
                }

                .encuesta-info-historial {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-grow: 1;
                    overflow: hidden;
                }

                .icono-materia-historial {
                    color: #0078D4;
                    flex-shrink: 0;
                    background-color: #e8f4ff;
                    padding: 8px;
                    border-radius: 8px;
                }

                .materia-title-historial {
                    font-weight: 700;
                    color: #003366;
                    font-size: 1.05rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .encuesta-meta-historial {
                    display: flex;
                    align-items: center;
                    color: #6c757d;
                    font-size: 0.9rem;
                    gap: 10px;
                    flex-shrink: 0;
                    margin-left: 15px;
                }
                
                .encuesta-meta-historial span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .separador-historial {
                    width: 4px;
                    height: 4px;
                    background-color: #ced4da;
                    border-radius: 50%;
                }
                
                .arrow-icon-historial {
                    color: #ced4da;
                    transition: transform 0.2s ease;
                }

                .tarjeta-encuesta-historial:hover .arrow-icon-historial {
                    transform: translateX(4px);
                    color: #0078D4;
                }
                
                @media (max-width: 768px) {
                    .tarjeta-encuesta-historial {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .encuesta-info-historial {
                        width: 100%;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                        gap: 12px;
                    }

                    .materia-title-historial {
                        flex-grow: 1;
                        white-space: normal;
                    }
                    
                    .encuesta-meta-historial {
                        flex-direction: column;
                        align-items: flex-start;
                        width: 100%;
                        margin-left: 0;
                        gap: 4px;
                        padding-left: 48px;
                    }
                    
                    .separador-historial {
                        display: none;
                    }

                    .arrow-icon-historial {
                        position: absolute;
                        right: 20px;
                        top: 20px;
                    }

                    .header-historial {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                }
            `}</style>

            <div className="header-historial">
                <h2 style={{ color: '#1e40af', fontSize: '1.8rem', fontWeight: 750 }}>Historial de Encuestas</h2>
                <button 
                    className="go-back-button"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={20} />
                    Regresar al inicio
                </button>
            </div>

            {historialCompleto.length === 0 ? (
                <SinDatos
                    mensaje="No tienes encuestas registradas en tu historial."
                    titulo="Historial Vacío"
                />
            ) : (
                <ul className="lista-encuestas">
                    {historialCompleto.map((item) => (
                        <li 
                            key={item.id} 
                            className="tarjeta-encuesta-historial"
                            onClick={() => handleCardClick(item.materia_id)}
                        >
                            <div className="encuesta-info-historial">
                                <CheckCircle2 size={24} className="icono-materia-historial" />
                                <span className="materia-title-historial">{item.materia_nombre}</span>
                            </div>
                            
                            <div className="encuesta-meta-historial">
                                <span>
                                    <GraduationCap size={19} /> 
                                    {item.ciclo_lectivo} | {item.cuatrimestre}
                                </span>
                                
                                {item.fecha_finalizacion && (
                                    <>
                                        <div className="separador-historial"></div>
                                        <span>
                                            <Calendar size={17} /> {item.fecha_finalizacion}
                                        </span>
                                    </>
                                )}
                            </div>
                            <CheckCircle2 size={25} className="arrow-icon-historial" style={{ color: '#0e9725ff' }} /> 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistorialEncuestasRealizadasEstudiante;