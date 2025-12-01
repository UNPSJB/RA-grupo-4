import React from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink } from 'lucide-react';
import Nosotros from '../Otros/Nosotros';
import { useAuth } from '../../hooks';

const MenuInstitucional = ({ isOpen, onClose }) => {

  const { currentUser, isAuthenticated, logout } = useAuth();
  const getHomePath = () => {
      const rol = currentUser?.role_name;

      switch (rol) {
          case "alumno":
              return "/home/alumno";
          case "docente":
              return "/home/docente";
          case "departamento":
              return "/home/departamento";
          case "secretaria_academica":
              return "/home/secretaria";
          default:
              return "/home";
      }
  };


  const menuItems = [
    { label: "Inicio", url: getHomePath(), external: false},
    { label: "Mapas", url: "https://www.unp.edu.ar/index.php/22-universidad/14-mapas-de-las-sedes", external: true },
    { label: "Manual y gráfica", url: "https://www.unp.edu.ar/index.php/22-universidad/11-manual-institucional", external: true },
    { label: "Estatuto", url: "https://www.unp.edu.ar/consejo/documentos/ordenanzas/ordenanza120.pdf", external: true },
    { label: "Gobierno Abierto", url: "https://transparencia.unp.edu.ar/portalconocimiento/", external: true },
    { label: "Organos de gobierno", url: "https://www.unp.edu.ar/index.php/8-administrativo/5258-organos-de-gobierno", external: true },
    { label: "Contactos", url: "https://www.unp.edu.ar/index.php/8-administrativo/5259-contactos", external: true },
    { label: "Autoridades", url: "https://www.unp.edu.ar/index.php/8-administrativo/5257-autoridades-blanco", external: true },
    { label: "Página web 50 años UNPSJB", url: "https://debunp.unp.edu.ar/50aniversario/", external: true},
    { label: "Museo del Petróleo", url: "https://www.unp.edu.ar/index.php/museo-del-petroleo", external: true },
    { label: "Nosotros", url: "/home/nosotros", external: false }

  ];

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      ></div>

      <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Institucional</h2>
        </div>
        
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.external ? (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`menu-link-item ${item.highlight ? 'highlight-link' : ''}`}
                  onClick={onClose}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  {item.label}
                  <ExternalLink size={14} color="#999" style={{marginLeft: 'auto'}}/>
                </a>
              ) : (
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
        
        }
      `}</style>
    </>
  );
};

export default MenuInstitucional;
