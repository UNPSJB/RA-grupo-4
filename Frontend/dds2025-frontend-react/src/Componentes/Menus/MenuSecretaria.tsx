import React from "react";
import { Routes, Route, useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, List, Hand, ChartBar, Table } from 'lucide-react'; 

// Importación de componentes de Secretaría
import SeleccionarInformeSinteticoSEC from "../Secretaria/SeleccionarInformeSinteticoSEC";
import PrevisualizarInformeSinteticoSec from "../Secretaria/PrevizualisarInformeSinteticoSec";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import EstadisticasPromedioDocentes from "../Secretaria/EstadisticasDocentes";
import ListarInformesSinteticos from "../Secretaria/ListarInformesSinteticos"; 
import MiniEstadisticasSec from "../Secretaria/MiniEstadisticasSec"; 

// Importar CSS Aislado
import "./MenuSecretaria.css"; 

// ---------------------------------------------------
// 1. Componentes Internos del Dashboard
// ---------------------------------------------------

const TarjetaSeleccionarInformes = () => {
    // Lógica interna simple para el ejemplo
    const hasInformes = true; 
    
    if (hasInformes) {
        return <SeleccionarInformeSinteticoSEC />; 
    } 
    return <SinDatos mensaje="No hay informes sintéticos pendientes." />;
};

const SecretariaDashboard = ({ secretariaId }) => {
    const navigate = useNavigate();

    return (
        <div className="secretaria-dashboard-wrapper">
            
            {/* 1. Cabecera */}
            <div className="secretaria-header-grid">
                <aside className="secretaria-welcome-card">
                    <h1 className="secretaria-title">
                        <Hand size={28} /> Panel de Secretaría
                    </h1>
                    <p className="secretaria-subtitle">
                        Administración y revisión de informes docentes.
                    </p>
                </aside>
                <div className="secretaria-stats-wrapper">
                    <MiniEstadisticasSec/>
                </div>
            </div>

            {/* 2. Sección Principal */}
            <div className="secretaria-section">
                <h2 className="secretaria-section-title">
                    <FileText size={22} /> Informes Pendientes de Revisión
                </h2>
                <TarjetaSeleccionarInformes />
            </div>

            {/* 3. Navegación Rápida */}
            <div className="secretaria-section">
                <h2 className="secretaria-section-title">
                    <List size={22} /> Gestión y Estadísticas
                </h2>
                <div className="secretaria-cards-grid">
                    
                    {/* Tarjeta: Estadísticas */}
                    <div className="secretaria-nav-card sec-card-purple" onClick={() => navigate("estadisticas-docentes")}>
                        <ChartBar size={34} />
                        <h3>Estadísticas Docentes</h3>
                        <p>Visualizar métricas de desempeño y promedios generales.</p>
                    </div>
                    
                    {/* Tarjeta: Listado Completo */}
                    <div className="secretaria-nav-card sec-card-blue" onClick={() => navigate("listar-informes")}>
                        <Table size={34} />
                        <h3>Listado de Informes</h3>
                        <p>Acceder al histórico y tabla completa de informes sintéticos.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------
// 2. Layout de Secretaría
// ---------------------------------------------------

const SecretariaLayout = () => {
    const location = useLocation(); 
    const esDashboard = location.pathname === '/home/secretaria' || location.pathname === '/home/secretaria/';
    const rutaDestino = esDashboard ? '/home' : '/home/secretaria';

    return (
        <div className="menu-secretaria-layout-full">
            <div className="sec-back-bar">
                <NavLink to={rutaDestino} className="sec-back-link">
                    <ArrowLeft size={18} /> {esDashboard ? "Inicio General" : "Volver al Panel"}
                </NavLink>
            </div>
            <main className="menu-secretaria-content">
                <Outlet />
            </main>
        </div>
    );
};

// ---------------------------------------------------
// 3. Router Principal Secretaría
// ---------------------------------------------------

const MenuSecretaria = () => {
    const secretariaId = 1; // ID simulado o por contexto

    return (
        <Routes>
            <Route path="/" element={<SecretariaLayout />}>
                <Route index element={<SecretariaDashboard secretariaId={secretariaId} />} />
                
                {/* Rutas Hijas */}
                <Route path="listar-informes" element={<ListarInformesSinteticos />} /> 
                <Route path="informe-sintetico/ver/:id" element={<PrevisualizarInformeSinteticoSec />} />
                <Route path="estadisticas-docentes" element={<EstadisticasPromedioDocentes />} /> 
                <Route path="visualizar-ac" element={<SeleccionarInformeSinteticoSEC />} />
                <Route path="error" element={<ErrorCargaDatos />} />
                <Route path="sin-datos" element={<SinDatos />} />
            </Route>
        </Routes>
    );
};

export default MenuSecretaria;