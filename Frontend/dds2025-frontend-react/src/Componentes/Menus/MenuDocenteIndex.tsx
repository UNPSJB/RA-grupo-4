import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuDocente.css'; 
import { FileText, BarChart2, History, User, CheckSquare, List, Send, BookOpen, AlertCircle } from 'lucide-react';

// (Aquí irían tus interfaces y constantes de API que ya tienes)
interface Materia {
 id_materia: number;
 nombre: string;
 anio: number;
 codigoMateria?: string;
 id_docente: number; 
}
interface InformeRealizado {
 id_informesAC: number;
 ciclo_lectivo: number | string;
 materia: { id_materia: number };
}
const ID_DOCENTE_ACTUAL = 1; 
const CICLO_LECTIVO_ACTUAL = new Date().getFullYear();
const API_BASE = "http://localhost:8000";

/* Componente de Estadísticas (sin cambios) */
interface StatsDocenteProps {
    total: number;
    completados: number;
    pendientes: number;
    cargando: boolean;
}
const StatsDocente: React.FC<StatsDocenteProps> = ({ total, completados, pendientes, cargando }) => {
    const display = (num: number) => (cargando ? '...' : num);
    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">{display(total)}</span>
                    <span className="mini-stat-label">Materias</span>
                </div>
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">{display(completados)}</span>
                    <span className="mini-stat-label">Completados</span>
                </div>
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">{display(pendientes)}</span>
                    <span className="mini-stat-label">Pendientes</span>
                </div>
            </div>
        </div>
    );
};


/* * Dashboard Principal del Docente
 */
const MenuDocenteIndex: React.FC = () => {
    
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [informesHechos, setInformesHechos] = useState<InformeRealizado[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);
                const [resMaterias, resInformes] = await Promise.all([
                    fetch(`${API_BASE}/materias/listar`),
                    fetch(`${API_BASE}/informesAC/filtradoInformesAc?id_docente=${ID_DOCENTE_ACTUAL}`)
                ]);
                if (!resMaterias.ok || !resInformes.ok) {
                    throw new Error("Error al consultar los datos al servidor.");
                }
                const dataMaterias: Materia[] = await resMaterias.json();
                const dataInformes: InformeRealizado[] = await resInformes.json();
                setMaterias(dataMaterias);
                setInformesHechos(dataInformes);
            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar listas.");
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    const materiasDelDocenteEsteAnio = materias.filter(materia => {
        return materia.id_docente === ID_DOCENTE_ACTUAL && Number(materia.anio) === CICLO_LECTIVO_ACTUAL;
    });
    const materiasPendientes = materiasDelDocenteEsteAnio.filter(materia => {
        const yaEstaHecho = informesHechos.some(inf => 
            inf.materia.id_materia === materia.id_materia &&
            Number(inf.ciclo_lectivo) === CICLO_LECTIVO_ACTUAL
        );
        return !yaEstaHecho;
    });
    const pendientesCount = materiasPendientes.length;
    const totalCount = materiasDelDocenteEsteAnio.length;
    const completadosCount = totalCount - pendientesCount;

    const handleGenerarInforme = (id_materia: number) => {
        navigate(`/home/docente/generar-informe/${id_materia}`); 
    };

    const roleStyle = { '--color-secundario': '#17a2b8' } as React.CSSProperties;

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            
            {/* 1. SECCIÓN SUPERIOR */}
            <div className="dashboard-header-container">
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <span className="hand-icon">👋</span>
                        ¡Bienvenido, Docente!
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de Informes de Actividad Curricular y Estadísticas de Cátedra.
                    </p>
                </div>
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General ({CICLO_LECTIVO_ACTUAL})
                    </h2>
                    <StatsDocente 
                        total={totalCount}
                        completados={completadosCount}
                        pendientes={pendientesCount}
                        cargando={cargando}
                    />
                </div>
            </div>

            {/* 2. SECCIÓN PENDIENTES  */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Informes Pendientes (Ciclo {CICLO_LECTIVO_ACTUAL})
                </h2>
                <div className="pending-list">
                    {cargando && <div className="empty-list-message">Cargando pendientes...</div>}
                    {error && <div className="empty-list-message" style={{color: 'var(--color-alerta)'}}>Error: {error}</div>}
                    {!cargando && !error && materiasPendientes.length === 0 && (
                        <div className="empty-list-message">
                            ¡Felicitaciones! No tienes más informes pendientes de generar.
                        </div>
                    )}
                    {!cargando && !error && materiasPendientes.length > 0 && (
                        <>
                            {materiasPendientes.slice(0, 3).map((materia) => (
                                <div className="pending-item" key={materia.id_materia}>
                                    <div className="pending-info">
                                        <BookOpen size={24} className="pending-icon" />
                                        <div className="pending-text">
                                            <h4>{materia.nombre}</h4>
                                            <p>Código: {materia.codigoMateria ?? 'N/A'} - Pendiente de generación.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleGenerarInforme(materia.id_materia)} 
                                        className="btn-action"
                                    >
                                        Generar Informe <Send size={16} />
                                    </button>
                                </div>
                            ))}
                            {materiasPendientes.length > 3 && (
                                <div style={{padding: '20px 15px 0', textAlign: 'center'}}>
                                    <Link to="informes-pendientes" className="btn-action" style={{backgroundColor: '#6c757d'}}>
                                        Ver los {materiasPendientes.length} informes pendientes...
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {/* 3. SECCIÓN ACCESO RÁPIDO  */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Navegación y Acceso Rápido
                </h2>
                <div className="card-grid">
                    <Link to="historial-informes" className="nav-card card-blue">
                        <History size={32} />
                        <h3>Historial de Informes</h3>
                        <p>Consulta todos los informes que ya has generado previamente.</p>
                    </Link>
                    <Link to="estadisticas" className="nav-card card-yellow">
                        <BarChart2 size={32} />
                        <h3>Estadísticas de Cátedra</h3>
                        <p>Analiza la valoración de las respuestas de los alumnos.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MenuDocenteIndex;