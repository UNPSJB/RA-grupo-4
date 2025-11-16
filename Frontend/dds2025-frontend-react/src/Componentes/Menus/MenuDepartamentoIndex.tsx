import React from 'react';
import { Link } from 'react-router-dom';
import './MenuDepartamento.css'; 
import { FileText, BarChart2, History, Settings, CheckSquare, List, Send, FileBarChart, AlertCircle, Building } from 'lucide-react';

/* * Componente de Estadísticas Rápidas
 */
const StatsDepartamento: React.FC = () => {
    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">18</span>
                    <span className="mini-stat-label">Docentes</span>
                </div>
                
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">42</span>
                    <span className="mini-stat-label">Inf. AC Recib.</span>
                </div>
                
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">1</span>
                    <span className="mini-stat-label">Sintético Pend.</span>
                </div>

            </div>
        </div>
    );
};


/* * Dashboard Principal del Departamento
 */
const MenuDepartamentoIndex: React.FC = () => {
    
    const roleStyle = { '--color-secundario': '#e76f51' } as React.CSSProperties;

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            
            {/* 1. SECCIÓN SUPERIOR: BIENVENIDA + STATS */}
            <div className="dashboard-header-container">
                
                {/* Tarjeta de Bienvenida */}
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <Building size={36} className="hand-icon" style={{animation: 'none'}} />
                        Panel de Departamento
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de informes sintéticos, estadísticas globales y reportes.
                    </p>
                </div>
                
                {/* Tarjeta de Estadísticas (derecha) */}
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General
                    </h2>
                    <StatsDepartamento />
                </div>
            </div>

            {/* 2. SECCIÓN PENDIENTES */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Tareas Pendientes
                </h2>
                
                <div className="pending-list">
                    <div className="pending-item">
                        <div className="pending-info">
                            <FileBarChart size={24} className="pending-icon" />
                            <div className="pending-text">
                                <h4>Informe Sintético 2025</h4>
                                <p>El ciclo lectivo ha cerrado. Generar informe sintético global.</p>
                            </div>
                        </div>
                        <Link to="generar-informe-sintetico" className="btn-action">
                            Generar Sintético <Send size={16} />
                        </Link>
                    </div>

                    <div className="empty-list-message">
                        No hay más tareas pendientes para el departamento.
                    </div>
                </div>
            </div>
            
            {/* 3. SECCIÓN ACCESO RÁPIDO */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Gestión y Consultas
                </h2>
                
                <div className="card-grid">
                    <Link to="historial-informes" className="nav-card card-blue">
                        <History size={32} />
                        <h3>Historial de Informes</h3>
                        <p>Consulta informes de AC y sintéticos generados.</p>
                    </Link>
                    
                    <Link to="estadisticas" className="nav-card card-yellow">
                        <BarChart2 size={32} />
                        <h3>Estadísticas Globales</h3>
                        <p>Analiza métricas de todas las materias y carreras.</p>
                    </Link>
                    
                    <Link to="configuracion" className="nav-card card-purple">
                        <Settings size={32} />
                        <h3>Configuración</h3>
                        <p>Ajustes de fechas, periodos y permisos.</p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default MenuDepartamentoIndex;