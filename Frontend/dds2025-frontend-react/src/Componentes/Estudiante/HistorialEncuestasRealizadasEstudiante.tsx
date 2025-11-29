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

const HistorialEncuestasRealizadasEstudiante = () => {
    const [historial, setHistorial] = useState<EncuestaResuelta[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(4);
    const navigate = useNavigate();
    
    const { currentUser } = useAuth();
    const estudianteId = currentUser?.alumno_id;

    // --- PALETA INSTITUCIONAL ---
    const theme = {
        primary: '#1c4decff',       // Navy Blue
        primaryHover: '#1e3a8a',  // Darker Navy
        primarySoft: '#eff6ff',   // Very Light Blue (Backgrounds)
        textMain: '#29427aff',      // Dark Slate
        textSecondary: '#64748b', // Slate
        border: '#e2e8f0',
        white: '#ffffff',
        bgPage: '#f8fafc'         // Cool Gray Background
    };

    // --- LÓGICA ---
    useEffect(() => {
        fetch(`http://localhost:8000/encuestas/estudiantes/${estudianteId}/respuestas`)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar historial");
                return res.json();
            })
            .then(data => {
                setHistorial(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleCardClick = (materiaId: number) => {
        navigate(`/home/alumno/respuestas-encuesta/${materiaId}`);
    };

    const handleVerMas = () => {
        setVisibleCount(prev => prev + 4);
    };

    // --- CSS INYECTADO ---
    const cssInyectado = `
        .fade-in { animation: fadeIn 0.4s ease-out; }
        
        /* Hover de la fila */
        .historial-row {
            transition: background-color 0.2s ease, transform 0.2s ease;
            cursor: pointer;
            border-bottom: 1px solid ${theme.border};
        }
        .historial-row:last-child { border-bottom: none; }
        .historial-row:hover {
            background-color: ${theme.primarySoft};
        }
        .historial-row:hover .icon-box {
            background-color: ${theme.white};
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transform: scale(1.05);
        }
        .historial-row:hover .arrow-icon {
            transform: translateX(4px);
            color: ${theme.primary};
        }

        /* Nuevo estilo Botón Ver Más (Soft Button) */
        .btn-load-more {
            background-color: ${theme.primarySoft};
            color: ${theme.primary};
            font-weight: 600;
            border: 1px solid transparent;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-load-more:hover {
            background-color: ${theme.primary};
            color: ${theme.white};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
        }

        /* Botón Volver */
        .nav-back-link {
            transition: all 0.2s;
            color: ${theme.textSecondary};
        }
        .nav-back-link:hover {
            color: ${theme.primary};
            background-color: ${theme.primarySoft};
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    // --- ESTILOS EN LÍNEA ---
    const styles = {
        wrapper: {
            padding: '40px 20px',
            backgroundColor: theme.bgPage,
            minHeight: '100vh',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        // TARJETA PRINCIPAL BLANCA
        mainCard: {
            backgroundColor: theme.white,
            width: '100%',
            maxWidth: '1400px',
            borderRadius: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            overflow: 'hidden',
            border: `1px solid ${theme.border}`,
        },
        // CABECERA DE LA TARJETA
        cardHeader: {
            padding: '30px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '20px',
            backgroundColor: theme.white,
        },
        headerTop: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        backButton: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: 500,
        },
        titleRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        titleIcon: {
            backgroundColor: theme.primary,
            padding: '12px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.2)',
        },
        titleText: {
            fontSize: '1.75rem',
            fontWeight: 800,
            color: theme.textMain,
            margin: 0,
            letterSpacing: '-0.5px',
        },
        subtitle: {
            margin: '4px 0 0 0',
            color: theme.textSecondary,
            fontSize: '0.95rem',
        },
        // CONTENIDO LISTA
        listContainer: {
            display: 'flex',
            flexDirection: 'column' as const,
        },
        rowContent: {
            padding: '24px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        rowLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        },
        iconBox: {
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: theme.primarySoft,
            color: theme.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
        },
        textCol: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '5px',
        },
        materiaTitle: {
            fontSize: '1.05rem',
            fontWeight: 700,
            color: theme.textMain,
            margin: 0,
        },
        metaTags: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.85rem',
            color: theme.textSecondary,
        },
        tagItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
        },
        dot: {
            width: '4px',
            height: '4px',
            backgroundColor: '#cbd5e1',
            borderRadius: '50%',
        },
        arrow: {
            color: '#cbd5e1',
            transition: 'transform 0.2s',
        },
        // FOOTER ACCIONES
        footer: {
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#fbfcfd', // Ligeramente diferente al blanco
            borderTop: `1px solid ${theme.border}`,
        },
        btnVerMas: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            borderRadius: '50px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            border: 'none',
        },
        loadingBox: { padding: '60px', textAlign: 'center' as const, color: theme.textSecondary },
        emptyBox: { padding: '60px', textAlign: 'center' as const, color: theme.textSecondary }
    };

    const historialVisible = historial.slice(0, visibleCount);
    const hayMas = visibleCount < historial.length;

    return (
        <div style={styles.wrapper}>
            <style>{cssInyectado}</style>

            <div style={styles.mainCard} className="fade-in">
                
                {/* 1. HEADER INTEGRADO EN LA TARJETA */}
                <div style={styles.cardHeader}>

                    <div style={styles.titleRow}>
                        <div style={styles.titleIcon}>
                            <ClipboardList size={28} />
                        </div>
                        <div>
                            <h1 style={styles.titleText}>Historial de Encuestas</h1>
                            <p style={styles.subtitle}>Consulta tus respuestas anteriores</p>
                        </div>
                    </div>
                </div>

                {/* 2. LISTADO DE ENCUESTAS */}
                <div style={styles.listContainer}>
                    {loading ? (
                        <div style={styles.loadingBox}>Cargando información...</div>
                    ) : historial.length === 0 ? (
                        <div style={styles.emptyBox}>
                            <CheckCircle2 size={48} color="#cbd5e1" style={{marginBottom: 16}} />
                            <p>No tienes encuestas registradas.</p>
                        </div>
                    ) : (
                        <>
                            {historialVisible.map((item) => (
                                <div 
                                    key={item.id} 
                                    className="historial-row"
                                    onClick={() => handleCardClick(item.materia_id)}
                                >
                                    <div style={styles.rowContent}>
                                        <div style={styles.rowLeft}>
                                            <div className="icon-box" style={styles.iconBox}>
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div style={styles.textCol}>
                                                <h3 style={styles.materiaTitle}>{item.materia_nombre}</h3>
                                                <div style={styles.metaTags}>
                                                    <span style={styles.tagItem}>
                                                        <GraduationCap size={14} /> 
                                                        {item.ciclo_lectivo} • {item.cuatrimestre}
                                                    </span>
                                                    {item.fecha_finalizacion && (
                                                        <>
                                                            <div style={styles.dot}></div>
                                                            <span style={styles.tagItem}>
                                                                <Calendar size={14} /> {item.fecha_finalizacion}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} style={styles.arrow} className="arrow-icon" />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* 3. BOTÓN VER MÁS ESTILIZADO */}
                {hayMas && (
                    <div style={styles.footer}>
                        <button 
                            className="btn-load-more" 
                            style={styles.btnVerMas}
                            onClick={handleVerMas}
                        >
                            Ver más registros <ChevronDown size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialEncuestasRealizadasEstudiante;