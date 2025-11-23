import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuDocente.css'; 
import { FileText, BarChart2, History, User, CheckSquare, List, Send, BookOpen, AlertCircle } from 'lucide-react';

interface Periodo{
    ciclo_lectivo: number;
    cuatrimestre: string;
}
interface Materia {
    id_materia: number;
    nombre: string;
    id_periodo: number;
    periodo: Periodo;
    ciclo_lectivo: number;
    cuatrimestre: string;
    codigoMateria?: string;
    id_docente: number; 
    informeACCompletado?: boolean;
}
const API_BASE = "http://localhost:8000";
const ID_DOCENTE_ACTUAL = 1;
const ID_PERIODO_ACTUAL = 2;
const CICLO_LECTIVO_ACTUAL = new Date().getFullYear();

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

const MenuDocenteIndex: React.FC = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);

                const [resMaterias, resPeriodo] = await Promise.all([
                    fetch(`${API_BASE}/materias/listar`),
                    fetch(`${API_BASE}/periodos/${ID_PERIODO_ACTUAL}`)
                ]);

                if (!resMaterias.ok || !resPeriodo.ok) {
                    throw new Error("Error al consultar los datos al servidor.");
                }

                const dataMaterias: Materia[] = await resMaterias.json();
                const dataPeriodo: Periodo = await resPeriodo.json();

                setMaterias(dataMaterias);
                setPeriodoActual(dataPeriodo);

            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar datos.");
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    // Todas las materias del docente
    const materiasDelDocente = materias.filter(m => m.id_docente === ID_DOCENTE_ACTUAL);
    const totalCount = materiasDelDocente.length;

    // Materias completadas (tienen informeACCompletado = true)
    const completadosCount = materiasDelDocente.filter(m => m.informeACCompletado === true).length;

    // Materias pendientes: del periodo actual y sin informeAC completado
    const materiasPendientes = materiasDelDocente.filter(
        m => m.id_periodo === ID_PERIODO_ACTUAL && m.informeACCompletado !== true
    );
    const pendientesCount = materiasPendientes.length;

    const handleGenerarInforme = (id_materia: number) => {
        navigate(`/home/docente/generar-informe/${id_materia}`);
    };

    const roleStyle = { '--color-secundario': '#17a2b8' } as React.CSSProperties;

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            <div className="dashboard-header-container">
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <span className="hand-icon">👋</span>
                        ¡Bienvenido, Docente!
                    </h1>
                    <p className="panel-subtitle">
                        Periodo actual: {periodoActual?.ciclo_lectivo} {" "} {periodoActual?.cuatrimestre} <br/>
                        Gestión de Informes de Actividad Curricular y Estadísticas de Cátedra.
                    </p>
                </div>
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General
                    </h2>
                    <StatsDocente 
                        total={totalCount}
                        completados={completadosCount}
                        pendientes={pendientesCount}
                        cargando={cargando}
                    />
                </div>
            </div>

            {/* SECCIÓN PENDIENTES */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Informes Pendientes ({periodoActual?.cuatrimestre} {periodoActual?.ciclo_lectivo})
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

            {/* SECCIÓN ACCESO RÁPIDO */}
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
