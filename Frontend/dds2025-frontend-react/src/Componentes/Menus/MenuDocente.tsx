import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; 
import { ArrowLeft } from 'lucide-react';
import MenuDocenteIndex from './MenuDocenteIndex'; 
import GenerarInformeAC from '../Docente/GenerarInformeAC'; 
import ListadoInformesACDoc from '../Docente/ListadoInformesACDoc';
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
        <h1>Home Docente</h1>
        <p>Bienvenido. ¿Qué te gustaría hacer hoy?</p>
      </header>
      <main>
        <Outlet /> 
      </main>
    </div>
  );
};

/**
 * 2. El router anidado
 */
const MenuDocente = () => {
  return (
    <Routes>
      <Route path="/" element={<DocenteLayout />}>
        <Route index element={<MenuDocenteIndex />} />
        <Route path="generar-informe" element={<GenerarInformeAC />} /> 
        <Route path="historial-informes" element={<ListadoInformesACDoc />} />
        <Route path="estadisticas" element={<PaginaEstadisticasDoc />} />
        <Route path="mi-perfil" element={<SinDatos />} />
      </Route>
    </Routes>
  );
};

export default MenuDocente;