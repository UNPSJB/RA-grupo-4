import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate, useParams, useLocation, Outlet } from 'react-router-dom';
import { ArrowLeft, FileText, List, BookOpen, Clock, Hand } from 'lucide-react'; 

// Componentes internos de ESTUDIANTE
import MiniEstadisticasEst from '../Estudiante/MiniEstadisticasEst';
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import ResponderEncuesta from '../Estudiante/ResponderEncuesta';
import SinDatos from '../Otros/SinDatos';
import HistorialEncuestasRealizadasEstudiante from '../Estudiante/HistorialEncuestasRealizadasEstudiante';
import MisMaterias from '../Estudiante/MisMaterias';
import MisRespuestas from '../Estudiante/MisRespuestas'; 

// Importante: CSS aislado
import './MenuAlumno.css'; 

// ---------------------------------------------------
// 1. Componentes Auxiliares
// ---------------------------------------------------

// --- Wrapper para la página de detalles de respuestas ---
const PaginaMisRespuestas = () => {
    const { materiaId } = useParams();
    const id = materiaId ? parseInt(materiaId) : 0;

    if (!id) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>Error: No se pudo identificar la materia.</p>
            <NavLink to="/home/alumno/historial-encuestas" className="back-button-link">
                Volver al historial
            </NavLink>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <NavLink to="/home/alumno/historial-encuestas" className="back-button-link">
                    <ArrowLeft size={18} /> Volver al Historial
                </NavLink>
            </div>
            <MisRespuestas materiaId={id} />
        </div>
    );
};

// ---------------------------------------------------
// 2. Dashboard Principal (Vista Home del Alumno)
// ---------------------------------------------------


const AlumnoDashboard = ({ estudianteId }) => {
    const navigate = useNavigate();
    
    const [periodoActual, setPeriodoActual] = useState(null);
    const [estudianteInfo, setEstudianteInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch de periodo actual + datos del estudiante
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1) Periodo actual de encuestas
                const resPeriodo = await fetch(`http://localhost:8000/periodos/actual/encuestas`);
                const periodo = await resPeriodo.json();
                setPeriodoActual(periodo);

                // 2) Datos del estudiante
                const resEst = await fetch(`http://localhost:8000/estudiantes/${estudianteId}`);
                const estudiante = await resEst.json();
                setEstudianteInfo(estudiante);
            } catch (error) {
                console.error("Error cargando datos del dashboard del alumno:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [estudianteId]);

    if (loading) {
        return (
            <div className="alumno-dashboard-wrapper">
                <p>Cargando información...</p>
            </div>
        );
    }

    const hoy = new Date();

    const fechaCierre = periodoActual?.fecha_cierre_encuestas
        ? new Date(periodoActual.fecha_cierre_encuestas)
        : null;

    const diasRestantes = fechaCierre
        ? Math.ceil((fechaCierre.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;


    return (
        // Clase única para aislar estilos del alumno
        <div className="alumno-dashboard-wrapper">
            
            {/* 1. Cabecera del Alumno: Bienvenida y Estadísticas */}
            <div className="alumno-header-grid">
                <aside className="alumno-welcome-card">
                    <h1 className="alumno-title">
                        <Hand size={30} className="alumno-icon-hand" />  ¡Bienvenido, {estudianteInfo?.nombre}!
                        <br />
                        
                    </h1>
                    <p className="alumno-subtitle">
                        {periodoActual ? (
                            <>
                                Periodo Actual: {periodoActual.ciclo_lectivo} {periodoActual.cuatrimestre}
                                <br />
                                Quedan <strong>{diasRestantes}</strong> días para el cierre de las encuestas.
                                <br />
                                Recuerda responder a las encuestas de tus materias.
                            </>
                        ) : (
                            <>No hay periodo activo.</>
                        )}
                    </p>
                </aside>
                
                <div className="alumno-stats-card">
                    <MiniEstadisticasEst estudianteId={estudianteId} />
                </div>
            </div>

            {/* 2. Sección Principal: Encuestas Pendientes */}
            <div className="alumno-section-container">
                <h2 className="alumno-section-title">
                    <FileText size={20} /> Tus encuestas pendientes
                </h2>
                <div className="alumno-content-box">
                    <SeleccionarEncuestas />
                </div>
            </div>

            {/* 3. Navegación Rápida */}
            <div className="alumno-section-container">
                <h2 className="alumno-section-title">
                    <List size={20} /> Acceso Rápido
                </h2>
                <div className="alumno-cards-grid">
                    <div className="alumno-nav-card card-variant-blue" onClick={() => navigate("mis-materias")}>
                        <BookOpen size={36} />
                        <h3>Mis Materias</h3>
                        <p>Consulta informacion de tus asignaturas.</p>
                    </div>
                    <div className="alumno-nav-card card-variant-yellow" onClick={() => navigate("historial-encuestas")}>
                        <Clock size={36} />
                        <h3>Historial de encuestas</h3>
                        <p>Revisa las respuestas de las encuestas que completaste.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlumnoLayout = () => {
    const location = useLocation(); 
    // Si estamos en la raíz del alumno, el botón vuelve al Home General, sino al Dashboard de Alumno
    const esDashboard = location.pathname === '/home/alumno' || location.pathname === '/home/alumno/';
    const rutaDestino = esDashboard ? '/home' : '/home/alumno';

    return (
        <div className="menu-alumno-layout-full">
            <div className="back-button-bar">
                <NavLink to={rutaDestino} className="back-button-link">
                    <ArrowLeft size={18} /> {esDashboard ? "Inicio General" : "Volver al Panel"}
                </NavLink>
            </div>
            <main className="menu-alumno-content">
                {/* Aquí se renderizan las sub-rutas */}
                <Outlet />
            </main>
        </div>
    );
};
const MenuAlumno = () => {
    const estudianteId = 1; // Aquí podrías obtener el ID real desde un Contexto o Prop

    return (
        <Routes>
            {/* Todas las rutas de alumno viven dentro de AlumnoLayout */}
            <Route path="/" element={<AlumnoLayout />}>
                
                {/* Ruta index: El Dashboard */}
                <Route index element={<AlumnoDashboard estudianteId={estudianteId} />} />
                
                {/* Sub-rutas funcionales */}
                <Route path="seleccionar" element={<SeleccionarEncuestas />} />
                <Route path="responder-encuesta/:inscripcionId" element={<ResponderEncuesta />} />
                <Route path="historial-encuestas" element={<HistorialEncuestasRealizadasEstudiante />} />
                <Route path="respuestas-encuesta/:materiaId" element={<PaginaMisRespuestas />} />
                <Route path="mis-materias" element={<MisMaterias />} />
                
                {/* Rutas de utilidad */}
                <Route path="sin-datos" element={<SinDatos />} />
            </Route>
        </Routes>
    );
};

export default MenuAlumno;