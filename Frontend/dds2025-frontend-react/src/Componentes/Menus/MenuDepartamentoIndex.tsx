import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuDepartamento.css'; 
import { FileText, BarChart2, History, Settings, CheckSquare, List, Send, FileBarChart, AlertCircle, Building } from 'lucide-react';
import InformesSinteticosPendientes from '../Departamento/ListadoInformesSinteticosPendientes';
import MiniEstadisticasDep from '../Departamento/MiniEstadisticasDep';

const API_BASE = "http://localhost:8000";
const ID_DEPARTAMENTO_ACTUAL = 1;
const ID_PERIODO_ACTUAL = 2;

/* * Dashboard Principal del Departamento
 */
const MenuDepartamentoIndex: React.FC = () => {
    
    const roleStyle = { '--color-secundario': '#e56849ff' } as React.CSSProperties;

    const [periodoActual, setPeriodoActual] = useState<any>(null);
    const [departamentoInfo, setDepartamentoInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1) Periodo actual de encuestas
                const resPeriodo = await fetch(`http://localhost:8000/periodos/${ID_PERIODO_ACTUAL}`);
                const periodo = await resPeriodo.json();
                setPeriodoActual(periodo);

                // 2) Datos del departamento
                const resEst = await fetch(`http://localhost:8000/departamentos/${ID_DEPARTAMENTO_ACTUAL}`);
                const estudiante = await resEst.json();
                setDepartamentoInfo(estudiante);
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
            
            {/* 1. SECCIÓN SUPERIOR: BIENVENIDA + STATS */}
            <div className="dashboard-header-container">
                
                {/* Tarjeta de Bienvenida */}
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <Building size={36} className="hand-icon" style={{animation: 'none'}} />
                        Panel del Departamento de {departamentoInfo?.nombre}
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de informes sintéticos, estadísticas globales y reportes.
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
                
                {/* Tarjeta de Estadísticas (derecha) */}
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General
                    </h2>
                    <MiniEstadisticasDep departamentoId={ID_DEPARTAMENTO_ACTUAL} />
                </div>
            </div>

            {/* 2. SECCIÓN PENDIENTES */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Informes Sinteticos Pendientes
                </h2>

                <InformesSinteticosPendientes departamentoId={ID_DEPARTAMENTO_ACTUAL} />
            </div>
            
            {/* 3. SECCIÓN ACCESO RÁPIDO */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Gestión y Consultas
                </h2>
                
                <div className="card-grid">
                    {/* Tarjeta 1: Historial AC (AZUL) */}
                    <Link to="historial-informes" className="nav-card card-blue">
                        <History size={32} />
                        <h3>Historial de Informes</h3>
                        <p>Consulta informacion de los informes de Actividad Curricular.</p>
                    </Link>
                    
                    {/* Tarjeta 2: Estadísticas (AMARILLO) */}
                    <Link to="estadisticas" className="nav-card card-yellow">
                        <BarChart2 size={32} />
                        <h3>Estadísticas Globales de materias</h3>
                        <p>Analiza métricas de todas las materias y carreras.</p>
                    </Link>

                    {/* Tarjeta 3: Historial Sintéticos (NUEVA - VIOLETA) */}
                    {/* Usamos estilos en línea para el color violeta sin depender del CSS externo */}
                    <Link 
                        to="historial-sinteticos" 
                        className="nav-card"
                        style={{ borderTop: '4px solid #8b5cf6' }} // Violeta
                    >
                        <FileBarChart size={32} style={{ color: '#8b5cf6', marginBottom: '15px' }} />
                        <h3 style={{ color: '#333' }}>Historial Sintéticos</h3>
                        <p style={{ color: '#666' }}>Repositorio de informes sintéticos y cortes históricos generados.</p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default MenuDepartamentoIndex;