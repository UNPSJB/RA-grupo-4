import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Outlet, Navigate } from "react-router-dom";
import { User, LogOut, Calendar, Settings, ChevronDown, BookOpen } from "lucide-react";
import "./App.css";

// Assets (Si no tienes las imágenes, comenta estas líneas y el src de la img)
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

// --- MENÚS DE SECCIÓN ---
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento"; 
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

const MainLayout = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  //Admin
  const datosUsuario = {
    nombre: "Admin",
    email: "Admin@unpsjb.edu.ar",
    rol: "Administrador",
    legajo: "0000",
    carrera: "Licenciatura en Sistemas",
    sede: "Sede Trelew"
  };

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      
      {/* --- NAVBAR GLOBAL --- */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logoUnpsjb} alt="Logo UNPSJB" className="navbar-logo" />
          <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
        </div>

        <div className="navbar-right" ref={menuRef}>
          <div className="navbar-avatar-container" onClick={toggleMenu}>
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
          
          {mostrarMenu && (
            <div className="profile-card">
              {/* Cabecera Azul */}
              <div className="card-header">
                <img src={fotoPerfil} alt="User" className="card-avatar-large" />
                <h3 className="card-user-name">{datosUsuario.nombre}</h3>
                <span className="card-user-role">{datosUsuario.rol}</span>
                <div style={{fontSize: '0.8rem', marginTop: '5px', opacity: 0.8}}>{datosUsuario.email}</div>
              </div>

              {/* Cuerpo con Datos */}
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

              {/* Botones de Acción */}
              <div className="card-actions">
                <Link to="/home/perfil" className="action-btn" onClick={() => setMostrarMenu(false)}>
                  <User size={18} /> Mi Perfil Completo
                </Link>
                <Link to="/home/calendario" className="action-btn" onClick={() => setMostrarMenu(false)}>
                  <Calendar size={18} /> Mi Calendario
                </Link>
      
                
                <Link to="/" className="action-btn logout" onClick={() => setMostrarMenu(false)}>
                  <LogOut size={18} /> Cerrar Sesión
                </Link>
              </div>
            </div>
          )}
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
    nombre: "Juan Pérez",
    email: "juan.perez@unpsjb.edu.ar",
    rol: "ALUMNO", 
    legajo: "24.561"
  };

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route path="/home" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="alumno/*" element={<MenuAlumno />} />
        <Route path="docente/*" element={<MenuDocente />} />
        <Route path="departamento/*" element={<MenuDepartamento />} />
        <Route path="secretaria/*" element={<MenuSecretaria />} />

        {/* Rutas auxiliares */}
        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="perfil" element={<MostrarMiPerfil/>} />

        {/* Fallback interno */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;