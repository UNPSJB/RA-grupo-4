import React from 'react';
import { Link } from 'react-router-dom';
import './MenuAlumno.css'; 
import { FileText, History, BarChart2, User } from 'lucide-react'; 

const cardStyle = { '--card-color': 'var(--color-docente)' } as React.CSSProperties;

const MenuDocenteIndex: React.FC = () => {
    return (
        <div className="menu-alumno-grid">

            {/* Tarjeta 1: AHORA ES "INFORMES PENDIENTES" */}
            <Link to="informes-pendientes" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><FileText size={64} /></div>
                    <h3>Informes Pendientes</h3>
                    <p>Ver listado de informes pendientes por generar.</p>
                    <span className="card-cta">Ver Pendientes</span>
                </div>
            </Link>

            {/* Tarjeta 2: HISTORIAL */}
            <Link to="historial-informes" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><History size={64} /></div>
                    <h3>Historial Informes</h3>
                    <p>Consultar informes de AC ya generados.</p>
                    <span className="card-cta">Ver Historial</span>
                </div>
            </Link>

            {/* Tarjeta 3: Estadísticas */}
            <Link to="estadisticas" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><BarChart2 size={64} /></div>
                    <h3>Estadísticas</h3>
                    <p>Visualizar datos y estadísticas de los informes.</p>
                    <span className="card-cta">Ver Gráficos</span>
                </div>
            </Link>

             {/* Tarjeta 4: Mi Perfil */}
             <Link to="mi-perfil" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><User size={64} /></div>
                    <h3>Mi Perfil</h3>
                    <p>Verifica y actualiza tu información personal.</p>
                    <span className="card-cta">Acceder</span>
                </div>
            </Link>

        </div>
    );
};

export default MenuDocenteIndex;