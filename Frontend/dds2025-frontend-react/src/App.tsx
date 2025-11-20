import React, { useState } from "react"; // Importamos useState para el menú
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";
import fotoPerfil from './assets/avatarOA.png';
import logoUnpsjb from './assets/logo_unpsjb.png';

// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// --- MENÚS DE SECCIÓN (ROUTERS ANIDADOS) ---
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento"; 
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

/**
 * Layout principal con Navbar y Footer
 */
const MainLayout = () => {
  // Estado para controlar si el menú del perfil está visible o no
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Logo a la izquierda del título */}
          <img src={logoUnpsjb} alt="Logo UNPSJB" className="navbar-logo" />
          <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
        </div>

        <div className="navbar-right">
          {/* Contenedor del Avatar y el Menú */}
          <div className="perfil-container">
            <img 
              src={fotoPerfil} 
              alt="Perfil" 
              className="navbar-avatar" 
              onClick={toggleMenu}
            />
            
            {/* Renderizado condicional del menú desplegable */}
            {mostrarMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Hola, Usuario</div>
                <Link to="/home/perfil" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Mi Perfil
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/" className="dropdown-item logout" onClick={() => setMostrarMenu(false)}>
                  Cerrar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="footer">
        © 2025 HP TEAM — Sistema de encuestas UNPSJB
      </footer>
    </>
  );
};

function App() {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/" element={<LoginPage />} />

      <Route path="/home" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        {/* Secciones anidadas */}
        <Route path="alumno/*" element={<MenuAlumno />} />
        <Route path="docente/*" element={<MenuDocente />} />
        <Route path="departamento/*" element={<MenuDepartamento />} />
        <Route path="secretaria/*" element={<MenuSecretaria />} />

        {/* Rutas de error/info */}
        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />
        
        {/* Ruta placeholder para el perfil (opcional si aún no tienes el componente) */}
        <Route path="perfil" element={<div><h1>Mi Perfil</h1></div>} />

        {/* Fallback interno */}
        <Route path="*" element={<HomePage />} />
      </Route>

      {/* Fallback general */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;