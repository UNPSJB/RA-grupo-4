import React from 'react';
import { Link } from 'react-router-dom';
import './MenuAlumno.css'; // Reutilizamos estilos
import { FileText, History, BarChart2, Settings } from 'lucide-react'; 

// Estilo específico para Departamento (Amarillo/Naranja)
const cardStyle = { '--card-color': 'var(--color-departamento)' } as React.CSSProperties;

const MenuDepartamentoIndex: React.FC = () => {
    return (
        <div className="menu-alumno-grid">

            {/* Tarjeta 1: Generar Informe */}
            <Link to="generar-informe-sintetico" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><FileText size={64} /></div>
                    <h3>Generar Informe</h3>
                    <p>Crear nuevo Informe Sintético del Departamento.</p>
                    <span className="card-cta">Comenzar</span>
                </div>
            </Link>

            {/* Tarjeta 2: Historial */}
            <Link to="historial-informes" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><History size={64} /></div>
                    <h3>Historial</h3>
                    <p>Ver y gestionar informes generados anteriormente.</p>
                    <span className="card-cta">Consultar</span>
                </div>
            </Link>

            {/* Tarjeta 3: Estadísticas */}
            <Link to="estadisticas" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><BarChart2 size={64} /></div>
                    <h3>Estadísticas</h3>
                    <p>Análisis de datos y respuestas por pregunta.</p>
                    <span className="card-cta">Ver Gráficos</span>
                </div>
            </Link>

             {/* Tarjeta 4: Configuración */}
             <Link to="configuracion" className="menu-card-wow" style={cardStyle}>
                <div className="animated-border-glow"></div>
                <div className="card-content">
                    <div className="icon-wrapper"><Settings size={64} /></div>
                    <h3>Configuración</h3>
                    <p>Ajustes generales del panel de departamento.</p>
                    <span className="card-cta">Acceder</span>
                </div>
            </Link>

        </div>
    );
};

export default MenuDepartamentoIndex;