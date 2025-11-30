import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, BookOpen, ArrowRight, TrendingUp, Users, CheckCircle, ArrowLeft } from 'lucide-react';

const API_BASE = "http://localhost:8000";
const ID_DOCENTE_ACTUAL = 1;
const ID_PERIODO_ACTUAL = 2; 

const COLOR_PRINCIPAL = "#17a2b8"; 
const COLOR_OSCURO = "#2a7374"; 
const COLOR_TEXTO_GRIS = "#343a40"; 
const COLOR_FONDO_CARD = "#ffffff";
const COLOR_TEXTO_TITULO = "#003366";
const COLOR_LINK_HOVER = "#125661";

interface Materia {
    id_materia: number;
    nombre: string;
    codigoMateria?: string;
    id_docente: number;
    id_periodo: number;
    inscriptos?: number; 
    procesadas?: number;
}

interface StatsSimulados {
    inscriptos: number;
    procesadas: number;
}

const PaginaEstadisticasDoc: React.FC = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const handleGoBack = () => {
        navigate('/home/docente');
    };
    
    useEffect(() => {
        const cargarMaterias = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/materias/listar`);
                
                if (!res.ok) throw new Error("Error al cargar las materias.");
                
                const data: Materia[] = await res.json();
                
                const misMaterias = data.filter(m => 
                    m.id_docente === ID_DOCENTE_ACTUAL && 
                    m.id_periodo === ID_PERIODO_ACTUAL
                );

                setMaterias(misMaterias);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        cargarMaterias();
    }, []);

    const getDatosSimulados = (materia: Materia): StatsSimulados => ({
        inscriptos: materia.inscriptos || Math.floor(Math.random() * 50) + 20,
        procesadas: materia.procesadas || Math.floor(Math.random() * 20) + 10,
    });

    if (loading) return (
        <div className="loading-message">
            Cargando listado de materias...
        </div>
    );
    
    if (error) return (
        <div className="dashboard-main-view">
            <style>{`
                .dashboard-main-view { max-width: 1200px; margin: 0 auto; padding: 30px 20px; font-family: 'Inter', sans-serif; }
                .error-message-full { padding: 40px; text-align: center; color: #dc3545; background-color: #fde8e8; border-radius: 12px; margin-top: 50px; font-size: 1.2rem; }
            `}</style>
            <div className="error-message-full">
                Error al cargar datos: {error}
            </div>
        </div>
    );


    return (
        <div className="dashboard-main-view">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .dashboard-main-view {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 30px 20px;
                    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
                    animation: fadeIn 0.5s ease;
                }
                
                .loading-message {
                    padding: 40px; 
                    text-align: center; 
                    color: #666;
                }

                .error-message {
                    padding: 20px; 
                    color: #dc3545; 
                    background-color: #fde8e8; 
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .no-data-message {
                    padding: 40px; 
                    text-align: center; 
                    color: #6c757d; 
                    font-style: italic;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .dashboard-header-container {
                    margin-bottom: 30px;
                }
                
                .welcome-title {
                    display: flex; 
                    align-items: center; 
                    gap: 12px;
                    color: ${COLOR_TEXTO_TITULO};
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .welcome-title svg {
                    color: ${COLOR_PRINCIPAL};
                }

                .panel-subtitle {
                    color: ${COLOR_TEXTO_GRIS};
                    font-size: 1rem;
                    max-width: 800px;
                }

                .seccion-box {
                    background-color: #f8f9fa;
                    padding: 25px;
                    border-radius: 12px;
                    position: relative;
                }

                .seccion-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: ${COLOR_TEXTO_TITULO};
                    font-size: 1.3rem;
                    font-weight: 650;
                    border-bottom: 2px solid ${COLOR_PRINCIPAL};
                    padding-bottom: 10px;
                    margin-top: 0;
                    margin-bottom: 20px;
                }

                .seccion-title svg {
                    color: ${COLOR_PRINCIPAL};
                }

                .materias-grid {
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
                    gap: 20px; 
                }

                .materia-card {
                    background-color: ${COLOR_FONDO_CARD};
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e8f4ff;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative; 
                    overflow: hidden; 
                }

                .materia-card::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 8px; 
                    border-top-left-radius: 12px;
                    border-bottom-left-radius: 12px;
                }

                .materia-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                }

                .materia-title { 
                    color: ${COLOR_TEXTO_TITULO}; 
                    font-size: 18px; 
                    font-weight: 700; 
                    margin-bottom: 4px;
                }

                .materia-code {
                    color: ${COLOR_TEXTO_GRIS};
                    font-size: 14px; 
                    margin-bottom: 20px;
                }

                .stats-container {
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    display: flex; 
                    align-items: center; 
                    gap: 6px; 
                    color: ${COLOR_TEXTO_GRIS};
                    font-size: 14px;
                    margin-top: 5px;
                }
                
                .stat-item strong {
                    font-weight: 600;
                    color: ${COLOR_TEXTO_TITULO};
                }

                .stat-item-green {
                    color: #28a745; 
                }
                
                .stat-item-green svg {
                    color: #28a745; 
                }
                
                .stat-item-default svg {
                    color: ${COLOR_TEXTO_TITULO}; 
                }

                .progress-bar-bg {
                    width: 100%; 
                    background-color: #f3f4f6; 
                    border-radius: 9999px; 
                    height: 8px; 
                    margin-bottom: 8px;
                }

                .progress-bar-fill { 
                    background-color: ${COLOR_PRINCIPAL}; 
                    height: 100%; 
                    border-radius: 9999px; 
                    transition: width 0.5s ease;
                }

                .progress-text { 
                    text-align: right; 
                    font-size: 12px; 
                    color: ${COLOR_TEXTO_GRIS}; 
                    margin-bottom: 24px;
                }

                .stats-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 12px;
                    background-color: ${COLOR_PRINCIPAL}; 
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 14px;
                    transition: background-color 0.2s;
                }

                .stats-link:hover {
                    background-color: ${COLOR_LINK_HOVER};
                    color: white;
                }

                @media (max-width: 640px) {
                    .dashboard-main-view {
                        padding: 20px 10px;
                    }

                    .welcome-title {
                        font-size: 1.5rem;
                    }
                    
                    .welcome-title svg {
                        width: 28px;
                        height: 28px;
                    }

                    .seccion-title {
                        font-size: 1.2rem;
                    }
                    
                    .materias-grid {
                        grid-template-columns: 1fr; 
                    }
                }

                .go-back-button {
                    position: absolute;
                    top: 25px; 
                    right: 25px;
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
            `}</style>
            
            <div className="dashboard-header-container">
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <TrendingUp size={36} />
                        Estadísticas de Cátedra
                    </h1>
                    <p className="panel-subtitle">
                        Selecciona una materia para visualizar el análisis detallado de las encuestas estudiantiles.
                    </p>
                </div>
            </div>

            <div className="seccion-box">
                    <button 
                        className="go-back-button"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={20} />
                        Regresar al incio
                    </button>
                <h2 className="seccion-title">
                    <BookOpen size={24} />
                    Materias Disponibles
                </h2>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading && !error && materias.length === 0 && (
                    <div className="no-data-message">
                        No tienes materias asignadas para este periodo.
                    </div>
                )}

                <div className="materias-grid">
                    {materias.map((materia) => {
                        const stats = getDatosSimulados(materia);
                        const porcentaje = stats.inscriptos > 0 
                            ? Math.round((stats.procesadas / stats.inscriptos) * 100) 
                            : 0;

                        return (
                            <div 
                                key={materia.id_materia} 
                                className="materia-card"
                            >
                                <div>
                                    <h3 className="materia-title">
                                        {materia.nombre}
                                    </h3>
                                    <p className="materia-code">
                                        Código: {materia.codigoMateria || 'N/A'}
                                    </p>

                                    <div className="stats-container">
                                        <div className="stat-item stat-item-default">
                                            <Users size={18} />
                                            <span>Inscriptos: <strong>{stats.inscriptos}</strong></span>
                                        </div>
                                        <div className="stat-item stat-item-green">
                                            <CheckCircle size={18} />
                                            <span>Procesadas: <strong>{stats.procesadas}</strong></span>
                                        </div>
                                    </div>
                                    
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: `${porcentaje}%` }}></div>
                                    </div>
                                    <p className="progress-text">
                                        {porcentaje}% de participación
                                    </p>
                                </div>

                                <Link 
                                    to={`materia/${materia.id_materia}`}
                                    className="stats-link"
                                >
                                    <BarChart2 size={18} />
                                    Ver Estadísticas
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaginaEstadisticasDoc;