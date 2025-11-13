import React from "react";
import { Routes, Route, useNavigate, Outlet, NavLink } from "react-router-dom";

// Componentes que se usarán en las rutas
import SeleccionarInformeSinteticoSEC from "../Secretaria/SeleccionarInformeSinteticoSEC";
import PrevisualizarInformeSinteticoSec from "../Secretaria/PrevizualisarInformeSinteticoSec";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

// Importamos el CSS
import "./MenuSecretaria.css";

// --- Componente Placeholder para Estadísticas ---
const PlaceholderEstadisticas = () => {
  return (
    <div className="placeholder-proximo">
      <h3>Estadísticas (Próxima Implementación)</h3>
      <p>En esta sección se mostrarán las estadísticas generales del departamento.</p>
    </div>
  );
};

// --- COMPONENTE LAYOUT (Contenedor principal) ---
// Este componente ahora es el contenedor principal de ancho completo
const SecretariaLayoutAncho = () => {
  return (
    // Contenedor principal de ancho completo
    <div className="secretaria-full-container"> 
      
      {/* === BARRA DE NAVEGACIÓN (PESTAÑAS) === */}
      {/* Esta es la barra que pidaste arriba del todo */}
      <nav className="secretaria-nav-full">
        <NavLink 
          to="." 
          end 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Panel Principal
        </NavLink>
        <NavLink 
          to="visualizar-ac" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Previsualizar informes sinteticos
        </NavLink>
        {/* Puedes añadir más pestañas aquí en el futuro */}
      </nav>

      <main className="secretaria-content">
        {/* Aquí se renderiza la pestaña activa */}
        <Outlet /> 
      </main>
    </div>
  );
};

// --- DEFINICIÓN DE RUTAS DE SECRETARÍA ---
const MenuSecretaria = () => {
  return (
    <Routes>
      {/* El path="/" ahora usa el nuevo layout de ancho completo */}
      <Route path="/" element={<SecretariaLayoutAncho />}>
        
        {/* Pestaña 1: Panel Principal (Ruta principal/index)
          Como pediste, muestra las estadísticas Y la lista de informes.
        */}
        <Route 
          index 
          element={
            <>
              <PlaceholderEstadisticas />
              <SeleccionarInformeSinteticoSEC />
            </>
          } 
        />
        
        {/* Pestaña 2: Visualizar Informes AC (Placeholder) */}
        <Route 
          path="visualizar-ac" 
          element={
            <div style={{ padding: '1rem' }}>
            <PrevisualizarInformeSinteticoSec/>
            {/* <SinDatos mensaje="Próxima implementación: Aquí se mostrará el listado de Informes de Autoevaluación de Cátedra (AC)." /> */}
            </div>
          } 
        />
        
        {/* Ruta para ver un informe sintético específico (esta ruta no tiene pestaña) */}
        <Route path="informe-sintetico/ver/:id" element={<PrevisualizarInformeSinteticoSec />} />
        
        {/* Rutas de fallback */}
        <Route path="sin-datos" element={<SinDatos />} />
        <Route path="error" element={<ErrorCargaDatos />} />
      </Route>
    </Routes>
  );
};

export default MenuSecretaria;