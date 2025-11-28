import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Outlet, useNavigate, Navigate } from "react-router-dom";
import { User, LogOut, Calendar, ChevronDown, Menu } from "lucide-react";
import "./App.css";

// --- IMPORTS DEL SISTEMA DE AUTENTICACIÓN ---
import { useAuth } from "./hooks/useAuth";
import { AuthLayout } from "./layouts/AuthLayout";
import Login from "./features/auth/Login";

// Assets
import fotoPerfil from './assets/avatarOA.png'; 
import logoUnpsjb from './assets/logo_unpsjb.png';

// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";
import Calendario from "./Componentes/Otros/Calendario";
import MostrarMiPerfil from "./Componentes/Otros/MostrarMiPerfil";

// Menús
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento";
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

// Menu institucional
import MenuInstitucional from "./Componentes/Menus/Menuinstitucional";
import Nosotros from "./Componentes/Otros/Nosotros";


// =========================================================================
// 1. LAYOUT PRINCIPAL (NAVBAR DINÁMICO)
// =========================================================================
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);
  const menuPerfilRef = useRef(null);

  const [mostrarMenu, setMostrarMenu] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();


  const datosUsuario = {
    nombre: "Admin",
    email: "admin@unpsjb.edu.ar",
    rol: "Administrador",
    legajo: "0000",
    carrera: "Licenciatura en Sistemas",
    sede: "Sede Trelew"
  };

  // Cerrar menu perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuPerfilRef.current && !menuPerfilRef.current.contains(event.target)) {
        setMostrarMenuPerfil(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
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
    <div className="app-container">

      {/* Menu de hamburgesa, lo vi en tiktok */}
      <MenuInstitucional 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/*navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} color="#0056b3" />
          </button>

          <img src={logoUnpsjb} alt="Logo" className="navbar-logo" />
          <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
        </div>

        <div className="navbar-right" ref={menuPerfilRef}>
          <div className="navbar-avatar-container" onClick={() => setMostrarMenuPerfil(!mostrarMenuPerfil)}>
            <div style={{textAlign: 'right', marginRight: '5px', display: 'flex', flexDirection: 'column'}}>
              <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b'}}>Hola, {datosUsuario.nombre.split(" ")[0]}</span>
              <span style={{fontSize: '0.7rem', color: '#64748b'}}>{datosUsuario.rol}</span>
            </div>
            <img 
              src={fotoPerfil} 
              alt="Perfil" 
              className="navbar-avatar" 
              style={{width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e2e8f0'}}
            />
            <ChevronDown size={16} color="#64748b" />
          </div>

          {mostrarMenuPerfil && (
            <div className="profile-card">
              <div className="card-header">
                <img src={fotoPerfil} alt="User" className="card-avatar-large" />
                <h3 className="card-user-name">{datosUsuario.nombre}</h3>
                <span className="card-user-role">{datosUsuario.rol}</span>
                <div style={{fontSize: '0.8rem', marginTop: '5px', opacity: 0.8}}>{datosUsuario.email}</div>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Legajo</span>
                  <span className="info-value">{datosUsuario.legajo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sede</span>
                  <span className="info-value">{datosUsuario.sede}</span>
                </div>
                <div className="info-row" style={{borderBottom: 'none', marginBottom: 0}}>
                  <span className="info-label">Carrera</span>
                  <span className="info-value" style={{maxWidth: '150px'}}>{datosUsuario.carrera}</span>
                </div>
              </div>

              <div className="card-actions">
                <Link to="/home/perfil" className="action-btn" onClick={() => setMostrarMenuPerfil(false)}>
                  <User size={18} /> Mi Perfil Completo
                </Link>
                <Link to="/home/calendario" className="action-btn" onClick={() => setMostrarMenuPerfil(false)}>
                  <Calendar size={18} /> Mi Calendario
                </Link>

                <div className="dropdown-divider"></div>
                
                {/* BOTÓN DE CERRAR SESIÓN QUE EJECUTA EL LOGOUT REAL */}
                <div className="dropdown-item logout" onClick={handleLogout}> 
                  Cerrar Sesión
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="footer">
        © 2025 HP TEAM — Sistema de encuestas UNPSJB - Todos los derechos reservados
      </footer>
    </div>
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

        
            <Route path="nosotros" element={<Nosotros />} />

            <Route path="error" element={<ErrorCargaDatos />} />
            <Route path="sin-datos" element={<SinDatos />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="perfil" element={<MostrarMiPerfil/>} />
        </Route>
      </Route>

      {/* RUTA COMODÍN (Catch-all) */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
