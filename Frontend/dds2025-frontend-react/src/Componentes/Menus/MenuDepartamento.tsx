import React from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import './MenuAlumno.css'; // Mantenemos el estilo "WOW"
import { ArrowLeft } from 'lucide-react';

// --- Imports de Componentes de la Grilla ---
import MenuDepartamentoIndex from './MenuDepartamentoIndex';

// --- Imports de TUS Componentes REALES ---

// 1. Generar Informe (El formulario grande)
import GenerarInformeSinteticoDep from '../Departamento/GenerarInformeSinteticoDep';

// 2. Historial REAL (Este componente ya maneja la visualización internamente)
import ListadoInformesACDepREAL from '../Departamento/ListadoInformesACDepREAL';

// 3. Estadísticas (Basado en tu estructura de archivos)
import EstadisticasPorPregunta from '../Departamento/EstadisticasPorPregunta';

// Placeholder para configuración
import SinDatos from '../Otros/SinDatos'; 

/**
 * 1. Layout del Departamento
 */
const DepartamentoLayout = () => {
    const navigate = useNavigate();
    
    return (
        <div className="menu-alumno-container">
            {/* Botón para regresar al menú principal */}
            <button onClick={() => navigate("/home/departamento")} className="back-button"> 
                <ArrowLeft size={18} /> Regresar al Menú
            </button>

            <header className="menu-alumno-header">
                <h1 style={{ 
                    background: 'linear-gradient(135deg, var(--color-departamento), #ff8c00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Departamento
                </h1>
                <p>Panel de Gestión de Informes Sintéticos.</p>
            </header>
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

/**
 * 2. Router del Departamento
 */
const MenuDepartamento = () => {
    return (
        <Routes>
            <Route path="/" element={<DepartamentoLayout />}>
                
                {/* Página principal (Grilla de tarjetas) */}
                <Route index element={<MenuDepartamentoIndex />} />
                
                {/* --- RUTAS FUNCIONALES CONECTADAS --- */}
                
                {/* 1. Generar Informe */}
                <Route path="generar-informe-sintetico" element={<GenerarInformeSinteticoDep />} />
                
                {/* 2. Historial (Usa el componente REAL) */}
                <Route path="historial-informes" element={<ListadoInformesACDepREAL />} />
                
                {/* 3. Estadísticas */}
                <Route path="estadisticas" element={<EstadisticasPorPregunta />} />
                
                {/* 4. Configuración */}
                <Route path="configuracion" element={<SinDatos />} />
                
            </Route>
        </Routes>
    );
};

export default MenuDepartamento;