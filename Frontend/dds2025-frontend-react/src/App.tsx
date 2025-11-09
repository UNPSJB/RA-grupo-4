import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Componentes de autenticación y generales
import LoginPage from "./Componentes/LoginPage";
import HomePage from "./Componentes/HomePage";
import ErrorCargaDatos from "./Componentes/ErrorCargaDatos";
import SinDatos from "./Componentes/SinDatos";

// Componentes de Alumno
import SeleccionarEncuestas from "./Componentes/SeleccionarEncuestas";
import ResponderEncuesta from "./Componentes/ResponderEncuesta";

// Componentes de Docente
import ListadoInformesACDoc from "./Componentes/ListadoInformesACDoc";
import HistorialInformesACDoc from "./Componentes/HistorialInformesACDoc";
import PaginaEstadisticasDoc from "./Componentes/PaginaEstadisticasDoc";
import EstadisticasPreguntasPage from "./Componentes/EstadisticasPorPregunta";
import GenerarInformeACDoc from "./Componentes/GenerarInformeAC";
import VisualizarInformeACDoc from "./Componentes/VisualizarInformeACDoc";

// Componentes de Departamento
import FiltradoInformeACDep from "./Componentes/Departamento/FiltradoInformeACDep";
import ListadoInformesACDep from "./Componentes/Departamento/ListadoInformesACDep";
import GenerarInformeSinteticoDep from "./Componentes/GenerarInformeSinteticoDep";

// Componentes de Secretaría
import SeleccionarInformeSinteticoSEC from "./Componentes/SeleccionarInformeSinteticoSEC";

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
      {/* Página de login (fuera de la estructura principal) */}
      <Route path="/" element={<LoginPage />} />

      {/* Estructura principal del sistema con Navbar */}
      <Route
        path="/home/*"
        element={
          <>
            <nav className="navbar">
              <div className="navbar-left">
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
                  <Link to="/home/informes-dep">Informes Dept.</Link>
                  <Link to="/home/generar-sintetico">Generar informe Sintetico</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Secretaría">
                  <Link to="/home/informes-sinteticos">Informes Sintéticos</Link>
                </DropdownMenu>
              </div>

              <div className="navbar-right">
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
                {/* Se mantienen ambas rutas para GenerarInformeACDoc por compatibilidad */}
                <Route path="generar-informe" element={<GenerarInformeACDoc />} />
                <Route path="generar-informe/:id_materia" element={<GenerarInformeACDoc />} />
                <Route path="visualizar-informe/:id_informe" element={<VisualizarInformeACDoc />} />

                {/* Rutas de Departamento */}
                <Route path="informes-dep" element={<FiltradoInformeACDep />} />
                <Route path="listado-informes-ac" element={<ListadoInformesACDep />} />
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