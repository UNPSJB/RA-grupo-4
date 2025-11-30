import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuDepartamento.css'; 
import { FileText, BarChart2, History, Settings, CheckSquare, List, Send, FileBarChart, AlertCircle, Building } from 'lucide-react';
import InformesSinteticosPendientes from '../Departamento/ListadoInformesSinteticosPendientes';
import MiniEstadisticasDep from '../Departamento/MiniEstadisticasDep';
import { useAuth } from '../../hooks';

const API_BASE = "http://localhost:8000";

const MenuDepartamentoIndex: React.FC = () => {
    
    const { currentUser } = useAuth();
    const departamentoId = currentUser?.departamento_id;

    const roleStyle = { '--color-secundario': '#e56849ff' } as React.CSSProperties;

    const [periodoActual, setPeriodoActual] = useState<any>(null);
    const [departamentoInfo, setDepartamentoInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPeriodo = await fetch(`${API_BASE}/periodos/actual/informesAC`);
                const periodo = await resPeriodo.json();
                setPeriodoActual(periodo);

                const resDep = await fetch(`http://localhost:8000/departamentos/${departamentoId}`);
                const departamento = await resDep.json();
                setDepartamentoInfo(departamento);
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            
            <div className="dashboard-header-container">
                
                {/* Panel Dep */}
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <Building size={36} className="hand-icon" style={{animation: 'none'}} />
                        Panel del Departamento de {departamentoInfo?.nombre}
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de informes sinteticos, estadisticas globales y reportes.
                        <br />
                        {periodoActual ? (
                            <>
                                Periodo Actual: {periodoActual.ciclo_lectivo} {periodoActual.cuatrimestre}
                            </>
                        ) : (
                            <>No hay periodo activo.</>
                        )}
                    </p>
                </div>
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General
                    </h2>
                    <MiniEstadisticasDep departamentoId={departamentoId} />
                </div>
            </div>

            {/* Pendientes */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Informes Sinteticos Pendientes
                </h2>

                <InformesSinteticosPendientes departamentoId={departamentoId} />
            </div>
            
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Gestión y Consultas
                </h2>
                
                <div className="card-grid">
                    <Link to="historial-informes" className="nav-card card-blue">
                        <History size={32} />
                        <h3>Historial de informes de Actividad Curricular</h3>
                        <p>Consulta informacion de los informes de Actividad Curricular.</p>
                    </Link>
                    <Link to="estadisticas" className="nav-card card-yellow">
                        <BarChart2 size={32} />
                        <h3>Estadísticas Globales de materias</h3>
                        <p>Analiza métricas de todas las materias y carreras.</p>
                    </Link>
                    <Link to="historial-sinteticos" className="nav-card card-yellow">
                        <BarChart2 size={32} />
                        <h3>Historial de informes Sintéticos</h3>
                        <p>Repositorio de informes sintéticos y cortes historicos generados.</p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default MenuDepartamentoIndex;