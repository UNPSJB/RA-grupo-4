import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import LoginPage from "./Componentes/LoginPage";
import SeleccionarEncuestas from "./Componentes/SeleccionarEncuestas";
import ListadoInformesACDoc from "./Componentes/ListadoInformesACDoc";
import SeleccionarInformeSinteticoSEC from "./Componentes/SeleccionarInformeSinteticoSEC";
import FiltradoInformeACDep from "./Componentes/FiltradoInformeACDep";
import ResponderEncuesta from "./Componentes/ResponderEncuesta";
import PaginaEstadisticasDoc from "./Componentes/PaginaEstadisticasDoc";
import HomePage from "./Componentes/HomePage";
import GenerarInformeACDoc from "./Componentes/GenerarInformeAC";
import GenerarInformeSinteticoDep from "./Componentes/GenerarInformeSinteticoDep";
import HistorialInformesACDoc from "./Componentes/HistorialInformesACDoc";
import VisualizarInformeACDoc from "./Componentes/VisualizarInformeACDoc";
import EstadisticasPreguntasPage from "./Componentes/EstadisticasPorPregunta";
import ListadoInformesACDep from "./Componentes/ListadoInformesACDep"; // ✅ NUEVO IMPORT

const DropdownMenu: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
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

      {/* Sistema principal */}
      <Route
        path="/home/*"
        element={
          <>
            {/* 🔹 NAVBAR PRINCIPAL */}
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
                  <Link to="/home/listado-informes-ac">Listado de Informes A.C</Link>
                  <Link to="/home/generar-sintetico">Generar Informe Sintético</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Secretaría">
                  <Link to="/home/informes-sinteticos">Informes Sintéticos</Link>
                </DropdownMenu>
              </div>

              <div className="navbar-right">
                <Link to="/">Cerrar sesión</Link>
              </div>
            </nav>

            {/* 🔹 CONTENIDO PRINCIPAL */}
            <div className="page-content">
              <Routes>
                <Route index element={<HomePage />} />
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                <Route path="listado-informes-ac" element={<ListadoInformesACDep />} /> {/* ✅ NUEVA RUTA */}

                <Route path="informes-doc" element={<ListadoInformesACDoc />} />
                <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
                <Route path="informes-sinteticos" element={<SeleccionarInformeSinteticoSEC />} />
                <Route path="estadisticas-docente" element={<PaginaEstadisticasDoc />} />
                <Route path="estadisticas-preguntas" element={<EstadisticasPreguntasPage />} />

                {/* Informes de docente */}
                <Route path="generar-informe" element={<GenerarInformeACDoc />} />
                <Route path="generar-informe/:id_materia" element={<GenerarInformeACDoc />} />

                <Route path="historial-informes" element={<HistorialInformesACDoc />} />
                <Route path="generar-sintetico" element={<GenerarInformeSinteticoDep />} />
                <Route path="visualizar-informe/:id_informe" element={<VisualizarInformeACDoc />} />
              </Routes>
            </div>

            {/* 🔹 FOOTER */}
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
