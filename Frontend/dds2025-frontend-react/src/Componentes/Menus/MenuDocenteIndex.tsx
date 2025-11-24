import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuDocente.css';
import { FileText, BarChart2, History, User, CheckSquare, List, Send, BookOpen, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; 

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
// --- ELIMINAMOS EL HARDCODEO: ID_DOCENTE_ACTUAL = 1; ---
const ID_PERIODO_ACTUAL = 2; // Lo mantenemos hardcodeado por ahora

interface StatsDocenteProps {
    total: number;
    completados: number;
    pendientes: number;
    cargando: boolean;
}

const StatsDocente: React.FC<StatsDocenteProps> = ({ total, completados, pendientes, cargando }) => {
    // ... (StatsDocente es idéntico)
    const display = (num: number) => (cargando ? '...' : num);

    // Cálculo de porcentajes
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
    // --- OBTENEMOS EL ID REAL ---
    const { currentUser, isAuthenticated } = useAuth();
    const docenteId = currentUser?.id ?? 0;
    const userName = currentUser?.username || 'Docente';
    
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Ejecutar solo si tenemos el ID del docente
        if (docenteId === 0 || !isAuthenticated) return; 

        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);

                const [resMaterias, resPeriodo] = await Promise.all([
                    // ⚠️ Aquí deberías modificar la URL para filtrar por docenteId, pero por ahora solo filtramos en el cliente
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
    }, [docenteId, isAuthenticated]); // Dependencia del ID del Docente

    // Bloqueo de seguridad:
    if (docenteId === 0) {
        return <div style={{padding: '20px'}}>Cargando o usuario Docente no válido.</div>;
    }
    
    // Todas las materias del docente (Filtro por el ID real)
    const materiasDelDocente = materias.filter(m => m.id_docente === docenteId);
    const totalCount = materiasDelDocente.length;
    const completadosCount = materiasDelDocente.filter(m => m.informeACCompletado === true).length;

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
                    <h1 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <GraduationCap size={36} style={{ color: 'var(--color-texto-principal, #1f2937)' }} />
                        ¡Bienvenido, {userName}!
                    </h1>
                    {/* ... */}
                </div>
            </div>
        </div>
    );
};

export default MenuDocenteIndex; 