import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";

// Componentes que se usarán en las rutas
import SeleccionarInformeSinteticoSEC from "../Secretaria/SeleccionarInformeSinteticoSEC";
import PrevisualizarInformeSinteticoSec from "../Secretaria/PrevizualisarInformeSinteticoSec";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import EstadisticasSecDeco from "../Otros/EstadisticasSecDeco";

// Importamos el CSS institucional
import "./MenuSecretaria.css";

const BienvenidaYPendientes = () => {
  const navigate = useNavigate();
  const [informesFaltantes, setInformesFaltantes] = useState<number>(0);

  useEffect(() => {
    const obtenerCantidad = async () => {
      try {
        const res = await fetch("http://localhost:8080/informes-sinteticos/cantidad");
        if (!res.ok) throw new Error("Error al obtener datos");
        const data = await res.json();
        setInformesFaltantes(data);
      } catch (error) {
        console.error("No se pudo cargar la cantidad de informes:", error);
        setInformesFaltantes(0);
      }
    };
    obtenerCantidad();
  }, []);

  return (
    <div className="dashboard-header-container">
      <div className="bienvenida-box">
        <h1 className="welcome-title">
          <i className="fas fa-hand-sparkles"></i> Panel de Secretaría
        </h1>
        <p className="welcome-subtitle">
          ¡Bienvenido/a! Gestiona y previsualiza los informes sintéticos de autoevaluación.
        </p>
      </div>

      <div className="alerta-faltantes clickable-card" onClick={() => navigate("visualizar-ac")}>
        <div className="alerta-icono">
          <i className="fas fa-tasks"></i>
        </div>
        <div className="alerta-contenido">
          <p className="alerta-numero">{informesFaltantes}</p>
          <p className="alerta-texto">Seleccionar informe sintético</p>
          <button className="alerta-btn">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
};

const PlaceholderEstadisticas = () => {
  return (
    <div className="estadisticas-card">
      <h2 className="card-title">
        <i className="fas fa-chart-bar"></i> Remplazar por verdaderas estadisticas
      </h2>
      <EstadisticasSecDeco />
    </div>
  );
};

const SecretariaLayout = () => {
  return (
    <div className="secretaria-full-container">
      <main className="secretaria-content">
        <Outlet />
      </main>
    </div>
  );
};

const MenuSecretaria = () => {
  return (
    <Routes>
      <Route path="/" element={<SecretariaLayout />}>
        <Route
          index
          element={
            <div className="dashboard-main-view">
              <BienvenidaYPendientes />
              <PlaceholderEstadisticas />
            </div>
          }
        />
        <Route path="visualizar-ac" element={<SeleccionarInformeSinteticoSEC />} />
        <Route path="informe-sintetico/ver/:id" element={<PrevisualizarInformeSinteticoSec />} />
        <Route path="sin-datos" element={<SinDatos />} />
        <Route path="error" element={<ErrorCargaDatos />} />
      </Route>
    </Routes>
  );
};

export default MenuSecretaria;
