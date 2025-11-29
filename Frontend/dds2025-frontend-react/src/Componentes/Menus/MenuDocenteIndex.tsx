import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuDocente.css';
import { FileText, BarChart2, History, CheckSquare, List, Send, BookOpen, AlertCircle, GraduationCap, ChevronRight, ChevronDown } from 'lucide-react';
import ListadoInformesACDoc from '../Docente/ListadoInformesACDoc';
import { useAuth } from '../../hooks';

interface Periodo{
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    fecha_cierre_informesAC: string;
}
interface Docente{
    id_docente: number;
    nombre: string;
    nroLegajo: number;
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


interface StatsDocenteProps {
    total: number;
    completados: number;
    pendientes: number;
    cargando: boolean;
}

const StatsDocente: React.FC<StatsDocenteProps> = ({ total, completados, pendientes, cargando }) => {
    const display = (num: number) => (cargando ? '...' : num);

    const pctCompletados = total > 0 ? Math.round((completados / total) * 100) : 0;
    const pctPendientes = total > 0 ? Math.round((pendientes / total) * 100) : 0;

    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">{display(total)}</span>
                    <span className="mini-stat-label">Materias</span>
                </div>
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">{display(completados)}</span>
                    <span className="mini-stat-label">Completados ({pctCompletados}%)</span>
                </div>
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">{display(pendientes)}</span>
                    <span className="mini-stat-label">Pendientes ({pctPendientes}%)</span>
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
    const [docenteInfo, setDocente] = useState<Docente | null>(null);

    const ITEMS_PER_PAGE = 3;
    const [mostrarCantidad, setMostrarCantidad] = useState<number>(ITEMS_PER_PAGE);

    const { currentUser } = useAuth();
    const docenteId = currentUser?.docente_id;

    const navigate = useNavigate();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);

                const [resMaterias, resPeriodo, resDocente] = await Promise.all([
                    fetch(`${API_BASE}/materias/listar`),
                    fetch(`${API_BASE}/periodos/actual/informesAC`),
                    fetch(`${API_BASE}/docentes/${docenteId}`)
                ]);

                if (!resMaterias.ok || !resPeriodo.ok || !resDocente.ok) {
                    throw new Error("Error al consultar los datos al servidor.");
                }
                const dataMaterias: Materia[] = await resMaterias.json();
                const dataPeriodo: Periodo = await resPeriodo.json();
                const dataDocente: Docente = await resDocente.json();

                setMaterias(dataMaterias);
                setPeriodoActual(dataPeriodo);
                setDocente(dataDocente);

            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar datos.");
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    const materiasDelDocente = materias.filter(m => m.id_docente === docenteId);
    const totalCount = materiasDelDocente.length;

    const completadosCount = materiasDelDocente.filter(m => m.informeACCompletado === true).length;

    const materiasPendientes = materiasDelDocente.filter(
        m => m.id_periodo === periodoActual?.id && m.informeACCompletado !== true
    );
    const pendientesCount = materiasPendientes.length;

    const materiasPendientesVisibles = materiasPendientes.slice(0, mostrarCantidad);

    const handleVerMas = () => {
        setMostrarCantidad(prev => prev + ITEMS_PER_PAGE);
    };

    const handleGenerarInforme = (id_materia: number) => {
        navigate(`/home/docente/generar-informe/${id_materia}`);
    };
    
    const hoy = new Date();

    const fechaCierre = periodoActual?.fecha_cierre_informesAC
        ? new Date(periodoActual.fecha_cierre_informesAC)
        : null;

    const diasRestantes = fechaCierre
        ? Math.ceil((fechaCierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;


    const roleStyle = { '--color-secundario': '#17a2b8' } as React.CSSProperties;

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            <div className="dashboard-header-container">
                <div className="bienvenida-box">
                    <h1 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <GraduationCap size={36} style={{ color: 'var(--color-texto-principal, #1f2937)' }} />
                        ¡Bienvenido, {docenteInfo?.nombre}!
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de Informes de Actividad Curricular y Estadísticas de Cátedra. <br />
                        Periodo actual: {periodoActual?.ciclo_lectivo} {" "} {periodoActual?.cuatrimestre} <br/>
                        Quedan <strong>{diasRestantes}</strong> días para el cierre de los informes de Actividad Curricular.
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
                            {materiasPendientesVisibles.map((materia) => (
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

                            {materiasPendientesVisibles.length < materiasPendientes.length && (
                                <div style={{padding: '20px 15px 0', textAlign: 'center'}}>
                                    <button 
                                        className="btn-action"
                                        style={{backgroundColor: '#17a2b8', display: 'inline-flex', alignItems: 'center', gap: '6px'}}
                                        onClick={handleVerMas}
                                    >
                                        Ver Más ({materiasPendientes.length - materiasPendientesVisibles.length} restantes)
                                        <ChevronDown size={18} />
                                    </button>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>

            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Navegación y Acceso Rápido
                </h2>
                <div className="card-grid">
                    <Link to="historial-informes" className="nav-card card-celeste">
                        <History size={32} />
                        <h3>Historial de Informes</h3>
                        <p>Consulta todos los informes de actividad curricular que has generado previamente.</p>
                    </Link>
                    <Link to="estadisticas" className="nav-card card-colorcito">
                        <BarChart2 size={32} />
                        <h3>Estadísticas de Catedra</h3>
                        <p>Analiza la valoración de las respuestas de los alumnos en las encuestas.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MenuDocenteIndex;
