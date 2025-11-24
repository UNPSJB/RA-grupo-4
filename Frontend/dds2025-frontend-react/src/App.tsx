import React, { useState } from "react";
import { Routes, Route, Link, Outlet, useNavigate } from "react-router-dom";
import "./App.css";

// --- IMPORTS DEL SISTEMA DE AUTENTICACIÓN ---
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import Login from "./features/auth/Login"; // Asume que features/auth/Login.tsx existe
// --- FIN IMPORTS AUTH ---

// Componentes Generales
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// Importaciones para el nabar
import Calendario from "./Componentes/Otros/Calendario";
import MostrarMiPerfil from "./Componentes/Otros/MostrarMiPerfil";

// --- MENÚS DE SECCIÓN ---
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento";
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

// Assets
import fotoPerfil from './assets/avatarOA.png';
import logoUnpsjb from './assets/logo_unpsjb.png';

// =========================================================================
// 1. LAYOUT PRINCIPAL (NAVBAR DINÁMICO)
// =========================================================================
const MainLayout = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth(); // <--- USA useAuth() AHORA
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const handleLogout = async () => {
    await logout();
    setMostrarMenu(false);
    navigate("/"); // Redirige a la raíz (que ahora es el Login)
  }

  // Si no está autenticado, no debería renderizar nada (será atrapado por AuthLayout)
  if (!isAuthenticated || !currentUser) return null; 
  
  // Lógica del rol (se usa en el menú o en los botones)
  const roleName = currentUser.role_name || "Usuario";

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
                {/* MOSTRAR DATOS REALES DEL USUARIO */}
                <div className="dropdown-header">Hola, {roleName}</div>
                
                <Link to="/home/perfil" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Mi Perfil
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <Link to="/home/calendario" className="dropdown-item" onClick={() => setMostrarMenu(false)}>
                  Calendario
                </Link>

                <div className="dropdown-divider"></div>
                
                {/* BOTÓN DE CERRAR SESIÓN QUE EJECUTA EL LOGOUT REAL */}
                <div className="dropdown-item logout" onClick={handleLogout}> 
                  Cerrar Sesión
                </div>
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

// =========================================================================
// 2. FUNCIÓN PRINCIPAL DE LA APLICACIÓN (RUTAS)
// =========================================================================
function App() {

  // Usuario Mock ELIMINADO. Los datos vienen de useAuth.

  return (
    <Routes>
      {/* RUTA PÚBLICA: / (Raíz) ahora apunta al Login */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> {/* Ruta alternativa por si acaso */}


      {/* ---------------------------------------------------- */}
      {/* RUTAS PROTEGIDAS: Todo lo que requiere LOGIN va aquí */}
      {/* ---------------------------------------------------- */}
      
      {/* AuthLayout verifica la sesión, si falla, redirige a /login */}
      <Route path="/home" element={<AuthLayout />}>
        
        {/* Usamos el MainLayout (Nav y Footer) para las sub-rutas protegidas */}
        <Route element={<MainLayout />}> 
            <Route index element={<HomePage />} />

            {/* Rutas de Usuario (Necesitan ser dinámicas: Docente/Alumno) */}
            <Route path="alumno/*" element={<MenuAlumno />} />
            <Route path="docente/*" element={<MenuDocente />} />
            <Route path="departamento/*" element={<MenuDepartamento />} />
            <Route path="secretaria/*" element={<MenuSecretaria />} />

            {/* Rutas de error/info */}
            <Route path="error" element={<ErrorCargaDatos />} />
            <Route path="sin-datos" element={<SinDatos />} />
            
            {/* Rutas de Perfil/Herramientas */}
            <Route path="calendario" element={<Calendario />} />
            {/* TODO: Pasar datos de currentUser al componente MostrarMiPerfil */}
            <Route path="perfil" element={<MostrarMiPerfil />} /> 
        </Route>
      </Route>

      {/* RUTA COMODÍN (Catch-all) */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;