import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

// --- IMPORTACIONES DE IMÁGENES ---
import logoUnpsjb from "./assets/logo_unpsjb.png";
import userAvatar from "./assets/avatarOA.png";

// Componentes de autenticación y generales
import LoginPage from "./Componentes/Otros/LoginPage";
import HomePage from "./Componentes/Otros/HomePage";
import ErrorCargaDatos from "./Componentes/Otros/ErrorCargaDatos";
import SinDatos from "./Componentes/Otros/SinDatos";

// Componentes de Alumno
import SeleccionarEncuestas from "./Componentes/Estudiante/SeleccionarEncuestas";
import ResponderEncuesta from "./Componentes/Estudiante/ResponderEncuesta";

// Componentes de Docente
import ListadoInformesACDoc from "./Componentes/Docente/ListadoInformesACDoc";
import HistorialInformesACDoc from "./Componentes/Docente/HistorialInformesACDoc";
import PaginaEstadisticasDoc from "./Componentes/Docente/PaginaEstadisticasDoc";
import EstadisticasPreguntasPage from "./Componentes/Departamento/EstadisticasPorPregunta";
import GenerarInformeACDoc from "./Componentes/Docente/GenerarInformeAC";
import VisualizarInformeACDoc from "./Componentes/Docente/VisualizarInformeACDoc";

// Componentes de Departamento
import ListadoInformesACDepREAL from "./Componentes/ListadoInformesACDepREAL";
import GenerarInformeSinteticoDep from "./Componentes/Departamento/GenerarInformeSinteticoDep";
// Componentes de Secretaría
import SeleccionarInformeSinteticoSEC from "./Componentes/Secretaria/SeleccionarInformeSinteticoSEC";

// --- Componente auxiliar para el menú desplegable ---
const DropdownMenu: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="dropdown-button">
        {title}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, { onClick: closeDropdown } as React.Attributes)
              : child
          )}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Página de login */}
      <Route path="/" element={<LoginPage />} />

      {/* Estructura principal */}
      <Route
        path="/home/*"
        element={
          <>
            <nav className="navbar">
              <div className="navbar-left">
                {/* --- LOGO UNPSJB --- */}
                <img src={logoUnpsjb} alt="Logo UNPSJB" className="navbar-logo" />
                <span className="site-name">Sistema de encuestas UNPSJB</span>
              </div>

              <div className="navbar-links">
                <DropdownMenu title="Funcionalidades Alumno">
                  <Link to="/home/seleccionar">Seleccionar Encuestas</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Docente">
                  <Link to="/home/informes-doc">Informes Pendientes</Link>
                  <Link to="/home/historial-informes">Historial de Informes</Link>
                  <Link to="/home/estadisticas-docente">Ver Estadísticas Materias</Link>
                  <Link to="/home/estadisticas-preguntas">Ver Estadísticas de preguntas</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Departamento">
                  <Link to="/home/listado-informes-ac">Gestión Informes A.C.</Link>
                  <Link to="/home/generar-sintetico">Generar informe Sintetico</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Secretaría">
                  <Link to="/home/informes-sinteticos">Informes Sintéticos</Link>
                </DropdownMenu>
              </div>

              <div className="navbar-right">
                {/* --- AVATAR DE USUARIO --- */}
                <img src={userAvatar} alt="Avatar Usuario" className="user-avatar" />
                <Link to="/">Cerrar sesión</Link>
              </div>
            </nav>

            <div className="page-content">
              <Routes>
                <Route index element={<HomePage />} />

                {/* Rutas de Alumno */}
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />

                {/* Rutas de Docente */}
                <Route path="informes-doc" element={<ListadoInformesACDoc />} />
                <Route path="historial-informes" element={<HistorialInformesACDoc />} />
                <Route path="estadisticas-docente" element={<PaginaEstadisticasDoc />} />
                <Route path="estadisticas-preguntas" element={<EstadisticasPreguntasPage />} />
                <Route path="generar-informe" element={<GenerarInformeACDoc />} />
                <Route path="generar-informe/:id_materia" element={<GenerarInformeACDoc />} />
                <Route path="visualizar-informe/:id_informe" element={<VisualizarInformeACDoc />} />

                {/* Rutas de Departamento */}
                <Route path="listado-informes-ac" element={<ListadoInformesACDepREAL />} />
                <Route path="generar-sintetico" element={<GenerarInformeSinteticoDep />} />

                {/* Rutas de Secretaría */}
                <Route path="informes-sinteticos" element={<SeleccionarInformeSinteticoSEC />} />

                {/* Rutas de Error/Info */}
                <Route path="error" element={<ErrorCargaDatos />} />
                <Route path="sin-datos" element={<SinDatos />} />
              </Routes>
            </div>

            <footer className="footer">
              © 2025 HP TEAM — Sistema de encuestas UNPSJB
            </footer>
          </>
        }
      />
    </Routes>
  );
}

export default App;