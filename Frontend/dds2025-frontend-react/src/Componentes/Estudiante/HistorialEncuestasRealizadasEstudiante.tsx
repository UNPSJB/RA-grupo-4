import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, ClipboardList, Calendar } from 'lucide-react';

// --- TIPOS DE DATOS ---
interface EncuestaResuelta {
    id: number;
    materia_nombre: string;
    encuesta_nombre: string;
    fecha_finalizacion?: string;
    materia_id: number; 
}

const HistorialEncuestasRealizadasEstudiante = () => {
    const [historial, setHistorial] = useState<EncuestaResuelta[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const estudianteId = 1;

    // --- LÓGICA DE DATOS ---
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

    const cssInyectado = `
        .historial-container {
            animation: fadeIn 0.5s ease-out;
        }
        .encuesta-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-left: 5px solid #10b981; /* Verde Esmeralda */
        }
        .encuesta-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
            border-color: #059669;
        }
        .encuesta-card:hover .icon-wrapper {
            background-color: #d1fae5;
            transform: scale(1.1);
        }
        .encuesta-card:hover .chevron-icon {
            transform: translateX(5px);
            color: #059669;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    const styles = {
        pageContainer: {
            padding: '40px 20px',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#1f2937',
        },
        header: {
            marginBottom: '30px',
        },
        backLink: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#6b7280',
            fontWeight: 600,
            marginBottom: '20px',
            fontSize: '0.95rem',
            transition: 'color 0.2s',
        },
        titleContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
        },
        title: {
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
        },
        grid: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '16px',
        },
        card: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            cursor: 'pointer',
            position: 'relative' as const,
            overflow: 'hidden',
        },
        cardLeft: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        },
        iconWrapper: {
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.3s ease',
        },
        textContainer: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '4px',
        },
        materiaTitle: {
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1f2937',
            margin: 0,
        },
        subTitle: {
            fontSize: '0.9rem',
            color: '#6b7280',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        },
        chevron: {
            color: '#9ca3af',
            transition: 'transform 0.3s ease, color 0.3s ease',
        },
        loadingContainer: {
            textAlign: 'center' as const,
            padding: '60px',
            color: '#6b7280',
        },
        emptyState: {
            textAlign: 'center' as const,
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }
    };

    return (
        <div style={styles.pageContainer} className="historial-container">
            <style>{cssInyectado}</style>

            {/* HEADER */}
            <div style={styles.header}>
                <NavLink to="/home" style={styles.backLink}>
                    <ArrowLeft size={18} /> Regresar al Inicio
                </NavLink>
                
                <div style={styles.titleContainer}>
                    <ClipboardList size={32} color="#10b981" />
                    <h1 style={styles.title}>Historial de Encuestas</h1>
                </div>
            </div>

            {/* CONTENIDO */}
            {loading ? (
                <div style={styles.loadingContainer}>Cargando tus encuestas...</div>
            ) : historial.length === 0 ? (
                <div style={styles.emptyState}>
                    <CheckCircle2 size={48} color="#d1d5db" style={{ marginBottom: 10 }} />
                    <p>No has completado ninguna encuesta todavía.</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {historial.map((item) => (
                        <div 
                            key={item.id} 
                            className="encuesta-card" 
                            style={styles.card}
                            onClick={() => handleCardClick(item.materia_id)}
                        >
                            <div style={styles.cardLeft}>
                                <div className="icon-wrapper" style={styles.iconWrapper}>
                                    <CheckCircle2 size={24} color="#10b981" />
                                </div>
                                <div style={styles.textContainer}>
                                    <h3 style={styles.materiaTitle}>{item.materia_nombre}</h3>
                                    <p style={styles.subTitle}>
                                        {item.encuesta_nombre}
                                        {item.fecha_finalizacion && (
                                            <>
                                                <span style={{margin: '0 4px'}}>•</span>
                                                <Calendar size={12} /> {item.fecha_finalizacion}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <ChevronRight size={20} style={styles.chevron} className="chevron-icon" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialEncuestasRealizadasEstudiante;