import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import LoginPage from "./Componentes/LoginPage";
// import HistorialEncuestasRealizadasEstudiante from "./Componentes/HistorialEncuestasRealizadasEstudiante";
// import EncuestasList from "./Componentes/EncuestasList";
// import AgregarPreguntaAEncuesta from "./Componentes/AgregarPreguntaAEncuesta";
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

// --- AÑADIDO: Importamos el nuevo componente de bienvenida ---
import HomePage from "./Componentes/HomePage";


// --- COMPONENTE REUTILIZABLE PARA EL MENÚ DESPLEGABLE ---
const DropdownMenu: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Efecto para cerrar el menú si se hace clic fuera de él
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
          {/* Cerramos el menú al hacer clic en un enlace */}
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
                  {/* <Link to="/home/encuestas">Encuestas</Link>
                  <Link to="/home/agregar-pregunta">Agregar Pregunta</Link>
                  <Link to="/home/historial">Historial</Link> */}
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Secretaría">
                  <Link to="/home/informes-sinteticos">Informes Sintéticos</Link>
                </DropdownMenu>

                <DropdownMenu title="Funcionalidades Docente">
                  <Link to="/home/informes-doc">Informes Docente</Link>
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
                {/* --- CAMBIO: La página de inicio ahora es HomePage --- */}
                <Route
                  index
                  element={<HomePage />}
                />
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                {/* <Route path="encuestas" element={<EncuestasList />} />
                <Route
                  path="agregar-pregunta"
                  element={<AgregarPreguntaAEncuesta idEncuesta={1} />}
                />
                <Route
                  path="historial"
                  element={<HistorialEncuestasRealizadasEstudiante studentId={1} />}
                /> */}
                <Route path="informes-dep" element={<ListadoInformesACDep />} />
                <Route path="informes-doc" element={<ListadoInformesACDoc />} />
                <Route path="mostrar-encuesta/:encuestaId" element={<MostrarEncuesta estudianteId={1} encuestaId={1} />} />
                <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta estudianteId={1} inscripcionId={1} encuestaId={1} />} />
                <Route path="informes-sinteticos" element={<SeleccionarInformeSinteticoSEC />} />
                <Route path="estadisticas/:materiaId" element={<PaginaEstadisticasDoc />} />
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