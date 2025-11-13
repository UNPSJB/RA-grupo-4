import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./App.css";

// Componentes Generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// --- MENÚS DE SECCIÓN (ROUTERS ANIDADOS) ---
import MenuAlumno from "./Componentes/Menus/MenuAlumno";
import MenuDocente from "./Componentes/Menus/MenuDocente";
// 👇 ¡ESTA LÍNEA ES LA QUE FALTABA! (La descomentamos)
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento"; 
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
            <span className="site-name">Sistema de Encuestas UNPSJB</span>
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/" className="logout-link">Cerrar Sesión</Link>
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

      {/* Rutas principales */}
      <Route path="/home" element={<MainLayout />}>
        
        <Route index element={<HomePage />} />
        
        {/* Rutas anidadas */}
        <Route path="alumno/*" element={<MenuAlumno />} />
        <Route path="docente/*" element={<MenuDocente />} />
        
        {/* 👇 ¡Y ESTA ES LA RUTA QUE HACE QUE EL BOTÓN FUNCIONE! 👇 */}
        <Route path="departamento/*" element={<MenuDepartamento />} /> 
        
        {/* <Route path="secretaria/*" element={<MenuSecretaria />} /> */}

        <Route path="error" element={<ErrorCargaDatos />} />
        <Route path="sin-datos" element={<SinDatos />} />

        <Route path="*" element={<HomePage />} /> 
      </Route>
      
      <Route path="*" element={<LoginPage />} /> 
    </Routes>
  );
}

export default App;