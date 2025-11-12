import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; 
import { ArrowLeft } from 'lucide-react';
import MenuAlumnoIndex from './MenuAlumnoIndex';
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import SinDatos from '../Otros/SinDatos';
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';

const AlumnoLayout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="menu-alumno-container">
      {/* --- BOTÓN REGRESAR --- */}
      <button onClick={() => navigate("/home")} className="back-button">
        <ArrowLeft size={18} /> Regresar al Inicio
      </button>

      <header className="menu-alumno-header">
        <h1>Home Alumno</h1>
        <p>Bienvenido. ¿Qué te gustaría hacer hoy?</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const MenuAlumno = () => {
  return (
    <Routes>
      {/* La ruta base (/home/alumno) usa AlumnoLayout */}
      <Route path="/" element={<AlumnoLayout />}>

        <Route index element={<MenuAlumnoIndex />} />
        
        <Route path="seleccionar" element={<SeleccionarEncuestas />} />
        <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
        
        {/* Rutas de ejemplo */}
        <Route path="historial-encuestas" element={<SinDatos />} />
        <Route path="mis-materias" element={<SinDatos />} />

        
      </Route>
    </Routes>
  );
};

export default MenuAlumno;