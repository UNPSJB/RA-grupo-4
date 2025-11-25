import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
// Importamos los iconos
import { User, LogOut, Calendar, ChevronDown, Menu } from "lucide-react"; // Ya no necesitamos X aquí
import "./App.css";

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

// --- NUEVO IMPORT ---
import MenuInstitucional from "./Componentes/Menus/Menuinstitucional";

// =========================================================
// LAYOUT PRINCIPAL
// =========================================================
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mostrarMenuPerfil, setMostrarMenuPerfil] = useState(false);
  const menuPerfilRef = useRef(null);

  const datosUsuario = {
    nombre: "Admin",
    email: "admin@unpsjb.edu.ar",
    rol: "Administrador",
    legajo: "0000",
    carrera: "Licenciatura en Sistemas",
    sede: "Sede Trelew"
  };

  // Cerrar menú perfil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuPerfilRef.current && !menuPerfilRef.current.contains(event.target)) {
        setMostrarMenuPerfil(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      
      {/* Mantén tus estilos CSS incrustados aquí o muévelos a App.css */}
      <style>{`
        .sidebar-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); z-index: 1040;
          opacity: 0; visibility: hidden; transition: all 0.3s;
          backdrop-filter: blur(2px);
        }
        .sidebar-overlay.active { opacity: 1; visibility: visible; }

        .sidebar-menu {
          position: fixed; top: 0; left: -300px; 
          width: 280px; height: 100vh; background: #fff; z-index: 1050;
          box-shadow: 4px 0 15px rgba(0,0,0,0.1);
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column;
        }
        .sidebar-menu.open { left: 0; } 

        .sidebar-header {
          padding: 20px; background: #f8f9fa; border-bottom: 1px solid #eee;
          display: flex; justify-content: space-between; align-items: center;
        }
        .sidebar-header h2 { margin: 0; font-size: 1.2rem; color: #0056b3; font-weight: 700; }
        .close-btn { background: none; border: none; cursor: pointer; color: #666; }
        
        .sidebar-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; }
        .sidebar-list li a {
          display: block; padding: 15px 20px; text-decoration: none; color: #333;
          border-bottom: 1px solid #f0f0f0; font-weight: 500; transition: 0.2s;
        }
        .sidebar-list li a:hover { background: #eef2f6; color: #0056b3; padding-left: 25px; }

        .hamburger-btn {
          background: none; border: none; cursor: pointer; padding: 5px;
          margin-right: 15px; display: flex; align-items: center;
        }
        .hamburger-btn:hover { background: #f0f0f0; border-radius: 5px; }
      `}</style>
      
      {/* --- USO DEL NUEVO COMPONENTE --- */}
      <MenuInstitucional 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* --- NAVBAR SUPERIOR --- */}
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
                <Link to="/" className="action-btn logout" onClick={() => setMostrarMenuPerfil(false)}>
                  <LogOut size={18} /> Cerrar Sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="page-content">
        <Outlet />
      </div>

      <footer className="footer">
        © 2025 HP TEAM — Sistema de encuestas UNPSJB
      </footer>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="alumno/*" element={<MenuAlumno />} />
        <Route path="docente/*" element={<MenuDocente />} />
        <Route path="departamento/*" element={<MenuDepartamento />} />
        <Route path="secretaria/*" element={<MenuSecretaria />} />
        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="perfil" element={<MostrarMiPerfil/>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;