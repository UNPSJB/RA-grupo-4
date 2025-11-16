import React from 'react';
import { Link } from 'react-router-dom';
import './MenuDocente.css'; // Importa el CSS nuevo
import { FileText, BarChart2, History, User, CheckSquare, List, Send, BookOpen, AlertCircle } from 'lucide-react';

/* * Componente de Estadísticas Rápidas (Panel Derecho)
 */
const StatsDocente: React.FC = () => {
    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">5</span>
                    <span className="mini-stat-label">Materias</span>
                </div>
                
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">12</span>
                    <span className="mini-stat-label">Completados</span>
                </div>
                
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">3</span>
                    <span className="mini-stat-label">Pendientes</span>
                </div>

            </div>
        </div>
    );
};


/* * Dashboard Principal del Docente
 */
const MenuDocenteIndex: React.FC = () => {
    
    // Asignamos el color del rol Docente (Azul Secundario)
    const roleStyle = { '--color-secundario': '#17a2b8' } as React.CSSProperties;

    return (
        <div className="dashboard-main-view" style={roleStyle}>
            
            {/* 1. SECCIÓN SUPERIOR: BIENVENIDA + STATS */}
            <div className="dashboard-header-container">
                
                {/* Tarjeta de Bienvenida */}
                <div className="bienvenida-box">
                    <h1 className="welcome-title">
                        <span className="hand-icon">👋</span>
                        ¡Bienvenido, Docente!
                    </h1>
                    <p className="panel-subtitle">
                        Gestión de Informes de Actividad Curricular y Estadísticas de Cátedra.
                    </p>
                </div>
                
                {/* Tarjeta de Estadísticas (derecha) */}
                <div className="estadisticas-box">
                    <h2 className="stats-title">
                        <List size={20} />
                        Resumen General
                    </h2>
                    <StatsDocente />
                </div>
            </div>

            {/* 2. SECCIÓN PENDIENTES */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <AlertCircle size={24} />
                    Informes Pendientes (Ciclo 2025)
                </h2>
                
                <div className="pending-list">
                    {/* Lista de pendientes (idealmente vendría de una API) */}
                    <div className="pending-item">
                        <div className="pending-info">
                            <BookOpen size={24} className="pending-icon" />
                            <div className="pending-text">
                                <h4>Programación I</h4>
                                <p>Encuesta UNPSJB - Pendiente de generación.</p>
                            </div>
                        </div>
                        {/* AQUÍ ESTÁ LA CONFUSIÓN DE RUTAS QUE MENCIONASTE.
                          Lo correcto es que 'Pendientes' vaya a 'informes-pendientes'.
                          Y 'Generar Informe' es una acción dentro de esa lista. 
                          Vamos a cambiar los enlaces del dashboard para que sean correctos.
                        */}
                        <Link to="informes-pendientes" className="btn-action">
                            Ver Pendientes <Send size={16} />
                        </Link>
                    </div>

                    {/* Mensaje si no hay más */}
                    <div className="empty-list-message">
                        ¡Felicitaciones! No tienes más informes pendientes de generar.
                    </div>
                </div>
            </div>
            
            {/* 3. SECCIÓN ACCESO RÁPIDO */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <CheckSquare size={24} />
                    Navegación y Acceso Rápido
                </h2>
                
                <div className="card-grid">
                    {/* Botón de "Informes Pendientes" que lleva al listado */}
                    <Link to="informes-pendientes" className="nav-card card-blue">
                        <FileText size={32} />
                        <h3>Informes Pendientes</h3>
                        <p>Ver el listado de informes por generar.</p>
                    </Link>

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
                    
                    <Link to="mi-perfil" className="nav-card card-purple">
                        <User size={32} />
                        <h3>Mi Perfil</h3>
                        <p>Gestiona tus datos personales y contraseña.</p>
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default MenuDocenteIndex;