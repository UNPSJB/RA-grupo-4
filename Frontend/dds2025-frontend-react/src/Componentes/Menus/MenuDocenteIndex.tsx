import React from 'react';
import { Link } from 'react-router-dom';
import './MenuAlumno.css'; 
import { FileText, History, BarChart2, User } from 'lucide-react'; 

// Define los colores de las tarjetas (basado en las variables CSS)
const cardStyles = [
  { '--card-color': 'var(--color-docente)' },     
  { '--card-color': 'var(--primary-color)' },    
  { '--card-color': 'var(--color-departamento)' }, 
  { '--card-color': 'var(--color-secretaria)' },   
];

const MenuDocenteIndex: React.FC = () => {
  return (
    <div className="menu-alumno-grid"> {/* El grid de tarjetas */}

      {/* Tarjeta 1: Generar Informe */}
      <Link to="generar-informe" className="menu-card-wow" style={cardStyles[0]}>
        <div className="animated-border-glow"></div>
        <div className="card-content">
          <div className="icon-wrapper"><FileText size={64} /></div>
          <h3>Generar Informe AC</h3>
          <p>Crear un nuevo informe de Actividad Curricular.</p>
          <span className="card-cta">Acceder</span>
        </div>
      </Link>

      {/* Tarjeta 2: Historial Informes */}
      <Link to="historial-informes" className="menu-card-wow" style={cardStyles[1]}>
        <div className="animated-border-glow"></div>
        <div className="card-content">
          <div className="icon-wrapper"><History size={64} /></div>
          <h3>Historial Informes</h3>
          <p>Consultar informes de AC anteriores.</p>
          <span className="card-cta">Acceder</span>
        </div>
      </Link>

      {/* Tarjeta 3: Estadísticas */}
      <Link to="estadisticas" className="menu-card-wow" style={cardStyles[2]}>
        <div className="animated-border-glow"></div>
        <div className="card-content">
          <div className="icon-wrapper"><BarChart2 size={64} /></div>
          <h3>Estadísticas</h3>
          <p>Visualizar datos y estadísticas de los informes.</p>
          <span className="card-cta">Acceder</span>
        </div>
      </Link>

      {/* Tarjeta 4: Mi Perfil */}
      <Link to="mi-perfil" className="menu-card-wow" style={cardStyles[3]}>
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