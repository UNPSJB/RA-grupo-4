import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";

// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// --- MENÚS DE SECCIÓN (ROUTERS ANIDADOS) ---
// Estos son los únicos componentes que App.tsx necesita saber
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
// (Aquí también importarías tus otros menús)
// import MenuDocente from "./Componentes/Menus/MenuDocente";
// import MenuDepartamento from "./Componentes/Menus/MenuDepartamento";
// import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

/**
 * Un componente de Layout interno para no repetir la Navbar y Footer
 */
const MainLayout = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            {/* <img src={logoUnpsjb} alt="Logo" className="navbar-logo" /> */}
            <span className="site-name">Sistema de Encuestas UNPSJB</span>
          </Link>
        </div>
        <div className="navbar-right">
          {/* <img src={userAvatar} alt="Perfil" className="user-avatar" /> */}
          <Link to="/" className="logout-link">Cerrar Sesión</Link>
        </div>
      </nav>

      <div className="page-content">
        {/* Outlet renderizará la ruta anidada (HomePage, MenuAlumno, etc.) */}
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
      {/* Ruta de login (fuera del layout principal) */}
      <Route path="/" element={<LoginPage />} />

      {/* Rutas principales que usan MainLayout (Navbar/Footer) */}
      <Route path="/home" element={<MainLayout />}>
        
        {/* Ruta índice de /home -> El carrusel */}
        <Route index element={<HomePage />} />
        
        {/* Rutas anidadas para cada sección */}
        {/* Cualquier ruta que empiece con /home/alumno/* será manejada por MenuAlumno */}
        <Route path="alumno/*" element={<MenuAlumno />} />
        
        {/* (Aquí pondrías las otras secciones) */}
        {/* <Route path="docente/*" element={<MenuDocente />} /> */}
        {/* <Route path="departamento/*" element={<MenuDepartamento />} /> */}
        {/* <Route path="secretaria/*" element={<MenuSecretaria />} /> */}

        {/* Rutas de Error/Info */}
        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />

        {/* Ruta comodín para cualquier cosa no encontrada DENTRO de /home */}
        <Route path="*" element={<HomePage />} /> 
      </Route>
      
      {/* Ruta comodín general */}
      <Route path="*" element={<LoginPage />} /> 
    </Routes>
  );
}

export default App;