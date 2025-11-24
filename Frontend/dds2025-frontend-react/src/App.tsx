import React, { useState } from "react";
import { Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import "./App.css";

// Assets (Asegúrate que estas rutas existan o comenta las lineas si no tienes las imgs)
import fotoPerfil from './assets/avatarOA.png'; 
import logoUnpsjb from './assets/logo_unpsjb.png';


// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// Importaciones para el navbar
import Calendario from "./Componentes/Otros/Calendario";
import MostrarMiPerfil from "./Componentes/Otros/MostrarMiPerfil";

// --- MENÚS DE SECCIÓN (RUTAS ANIDADAS) ---
// Asegúrate de que MenuAlumno importe el archivo que arreglamos antes con las clases "alumno-*"
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
    <div className="app-container">
      {/* --- NAVBAR GLOBAL --- */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoUnpsjb} alt="Logo UNPSJB" className="navbar-logo" />
          <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
        </div>

        <div className="navbar-right">
          <div className="perfil-container">
            <div className="avatar-wrapper" onClick={toggleMenu}>
                <img 
                  src={fotoPerfil} 
                  alt="Perfil" 
                  className="navbar-avatar" 
                />
                <span className="avatar-arrow">▼</span>
            </div>
            
            {mostrarMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">Hola, Usuario</div>
                
                <Link to="/home/perfil" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Mi Perfil
                </Link>
                
                <div className="dropdown-divider"></div>
                
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

      {/* --- CONTENIDO DE LAS PÁGINAS --- */}
      <div className="page-content">
        <Outlet />
      </div>

      {/* --- FOOTER GLOBAL --- */}
      <footer className="footer">
        © 2025 HP TEAM — Sistema de encuestas UNPSJB
      </footer>
    </div>
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
      {/* Ruta pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        {/* IMPORTANTE: 
            El "*" al final es vital para que las sub-rutas dentro 
            de MenuAlumno funcionen (ej: /home/alumno/mis-materias) 
        */}
        <Route path="alumno/*" element={<MenuAlumno />} />
        <Route path="docente/*" element={<MenuDocente />} />
        <Route path="departamento/*" element={<MenuDepartamento />} />
        <Route path="secretaria/*" element={<MenuSecretaria />} />

        {/* Rutas auxiliares */}
        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="perfil" element={<MostrarMiPerfil usuario={usuarioMock} />} />

        {/* Fallback interno */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;