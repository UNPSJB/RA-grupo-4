import React, { useState } from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";

// Asumo que tienes tus imágenes aquí, si no, ajusta la ruta
import fotoPerfil from './assets/avatarOA.png'; 
import logoUnpsjb from './assets/logo_unpsjb.png';

// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

//importaciones para el nabar
import Calendario from "./Componentes/Otros/Calendario";
import MostrarMiPerfil from "./Componentes/Otros/MostrarMiPerfil"; // Agrego el perfil que hicimos antes

// --- MENÚS DE SECCIÓN ---
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento"; 
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

const MainLayout = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoUnpsjb} alt="Logo UNPSJB" className="navbar-logo" />
          <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
        </div>

        <div className="navbar-right">
          <div className="perfil-container">
            <img 
              src={fotoPerfil} 
              alt="Perfil" 
              className="navbar-avatar" 
              onClick={toggleMenu}
            />
            
            {mostrarMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Hola, Usuario</div>
                
                <Link to="/home/perfil" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Mi Perfil
                </Link>
                
                <div className="dropdown-divider"></div>
                
                {/* AQUÍ ESTABA EL ERROR: El texto debe ir DENTRO del Link */}
                <Link to="/home/calendario" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Calendario
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
  // Mock de usuario para el ejemplo de perfil
  const usuarioMock = {
    nombre: "Usuario Demo",
    email: "demo@unp.edu.ar",
    rol: "ALUMNO", 
    legajo: "12345"
  };

  return (
    <Routes>
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
        
        {/* NUEVA RUTA: Calendario */}
        <Route path="calendario" element={<Calendario />} />

        {/* Ruta Perfil (Integrando el componente anterior si lo tienes) */}
        <Route path="perfil" element={<MostrarMiPerfil usuario={usuarioMock} />} />

        <Route path="*" element={<HomePage />} />
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;