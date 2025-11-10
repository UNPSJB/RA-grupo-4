import React from 'react';
import { Link } from 'react-router-dom';
import './MenuAlumno.css'; // Reutiliza el mismo CSS
import { CheckSquare, History, ClipboardList, User } from 'lucide-react';

/**
 * Este componente es SÓLO la grilla de tarjetas.
 * Se renderiza en el <Outlet> de MenuAlumno.tsx
 */
const MenuAlumnoIndex = () => {
  const menuItems = [
    {
      titulo: "Responder Encuestas",
      descripcion: "Accede a tus encuestas pendientes y danos tu opinión.",
      link: "seleccionar", // <-- RUTA RELATIVA
      icon: <CheckSquare size={48} />,
      color: "var(--color-alumno)"
    },
    {
      titulo: "Historial",
      descripcion: "Revisa las encuestas que ya has completado.",
      link: "historial-encuestas", // <-- RUTA RELATIVA
      icon: <History size={48} />,
      color: "var(--primary-color)"
    },
    {
      titulo: "Mis Materias",
      descripcion: "Consulta información sobre tus materias inscritas.",
      link: "mis-materias", // <-- RUTA RELATIVA
      icon: <ClipboardList size={48} />,
      color: "var(--color-docente)"
    },
    {
      titulo: "Mi Perfil",
      descripcion: "Verifica y actualiza tu información personal.",
      link: "mi-perfil", // <-- RUTA RELATIVA
      icon: <User size={48} />,
      color: "#6c757d"
    }
  ];

  return (
    <div className="menu-alumno-grid">
      {menuItems.map((item, index) => (
        <Link
          to={item.link}
          key={index}
          className="menu-card-wow"
          style={{ '--card-color': item.color } as React.CSSProperties}
        >
          <div className="animated-border-glow" />
          <div className="card-content">
            <div className="icon-wrapper">
              {item.icon}
            </div>
            <h3>{item.titulo}</h3>
            <p>{item.descripcion}</p>
            <span className="card-cta">
              Acceder
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuAlumnoIndex;