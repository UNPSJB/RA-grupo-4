import React from 'react';
import { Routes, Route, useNavigate, Outlet, Link } from 'react-router-dom';
import './MenuDocente.css'; 
import { ArrowLeft } from 'lucide-react';

// --- Imports de las páginas ---
import MenuDocenteIndex from './MenuDocenteIndex'; 
import GenerarInformeAC from '../Docente/GenerarInformeAC';
import ListadoInformesACDoc from '../Docente/ListadoInformesACDoc';
import HistorialInformesACDoc from '../Docente/HistorialInformesACDoc';
import PaginaEstadisticasDoc from '../Docente/PaginaEstadisticasDoc';
import SinDatos from '../Otros/SinDatos'; 
// --- 👇 1. IMPORTAMOS EL VISUALIZADOR ---
import VisualizarInformeACDoc from '../Docente/VisualizarInformeACDoc';

const DocenteLayout = () => {
    return (
        <div className="dashboard-layout-full">
            <div className="back-button-bar">
                <Link to="/home" className="back-button-link">
                    <ArrowLeft size={18} />
                    Regresar al Inicio
                </Link>
            </div>
            <div className="dashboard-content">
                <Outlet /> 
            </div>
        </div>
    );
};

const MenuDocente = () => {
    return (
        <Routes>
            <Route path="/" element={<DocenteLayout />}>
                
                <Route index element={<MenuDocenteIndex />} /> 
                
                <Route path="generar-informe/:idMateria" element={<GenerarInformeAC />} />
                <Route path="informes-pendientes" element={<ListadoInformesACDoc />} />
                <Route path="historial-informes" element={<HistorialInformesACDoc />} />
                <Route path="estadisticas" element={<PaginaEstadisticasDoc />} />
                <Route path="mi-perfil" element={<SinDatos />} />

                {/* --- 👇 2. AGREGAMOS LA RUTA QUE FALTABA 👇 --- */}
                <Route path="visualizar-informe/:id_informe" element={<VisualizarInformeACDoc />} />

            </Route>
        </Routes>
    );
};

export default MenuDocente;