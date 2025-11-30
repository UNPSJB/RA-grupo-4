import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; // Importa el CSS "WOW"
import { ArrowLeft } from 'lucide-react';

// --- ¡AQUÍ IMPORTAS TUS COMPONENTES! ---
// Estos componentes solo los conoce MenuAlumno, no App.tsx
import MenuAlumnoIndex from './MenuAlumnoIndex'; // El menú de tarjetas "WOW"
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';
import SinDatos from '../Otros/SinDatos'; // Para las rutas de ejemplo

/**
 * Este es el Layout de la sección Alumno.
 * Muestra el header, el botón de regresar, y el <Outlet>
 * donde se renderizarán las rutas anidadas (Index, Seleccionar, etc.)
 */
const AlumnoLayout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="menu-alumno-container">
      {/* --- BOTÓN REGRESAR --- */}
      <button onClick={() => navigate("/home")} className="back-button">
        <ArrowLeft size={18} /> Regresar al Inicio
      </button>

      <header className="menu-alumno-header">
        <h1>Portal del Alumno</h1>
        <p>Bienvenido. ¿Qué te gustaría hacer hoy?</p>
      </header>

      {/* --- AQUÍ SE RENDERIZA LA RUTA HIJA --- */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

/**
 * Este es el componente principal que exportas.
 * Define TODAS las rutas anidadas para la sección /alumno/*
 */
const MenuAlumno = () => {
  return (
    <Routes>
      {/* La ruta base (/home/alumno) usa AlumnoLayout */}
      <Route path="/" element={<AlumnoLayout />}>
        
        {/* La ruta índice (/home/alumno/) muestra el menú de tarjetas "WOW" */}
        <Route index element={<MenuAlumnoIndex />} />
        
        {/* El resto de las rutas se renderizan DENTRO del <Outlet> de AlumnoLayout */}
        <Route path="seleccionar" element={<SeleccionarEncuestas />} />
        <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
        
        {/* Rutas de ejemplo */}
        <Route path="historial-encuestas" element={<SinDatos />} />
        <Route path="mis-materias" element={<SinDatos />} />
        <Route path="mi-perfil" element={<SinDatos />} />
        
      </Route>
    </Routes>
  );
};

export default MenuAlumno;