import React, { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, List, Hand, ChartBar, Table, AlertTriangle } from 'lucide-react'; 

// Componentes que se usarán en las rutas
import SeleccionarInformeSinteticoSEC from "../Secretaria/SeleccionarInformeSinteticoSEC";
import PrevisualizarInformeSinteticoSec from "../Secretaria/PrevizualisarInformeSinteticoSec";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import EstadisticasPromedioDocentes from "../Secretaria/EstadisticasDocentes";
import ListarInformesSinteticos from "../Secretaria/ListarInformesSinteticos"; 
import MiniEstadisticasSec from "../Secretaria/MiniEstadisticasSec"; 

import "./MenuSecretaria.css"; 

// ---------------------------------------------------
// 1. Componentes Requeridos para el Dashboard
// ---------------------------------------------------

const Bienvenida = () => {
    return (
        <aside className="bienvenida-box">
            <h1 className="welcome-title"><Hand size={30} className="hand-icon" /> Panel de Secretaría</h1>
            <p className="panel-subtitle">Gestiona y administra los informes de autoevaluación docente.</p>
        </aside>
    );
};

const TarjetaSeleccionarInformes = () => {
    // Simulación de datos exitosa para la demo visual
    const hasInformes = true;
    const isLoading = false;

    if (isLoading) {
        return (
            <div className="estadisticas-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#ccc' }}></i>
            </div>
        );
    }
    
    if (hasInformes) {
        // SeleccionarInformeSinteticoSEC ya implementa el diseño de lista de tarjetas
        return (
            <SeleccionarInformeSinteticoSEC /> 
        );
    } 
    
    return (
        <SinDatos mensaje="No hay informes sintéticos pendientes de revisión." />
    );
};


const SecretariaDashboard = ({ secretariaId }) => {
    const navigate = useNavigate();
    return (
        <div className="dashboard-main-view">
            {/* 1. CABECERA: BIENVENIDA Y MINI ESTADÍSTICAS */}
            <div className="dashboard-header-container">
                <Bienvenida />
                {/* ➡️ Mini Estadísticas: Usa card-box como wrapper exterior para consistencia */}
                <div className="estadisticas-box card-box">
                    algo voy a poner
                </div>
            </div>

            {/* 2. CONTENIDO PRINCIPAL: INFORMES PENDIENTES */}
            <div className="seccion-box informes-principales"> 
                <h2 className="seccion-title"><FileText size={20} /> Informes Pendientes de Revisión</h2>
                <TarjetaSeleccionarInformes />
            </div>

            {/* 3. NAVEGACIÓN SECUNDARIA / ACCESO RÁPIDO */}
            <div className="seccion-box navegacion-secundaria">
                <h2 className="seccion-title"><List size={20} /> Navegación y Acceso Rápido</h2>
                <div className="card-grid">
                    
                    {/* Tarjeta 1: Estadísticas Docentes */}
                    <div className="nav-card card-purple" onClick={() => navigate("estadisticas-docentes")}>
                        <ChartBar size={36} />
                        <h3>Estadísticas Docentes</h3>
                        <p>Ver promedios y métricas de desempeño general.</p>
                    </div>
                    
                    {/* Tarjeta 2: Listar Informes */}
                    <div className="nav-card card-blue" onClick={() => navigate("listar-informes")}>
                        <Table size={36} />
                        <h3>Listar Informes</h3>
                        <p>Ver la tabla completa de informes sintéticos disponibles.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------
// 2. Layout y Rutas Principales
// ---------------------------------------------------

const SecretariaLayout = () => {
    const location = useLocation(); 
    const esDashboard = location.pathname === '/home/secretaria' || location.pathname === '/home/secretaria/';
    const rutaDestino = esDashboard ? '/home' : '/home/secretaria';

    return (
        <div className="menu-alumno-layout-full"> 
            <div className="back-button-bar"> 
                <NavLink to={rutaDestino} className="back-button-link">
                    <ArrowLeft size={18} /> Regresar al Inicio
                </NavLink>
            </div>
            <main className="menu-alumno-content"> 
                <Outlet />
            </main>
        </div>
    );
};

const MenuSecretaria = () => {
    const secretariaId = 1; 

    return (
        <Routes>
            <Route path="/" element={<SecretariaLayout />}>
                <Route index element={<SecretariaDashboard secretariaId={secretariaId} />} />
                
                <Route path="listar-informes" element={<ListarInformesSinteticos />} /> 
                <Route path="informe-sintetico/ver/:id" element={<PrevisualizarInformeSinteticoSec />} />
                <Route path="estadisticas-docentes" element={<EstadisticasPromedioDocentes />} /> 
                
                <Route path="error" element={<ErrorCargaDatos />} />
                <Route path="sin-datos" element={<SinDatos />} />
                <Route path="visualizar-ac" element={<SeleccionarInformeSinteticoSEC />} />
            </Route>
        </Routes>
    );
};

export default MenuSecretaria;