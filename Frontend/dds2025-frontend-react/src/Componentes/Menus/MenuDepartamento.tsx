import React from 'react';
import { Routes, Route, useNavigate, Outlet, Link } from 'react-router-dom';
import './MenuDepartamento.css'; 
import { ArrowLeft } from 'lucide-react';
import MenuDepartamentoIndex from './MenuDepartamentoIndex';
import GenerarInformeSinteticoDep from '../Departamento/GenerarInformeSinteticoDep';
import ListadoInformesACDepREAL from '../Departamento/ListadoInformesACDepREAL';
import EstadisticasPorPregunta from '../Departamento/EstadisticasPorPregunta';
import SinDatos from '../Otros/SinDatos'; 

/* * Layout del Departamento: 
 * Muestra el fondo de la página y el botón de regresar.
 */
const DepartamentoLayout = () => {
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

/* * Router del Departamento: 
 * Define qué página se muestra dentro del Layout.
 */
const MenuDepartamento = () => {
    return (
        <Routes>
            <Route path="/" element={<DepartamentoLayout />}>
                
                <Route index element={<MenuDepartamentoIndex />} /> 
                
                <Route path="generar-informe-sintetico" element={<GenerarInformeSinteticoDep />} />
                <Route path="historial-informes" element={<ListadoInformesACDepREAL />} />
                <Route path="estadisticas" element={<EstadisticasPorPregunta />} />
                <Route path="configuracion" element={<SinDatos />} />
                
            </Route>
        </Routes>
    );
};

export default MenuDepartamento;