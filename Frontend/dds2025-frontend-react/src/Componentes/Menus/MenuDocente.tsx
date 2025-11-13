import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; 
import { ArrowLeft } from 'lucide-react';

import MenuDocenteIndex from './MenuDocenteIndex'; 

// --- IMPORTS DE COMPONENTES ---

// 1. El formulario de generación (se accederá desde la lista de pendientes)
import GenerarInformeAC from '../Docente/GenerarInformeAC';

// 2. Lista de PENDIENTES (El que muestra el tilde verde)
import ListadoInformesACDoc from '../Docente/ListadoInformesACDoc';

// 3. HISTORIAL REAL (El archivo que tenías para el historial)
import HistorialInformesACDoc from '../Docente/HistorialInformesACDoc';

import PaginaEstadisticasDoc from '../Docente/PaginaEstadisticasDoc';
import SinDatos from '../Otros/SinDatos'; 

const DocenteLayout = () => {
    const navigate = useNavigate();
    
    return (
        <div className="menu-alumno-container">
            <button onClick={() => navigate("/home/docente")} className="back-button"> 
                <ArrowLeft size={18} /> Regresar al Menú
            </button>

            <header className="menu-alumno-header">
                <h1 style={{ 
                    background: 'linear-gradient(135deg, var(--color-docente), #20c997)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Docentes
                </h1>
                <p>Gestión de Informes y Estadísticas de Cátedra.</p>
            </header>
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

const MenuDocente = () => {
    return (
        <Routes>
            <Route path="/" element={<DocenteLayout />}>
                
                <Route index element={<MenuDocenteIndex />} />
                
                {/* --- RUTAS ARREGLADAS --- */}
                
                {/* Tarjeta 1: "Informes Pendientes" carga el listado de pendientes */}
                <Route path="informes-pendientes" element={<ListadoInformesACDoc />} />
                
                {/* Tarjeta 2: "Historial" carga el historial real */}
                <Route path="historial-informes" element={<HistorialInformesACDoc />} />
                
                {/* Ruta para el formulario (se navega desde dentro de pendientes) */}
                <Route path="generar-informe" element={<GenerarInformeAC />} />
                
                <Route path="estadisticas" element={<PaginaEstadisticasDoc />} />
                <Route path="mi-perfil" element={<SinDatos />} />
                
            </Route>
        </Routes>
    );
};

export default MenuDocente;