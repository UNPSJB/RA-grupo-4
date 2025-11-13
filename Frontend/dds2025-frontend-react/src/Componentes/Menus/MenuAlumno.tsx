import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; // Mantenemos el estilo
import { ArrowLeft } from 'lucide-react';

// --- Imports de Componentes de la Grilla ---
import MenuAlumnoIndex from './MenuAlumnoIndex';

// --- Imports de TUS Componentes REALES (Estudiante) ---

// 1. Listado de encuestas pendientes (Donde seleccionas cual responder)
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';

// 2. La pantalla para responder la encuesta (necesita un ID en la ruta)
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';

// 3. Historial
import HistorialEncuestasRealizadasEstudiante from '../Estudiante/HistorialEncuestasRealizadasEstudiante';

// Placeholder
import SinDatos from '../Otros/SinDatos'; 

/**
 * 1. Layout del Alumno
 */
const AlumnoLayout = () => {
    const navigate = useNavigate();
    
    return (
        <div className="menu-alumno-container">
            {/* Botón para regresar al menú principal */}
            <button onClick={() => navigate("/home/alumno")} className="back-button"> 
                <ArrowLeft size={18} /> Regresar al Menú
            </button>

            <header className="menu-alumno-header">
                <h1 style={{ 
                    background: 'linear-gradient(135deg, var(--color-alumno), #85e085)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Alumnos
                </h1>
                <p>Panel de Encuestas Estudiantiles.</p>
            </header>
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

/**
 * 2. Router del Alumno
 */
const MenuAlumno = () => {
    return (
        <Routes>
            <Route path="/" element={<AlumnoLayout />}>
                
                {/* Página principal (Grilla de tarjetas) */}
                <Route index element={<MenuAlumnoIndex />} />
                
                {/* --- RUTAS FUNCIONALES --- */}
                
                {/* 1. Ver listado de pendientes */}
                <Route path="encuestas-pendientes" element={<SeleccionarEncuestas />} />
                
                {/* 2. Responder una encuesta específica (acepta un ID) */}
                {/* Nota: Asegúrate de que tu botón en 'SeleccionarEncuestas' navegue a esta ruta */}
                <Route path="responder-encuesta/:id" element={<ResponderEncuesta />} />
                <Route path="responder-encuesta" element={<ResponderEncuesta />} /> {/* Por si entran sin ID */}

                {/* 3. Historial */}
                <Route path="historial" element={<HistorialEncuestasRealizadasEstudiante />} />
                
                {/* 4. Mi Perfil */}
                <Route path="mi-perfil" element={<SinDatos />} />
                
            </Route>
        </Routes>
    );
};

export default MenuAlumno;