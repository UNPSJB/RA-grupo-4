import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import LoginPage from "./Componentes/LoginPage";
import SeleccionarEncuestas from "./Componentes/SeleccionarEncuestas";
import ListadoInformesACDoc from "./Componentes/ListadoInformesACDoc";
import SeleccionarInformeSinteticoSEC from "./Componentes/SeleccionarInformeSinteticoSEC";
import HistorialEncuestasRealizadasEstudiante from "./Componentes/HistorialEncuestasRealizadasEstudiante";
import EncuestasList from "./Componentes/EncuestasList";
import AgregarPreguntaAEncuesta from "./Componentes/AgregarPreguntaAEncuesta";
import ListadoInformesACDep from "./Componentes/ListadoInformesACDep";
import ListarInformesSinteticos from "./Componentes/ListarInformesSinteticos";
import MostrarEncuesta from "./Componentes/MostrarEncuesta";
import ResponderEncuesta from "./Componentes/ResponderEncuesta";
import PaginaEstadisticasDoc from "./Componentes/PaginaEstadisticasDoc";
import HomePage from "./Componentes/HomePage";

import GenerarInformeACDoc from "./Componentes/GenerarInformeAC";


// --- COMPONENTE REUTILIZABLE PARA EL MENÚ DESPLEGABLE ---
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
          {React.Children.map(children, child =>
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
            <nav className="navbar">
              <div className="navbar-left">
                <span className="site-name">Sistema de encuestas UNPSJB</span>
              </div>
              
              <div className="navbar-links">
                
                <DropdownMenu title="Funcionalidades Alumno">
                  <Link to="/home/seleccionar">Seleccionar Encuestas</Link>
                  <Link to="/home/mostrar-encuesta/1">Mostrar Preguntas Encuesta</Link>
                  <Link to="/home/responder-encuesta/1">Responder Encuesta</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Secretaría">
                  <Link to="/home/informes-sinteticos">Informes Sintéticos</Link>
                </DropdownMenu>

                {/* --- MODIFICADO: 2. Añadir el Link --- */}
                <DropdownMenu title="Funcionalidades Docente">
                  <Link to="/home/informes-doc">Listar Informes</Link>
                  <Link to="/home/generar-informe">Generar Informe AC</Link>
                  <Link to="/home/estadisticas/1">Estadísticas (Materia 1)</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Departamento">
                   <Link to="/home/informes-dep">Informes Dept.</Link>
                </DropdownMenu>

              </div>

              <div className="navbar-right">
                <Link to="/">Cerrar sesión</Link>
              </div>
            </nav>

            <div className="page-content">
              <Routes>
                <Route
                  index
                  element={<HomePage />}
                />
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                <Route path="informes-dep" element={<ListadoInformesACDep />} />
                <Route path="informes-doc" element={<ListadoInformesACDoc />} />
                <Route path="mostrar-encuesta/:encuestaId" element={<MostrarEncuesta estudianteId={1} encuestaId={1} />} />
                <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta estudianteId={1} inscripcionId={1} encuestaId={1} />} />
                <Route path="informes-sinteticos" element={<SeleccionarInformeSinteticoSEC />} />
                <Route path="estadisticas/:materiaId" element={<PaginaEstadisticasDoc />} />

                <Route path="generar-informe" element={<GenerarInformeACDoc />} />
              
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