import React from 'react';
import { Routes, Route, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, FileText, List, BookOpen, Clock, Hand } from 'lucide-react'; 
import MiniEstadisticasEst from '../Estudiante/MiniEstadisticasEst';
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';
import SinDatos from '../Otros/SinDatos';
import HistorialEncuestasRealizadasEstudiante from '../Estudiante/HistorialEncuestasRealizadasEstudiante';
import MisMaterias from '../Estudiante/MisMaterias';
import MisRespuestas from '../Estudiante/MisRespuestas'; 
import './MenuAlumno.css'; 

// --- Componente Wrapper para la página de detalles ---
const PaginaMisRespuestas = () => {
    const { materiaId } = useParams();
    const id = materiaId ? parseInt(materiaId) : 0;

    if (!id) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>Error: No se pudo identificar la materia.</p>
            <NavLink to="/home/alumno/historial-encuestas" style={{ color: '#0056b3', textDecoration: 'underline' }}>
                Volver al historial
            </NavLink>
        </div>
    );

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <NavLink 
                    to="/home/alumno/historial-encuestas" 
                    style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '8px', 
                        color: '#0056b3', textDecoration: 'none', fontWeight: 600,
                        padding: '8px 12px', borderRadius: '5px', backgroundColor: '#f0f7ff'
                    }}
                >
                    <ArrowLeft size={18} /> Volver al Historial
                </NavLink>
            </div>
            <MisRespuestas materiaId={id} />
        </div>
    );
};

// --- Dashboard Principal ---
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
                    <MiniEstadisticasEst estudianteId={estudianteId} />
                </div>
            </div>

            <div className="seccion-box informes-principales">
                <h2 className="seccion-title"><FileText size={20} /> Tus encuestas pendientes</h2>
                <SeleccionarEncuestas/>
            </div>

            <div className="seccion-box navegacion-secundaria">
                <h2 className="seccion-title"><List size={20} /> Navegación y Acceso Rápido</h2>
                <div className="card-grid">
                    <div className="nav-card card-blue" onClick={() => navigate("mis-materias")}>
                        <BookOpen size={36} /><h3>Mis Materias</h3><p>Consulta el listado de asignaturas.</p>
                    </div>
                    <div className="nav-card card-yellow" onClick={() => navigate("historial-encuestas")}>
                        <Clock size={36} /><h3>Historial de Encuestas</h3><p>Revisa las encuestas que ya completaste.</p>
                    </div>
                    </div>
                </div>
            </div>
    );
};

const MenuAlumno = () => {
    const estudianteId = 1; 
    const location = useLocation(); 

    // Lógica para determinar la ruta de regreso
    // Si la ruta actual es exactamente "/home/alumno" (el dashboard), volvemos al home general.
    // Si es cualquier otra (submenú), volvemos al dashboard (/home/alumno).
    const esDashboard = location.pathname === '/home/alumno' || location.pathname === '/home/alumno/';
    const rutaDestino = esDashboard ? '/home' : '/home/alumno';

    return (
        <div className="menu-alumno-layout-full">
            <div className="back-button-bar">
                <NavLink to={rutaDestino} className="back-button-link">
                    <ArrowLeft size={18} /> Regresar al Inicio
                </NavLink>
            </div>
            <main className="menu-alumno-content">
                <Routes>
                    <Route index element={<AlumnoDashboard estudianteId={estudianteId} />} />
                    <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                    <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
                    
                    <Route path="historial-encuestas" element={<HistorialEncuestasRealizadasEstudiante />} />
                    
                    <Route path="respuestas-encuesta/:materiaId" element={<PaginaMisRespuestas />} />
                    
                    <Route path="mis-materias" element={<MisMaterias />} />
                    
                </Routes>
            </main>
        </div>
    );
};

export default MenuAlumno;