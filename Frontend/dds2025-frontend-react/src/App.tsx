import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import LoginPage from "./Componentes/LoginPage";
import SeleccionarEncuestas from "./Componentes/SeleccionarEncuestas";
import ListadoInformesACDep from "./Componentes/ListadoInformesACDep";
import ListadoInformesACDoc from "./Componentes/ListadoInformesACDoc";
import HistorialEncuestasRealizadasEstudiante from "./Componentes/HistorialEncuestasRealizadasEstudiante";
import EncuestasList from "./Componentes/EncuestasList";
import AgregarPreguntaAEncuesta from "./Componentes/AgregarPreguntaAEncuesta";

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
                <Link to="/home/seleccionar">Seleccionar Encuestas</Link>
                <Link to="/home/encuestas">Encuestas</Link>
                <Link to="/home/agregar-pregunta">Agregar Pregunta</Link>
                <Link to="/home/historial">Historial</Link>
                <Link to="/home/informes-dep">Informes Dept.</Link>
                <Link to="/home/informes-doc">Informes Docente</Link>
              </div>
              <div className="navbar-right">
                <Link to="/">Cerrar sesión</Link>
              </div>
            </nav>

            <div className="page-content">
              <Routes>
                <Route
                  index
                  element={<Navigate to="/home/seleccionar" replace />}
                />
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                <Route path="encuestas" element={<EncuestasList />} />
                <Route
                  path="agregar-pregunta"
                  element={<AgregarPreguntaAEncuesta idEncuesta={1}/>}
                />
                <Route
                  path="historial"
                  element={<HistorialEncuestasRealizadasEstudiante studentId={1} />}
                />
                <Route
                  path="informes-dep"
                  element={<ListadoInformesACDep />}
                />
                <Route
                  path="informes-doc"
                  element={<ListadoInformesACDoc />}
                />
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
