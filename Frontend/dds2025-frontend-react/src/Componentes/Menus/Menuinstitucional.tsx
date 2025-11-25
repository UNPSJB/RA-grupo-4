import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';

const MenuInstitucional = ({ isOpen, onClose }) => {
  // Lista de items del menú actualizada
  const menuItems = [
    // --- LINK DE MAPAS CONECTADO ---
    { 
      label: "Mapas", 
      url: "https://www.unp.edu.ar/index.php/22-universidad/14-mapas-de-las-sedes", 
      external: true 
    },
    
    { label: "Manual y gráfica", url: "#", external: false },
    { label: "Estatuto", url: "#", external: false },
    { label: "Gobierno Abierto", url: "#", external: false },
    { label: "Organos de gobierno", url: "#", external: false },
    { label: "Contactos", url: "#", external: false },
    { label: "Autoridades", url: "#", external: false },
    
    // Link destacado del Aniversario
    { 
      label: "Página web 50 años UNPSJB",
      url: "https://debunp.unp.edu.ar/50aniversario/", 
      external: true,
      highlight: true 
    },
    
    { label: "Museo del Petróleo", url: "#", external: false }
  ];

  return (
    <>
      {/* Overlay (Fondo oscuro) */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Panel Lateral Deslizante */}
      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Institucional</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.external ? (
                // Lógica para Enlaces Externos (Mapas, Aniversario, etc.)
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`menu-link-item ${item.highlight ? 'highlight-link' : ''}`}
                  onClick={onClose}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {item.label}
                  {/* Icono pequeño para indicar que sale del sitio */}
                  <ExternalLink size={14} color="#999" style={{marginLeft: 'auto'}}/>
                </a>
              ) : (
                // Lógica para Enlaces Internos (Dentro de tu App)
                <Link 
                  to={item.url} 
                  className="menu-link-item"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .menu-link-item {
          display: block; 
          padding: 15px 20px; 
          text-decoration: none; 
          color: #333;
          border-bottom: 1px solid #f0f0f0; 
          font-weight: 500; 
          transition: 0.2s;
        }
        .menu-link-item:hover { 
          background: #eef2f6; 
          color: #0056b3; 
          padding-left: 25px; 
        }
        
        /* Estilo especial para el link de Aniversario */
        .highlight-link {
          color: #0056b3; 
          font-weight: 700;
          background-color: #f0f9ff;
        }
      `}</style>
    </>
  );
};

export default MenuInstitucional;