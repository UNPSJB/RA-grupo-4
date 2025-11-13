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
import MenuDepartamento from "./Componentes/Menus/MenuDepartamento"; 
import MenuSecretaria from "./Componentes/Menus/MenuSecretaria";

/**
 * Layout principal con Navbar y Footer
 */
const MainLayout = () => (
  <>
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="site-name">Sistema de Encuestas UNPSJB</Link>
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

        {/* Fallback interno */}
        <Route path="*" element={<HomePage />} />
      </Route>

      {/* Fallback general */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
