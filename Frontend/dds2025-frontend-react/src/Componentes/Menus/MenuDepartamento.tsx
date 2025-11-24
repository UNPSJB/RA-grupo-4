import React from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom'; 
import './MenuDepartamento.css'; 
import { ArrowLeft } from 'lucide-react';
import MenuDepartamentoIndex from './MenuDepartamentoIndex';
import GenerarInformeSinteticoDep from '../Departamento/GenerarInformeSinteticoDep';
import ListadoInformesACDepREAL from '../Departamento/ListadoInformesACDepREAL';
import SinDatos from '../Otros/SinDatos'; 
import SeleccionarMateriaEstadisticasDep from '../Departamento/SeleccionarMateriaEstadisticasDep';
import EstadisticasPorPreguntaDep from '../Departamento/EstadisticasPorPreguntaDep';

/* * Layout del Departamento: 
 * Muestra el fondo de la página y el botón de regresar con lógica dinámica.
 */
const DepartamentoLayout = () => {
    const location = useLocation(); 

    const esDashboard = location.pathname === '/home/departamento' || location.pathname === '/home/departamento/';

    const rutaDestino = esDashboard ? '/home' : '/home/departamento';

    return (
        <div className="dashboard-layout-full"> 
            
            <div className="back-button-bar"> 
                <Link to={rutaDestino} className="back-button-link">
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

/* * Router del Departamento: 
 * Define qué página se muestra dentro del Layout.
 */
const MenuDepartamento = () => {
    return (
        <Routes>
            <Route path="/" element={<DepartamentoLayout />}>
                
                {/* Dashboard Principal */}
                <Route index element={<MenuDepartamentoIndex />} /> 
                
                {/* Gestión de Informes */}
                <Route path="generar-informe-sintetico" element={<GenerarInformeSinteticoDep />} />
                <Route path="historial-informes" element={<ListadoInformesACDepREAL />} />

                {/* Estadisticas */}
                <Route path="estadisticas" element={<SeleccionarMateriaEstadisticasDep />} />
                <Route path="estadisticas/materia/:asignaturaId" element={<EstadisticasPorPreguntaDep />} />

                <Route path="configuracion" element={<SinDatos />} />
                
            </Route>
        </Routes>
    );
};

export default MenuDepartamento;