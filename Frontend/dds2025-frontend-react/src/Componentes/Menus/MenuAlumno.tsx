import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, List, BookOpen, Clock, Hand, BarChart3 } from 'lucide-react'; 
import MiniEstadisticasEst from '../Estudiante/MiniEstadisticasEst';
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';
import SinDatos from '../Otros/SinDatos';
import './MenuAlumno.css'; 

// --- Componente Dashboard Principal ---
const AlumnoDashboard = ({ estudianteId }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-main-view">
            
            <div className="dashboard-header-container">
                
                <aside className="bienvenida-box">
                    <h1 className="welcome-title"><Hand size={30} className="hand-icon" /> ¡Bienvenido/a, Alumno!</h1>
                    <p className="panel-subtitle">Accedé a tus encuestas, materias y recursos institucionales.</p>
                </aside>

                <div className="estadisticas-box card-box">
                    <h2 className="stats-title"><BarChart3 size={20} /> Tus encuestas</h2>
                    <MiniEstadisticasEst estudianteId={estudianteId} />
                </div>
            </div>

            {/* 2. Encuestas pendientes (Sección Principal) */}
            <div className="seccion-box informes-principales">
                <h2 className="seccion-title"><FileText size={20} /> Tus encuestas pendientes</h2>
                {/* Se renderiza aquí, y usa el Link corregido para navegar a la ruta anidada */}
                <SeleccionarEncuestas/>
            </div>

            {/* 3. Navegación (Tarjetas Abajo) */}
            <div className="seccion-box navegacion-secundaria">
                <h2 className="seccion-title"><List size={20} /> Navegación y Acceso Rápido</h2>
                <div className="card-grid">
                    <div className="nav-card card-blue" onClick={() => navigate("mis-materias")}>
                        <BookOpen size={36} />
                        <h3>Mis Materias</h3>
                        <p>Consulta el listado de asignaturas en las que estás inscrito.</p>
                    </div>
                    <div className="nav-card card-yellow" onClick={() => navigate("historial-encuestas")}>
                        <Clock size={36} />
                        <h3>Historial de Encuestas</h3>
                        <p>Revisa las encuestas que ya completaste.</p>
                    </div>
                    <div className="nav-card card-purple" onClick={() => navigate("recursos-extra")}>
                        <List size={36} />
                        <h3>Otros Recursos</h3>
                        <p>Documentación y ayuda adicional.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MenuAlumno = () => {
    const estudianteId = 1;

    return (
        <div className="menu-alumno-layout-full">
            
            {/* Botón de regreso */}
            <div className="back-button-bar">
                <NavLink to="/home" className="back-button-link">
                    <ArrowLeft size={18} /> Regresar al Inicio
                </NavLink>
            </div>
            
            <main className="menu-alumno-content">
                <Routes>
                    <Route index element={<AlumnoDashboard estudianteId={estudianteId} />} />

                    <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                    
                    <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
                    
                    <Route path="historial-encuestas" element={<SinDatos titulo="Historial de Encuestas" />} />
                    <Route path="mis-materias" element={<SinDatos titulo="Mis Materias" />} />
                    <Route path="recursos-extra" element={<SinDatos titulo="Recursos Adicionales" />} />
                </Routes>
            </main>
        </div>
    );
};

export default MenuAlumno;