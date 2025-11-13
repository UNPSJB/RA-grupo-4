import React from 'react';
import { Link } from 'react-router-dom';
import './MenuAlumno.css'; 
import { CheckSquare, History, User } from 'lucide-react'; 

// Estilo específico para Alumno (Verde)
const cardStyle = { '--card-color': 'var(--color-alumno)' } as React.CSSProperties;

const MenuAlumnoIndex: React.FC = () => {
    return (
        <div className="menu-alumno-grid">

            {/* Tarjeta 1: Encuestas Pendientes */}
            <Link to="encuestas-pendientes" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><CheckSquare size={64} /></div>
                    <h3>Responder Encuestas</h3>
                    <p>Accede a tus encuestas pendientes y danos tu opinión.</p>
                    <span className="card-cta">Ver Pendientes</span>
                </div>
            </Link>

            {/* Tarjeta 2: Historial */}
            <Link to="historial" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><History size={64} /></div>
                    <h3>Historial</h3>
                    <p>Revisa las encuestas que ya has completado anteriormente.</p>
                    <span className="card-cta">Ver Historial</span>
                </div>
            </Link>

             {/* Tarjeta 3: Mi Perfil */}
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

export default MenuAlumnoIndex;