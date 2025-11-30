import React, { useState, useEffect } from "react";
import { BookOpen, AlertCircle, Calendar, Hash, LayoutGrid, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import EstadisticasAlumno from "./EstadisticasAlumno";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

type MateriaHistorial = {
    id: number;
    nombre: string;
    ciclo_lectivo: number;
    cuatrimestre: string;
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
    const navigate = useNavigate();

    const theme = {
        primary: '#1e40af',   
        primaryHover: '#3658b6ff',
        primarySoft: '#eff6ff', 
        textMain: '#1e40af',     
        textSecondary: '#64748b', 
        border: '#e2e8f0',
        white: '#ffffff',
        bgPage: '#f8fafc',    
        successBg: '#dcfce7',    
        successText: '#166534',
        warningBg: '#fef3c7',   
        warningText: '#920e0eff',   
        neutralBg: '#f1f5f9',     
        neutralText: '#475569',
        botonRegresar:'#0078D4'
    };
    const handleGoBack = () => {
        navigate('/home/alumno');
    };

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/historial`)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo conectar con el servidor o la URL es incorrecta.");
                return res.json();
            })
            .then(data => { setMaterias(data); setLoading(false); })
            .catch(err => { 
                console.error("Error fetching materias:", err);
                setError(err.message || "Error inesperado al cargar las materias."); 
                setLoading(false);
            });
    }, [estudianteId]);
    const cssInyectado = `
        .fade-in { animation: fadeIn 0.5s ease-out; }
        
        .materia-card {
            background-color: ${theme.white};
            border: 1px solid ${theme.border};
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }

        .materia-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(30, 64, 175, 0.15);
            border-color: ${theme.primary}40;
        }

        .chart-container {
            background: #ffffff;
            border-radius: 8px;
            padding: 10px 0;
        }
        
        .go-back-button:hover {
                    background-color: #e8f4ff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
            .header-wrapper {
                flex-direction: column;
                align-items: flex-start !important;
            }
            .go-back-button {
                width: 100%;
                justify-content: center;
                margin-top: 10px;
            }
            .main-container {
                padding: 20px !important;
            }
            .header-title {
                font-size: 1.5rem !important;
            }
        }
    `;
    const styles = {
        pageWrapper: {
            padding: '40px 20px',
            backgroundColor: theme.bgPage,
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        mainContainer: {
            backgroundColor: theme.white,
            width: '100%',
            maxWidth: '1100px', 
            borderRadius: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
            padding: '30px',
        },
        headerWrapper: { 
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${theme.border}`,
        },
        headerTitleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 1,
        },
        headerIcon: {
            backgroundColor: theme.primary,
            color: theme.white,
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerTitle: {
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 750,
            color: theme.textMain,
            letterSpacing: '-0.5px',
        },
        headerDescription: {
            margin: 0,
            marginTop: '5px',
            fontSize: '0.9rem',
            color: theme.textSecondary,
            maxWidth: '600px',
        },
        goBackButton: {
            backgroundColor: theme.primarySoft,
            color: theme.botonRegresar,
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            flexShrink: 0,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
        },
        cardHeader: {
            padding: "16px 20px",
            backgroundColor: theme.primarySoft,
            borderBottom: `1px solid ${theme.border}`,
        },
        materiaName: {
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: 700,
            color: theme.primary,
            lineHeight: 1.4,
        },
        materiaMeta: {
            fontSize: "0.85rem",
            color: theme.textSecondary,
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap' as const,
        },
        metaItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        },
        cardBody: {
            padding: "20px",
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column' as const,
            justifyContent: 'space-between',
        },
        sectionTitle: {
            margin: '0 0 12px 0',
            color: theme.textSecondary,
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            textAlign: 'center' as const,
        },
        footer: {
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        statusLabel: {
            fontSize: '0.85rem',
            fontWeight: 600,
            color: theme.textSecondary,
        },
        badge: {
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        loadingState: { padding: '80px', textAlign: 'center' as const, color: theme.textSecondary },
    };

    const renderBadge = (materia: MateriaHistorial) => {
        if (materia.encuesta_procesada) {
            return (
                <span style={{ ...styles.badge, backgroundColor: theme.successBg, color: theme.successText }}>
                    <CheckCircle2 size={14} /> Respondida
                </span>
            );
        } else if (materia.encuesta_disponible) {
            return (
                <span style={{ ...styles.badge, backgroundColor: theme.warningBg, color: theme.warningText }}>
                    <Clock size={14} /> Pendiente
                </span>
            );
        } else {
            return (
                <span style={{ ...styles.badge, backgroundColor: theme.neutralBg, color: theme.neutralText }}>
                    <XCircle size={14} /> No Disponible
                </span>
            );
        }
    };

    if (loading) return (
        <div style={styles.pageWrapper}>
             <div style={styles.mainContainer} className="main-container">
                 <div style={styles.loadingState}>Cargando tus materias...</div>
             </div>
        </div>
    );

    if (error) return (
        <div style={styles.pageWrapper}>
             <div style={styles.mainContainer} className="main-container">
                 <ErrorCargaDatos mensaje={error} theme={theme} />
             </div>
        </div>
    );

    return (
        <div style={styles.pageWrapper}>
            <style>{cssInyectado}</style>

            <div style={styles.mainContainer} className="fade-in main-container">
                
                <div style={styles.headerWrapper} className="header-wrapper">
                    <div style={styles.headerTitleContainer}>
                        <div>
                            <h2 style={styles.headerTitle}>Resumen Academico</h2>
                            <p style={styles.headerDescription}>
                            Consulta el listado de tus materias, el estado de las encuestas docentes y el nivel de participación de tus compañeros en cada curso.
                            </p>

                        </div>
                    </div>
                    
                    <button 
                        style={styles.goBackButton} 
                        className="go-back-button"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={20} />
                        Regresar al incio
                    </button>
                </div>

                {materias.length === 0 ? (
                    <SinDatos
                        mensaje="No estás inscripto en materias actualmente."
                        titulo="Sin Materias Activas"
                    />
                ) : (
                    <div style={styles.grid}>
                        {materias.map((materia) => (
                            <div key={materia.id} className="materia-card">
                                
                                {/* Header de la Tarjeta */}
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.materiaName}>{materia.nombre}</h3>
                                    <div style={styles.materiaMeta}>
                                        <div style={styles.metaItem}>
                                            <Hash size={12} /> {materia.codigo}
                                        </div>
                                        <div style={styles.metaItem}>
                                            <Calendar size={12} /> {materia.ciclo_lectivo} ({materia.cuatrimestre})
                                        </div>
                                    </div>
                                </div>
                                {/*tarjeta */}
                                <div style={styles.cardBody}>
                                    <div>
                                        <h4 style={styles.sectionTitle}>Participación General</h4>
                                        <div className="chart-container">
                                            <EstadisticasAlumno materiaId={materia.id} />
                                        </div>
                                    </div>
                                    
                                    <div style={styles.footer}>
                                        <span style={styles.statusLabel}>Estado Encuesta:</span>
                                        {renderBadge(materia)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisMaterias;