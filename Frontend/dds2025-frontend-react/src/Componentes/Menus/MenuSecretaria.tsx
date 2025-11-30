import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, List, Hand, ChartBar, Table } from 'lucide-react'; 

// Importación de componentes de Secretaría
import SeleccionarInformeSinteticoSEC from "../Secretaria/SeleccionarInformeSinteticoSEC";
import PrevisualizarInformeSinteticoSec from "../Secretaria/PrevizualisarInformeSinteticoSec";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import EstadisticasPromedioDocentes from "../Secretaria/EstadisticasDocentes";
import ListarInformesSinteticos from "../Secretaria/ListarInformesSinteticos"; 
import MiniEstadisticasSec from "../Secretaria/MiniEstadisticasSec"; 

// Importar CSS Aislado
import "./MenuSecretaria.css"; 

// ---------------------------------------------------
// 1. Componentes Internos del Dashboard
// ---------------------------------------------------

const TarjetaSeleccionarInformes = () => {
    // Lógica interna simple para el ejemplo
    const hasInformes = true; 
    
    if (hasInformes) {
        return <SeleccionarInformeSinteticoSEC />; 
    } 
    return <SinDatos mensaje="No hay informes sintéticos pendientes." />;
};

interface Periodo {
    id_periodo: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    fecha_apertura_encuestas: string;
    fecha_cierre_encuestas: string;
    fecha_apertura_informesAC: string;
    fecha_cierre_informesAC: string;
}

const SecretariaDashboard = () => {
    const navigate = useNavigate();

    const [periodoEncuestas, setPeriodoEncuestas] = useState<Periodo | null>(null);
    const [periodoInformes, setPeriodoInformes] = useState<Periodo | null>(null);
    const [cargandoPeriodos, setCargandoPeriodos] = useState(true);
    const [errorPeriodos, setErrorPeriodos] = useState<string | null>(null);

    useEffect(() => {
        const fetchPeriodosActuales = async () => {
            try {
                const encuestasPromise = fetch("http://localhost:8000/periodos/actual/encuestas");
                const informesACPromise = fetch("http://localhost:8000/periodos/actual/informesAC");

                const [encuestasResponse, informesACResponse] = await Promise.all([
                    encuestasPromise,
                    informesACPromise,
                ]);

                if (encuestasResponse.ok) {
                    const data = await encuestasResponse.json();
                    setPeriodoEncuestas(data);
                } else {
                    console.error("Error al cargar periodo de encuestas.");
                }
                
                if (informesACResponse.ok) {
                    const data = await informesACResponse.json();
                    setPeriodoInformes(data);
                } else {
                    console.error("Error al cargar periodo de informes AC.");
                }

            } catch (err) {
                console.error("Error en la carga de periodos:", err);
                setErrorPeriodos("Fallo la conexión o la carga de uno o más periodos.");
            } finally {
                setCargandoPeriodos(false);
            }
        };

        fetchPeriodosActuales();
    }, []); 

    const hoy = new Date();

    /* ======== ENCUESTAS ======== */
    const aperturaEncuestas = periodoEncuestas ? new Date(periodoEncuestas.fecha_apertura_encuestas) : null;
    const cierreEncuestas = periodoEncuestas ? new Date(periodoEncuestas.fecha_cierre_encuestas) : null;

    const diasParaAperturaEncuestas = aperturaEncuestas
        ? Math.ceil((aperturaEncuestas.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const diasParaCierreEncuestas = cierreEncuestas
        ? Math.ceil((cierreEncuestas.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    /* ======== INFORMES AC ======== */
    const aperturaInformes = periodoInformes ? new Date(periodoInformes.fecha_apertura_informesAC) : null;
    const cierreInformes = periodoInformes ? new Date(periodoInformes.fecha_cierre_informesAC) : null;

    const diasParaAperturaInformes = aperturaInformes
        ? Math.ceil((aperturaInformes.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const diasParaCierreInformes = cierreInformes
        ? Math.ceil((cierreInformes.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
        : null;


    return (
        <div className="secretaria-dashboard-wrapper">
            
            {/* 1. Cabecera */}
            <div className="secretaria-header-grid">
                <aside className="secretaria-welcome-card">
                    <h1 className="secretaria-title">
                        Panel de Secretaría Académica
                    </h1>
                    <p className="secretaria-subtitle">

                        {periodoEncuestas || periodoInformes ? (
                            <>
                                {/* -------- PERIODO ACTUAL -------- */}
                                Periodo Actual: {(periodoEncuestas || periodoInformes).ciclo_lectivo}{" "}
                                {(periodoEncuestas || periodoInformes).cuatrimestre}
                                <br />
                                {/* -------- ENCUESTAS -------- */}
                                {periodoEncuestas && (
                                    <>
                                        <strong>Encuestas:</strong><br />

                                        {diasParaAperturaEncuestas > 0 && (
                                            <>Abren en <strong>{diasParaAperturaEncuestas}</strong> días.<br /></>
                                        )}

                                        {diasParaAperturaEncuestas <= 0 && diasParaCierreEncuestas > 0 && (
                                            <>Cierran en <strong>{diasParaCierreEncuestas}</strong> días.<br /></>
                                        )}

                                        {diasParaCierreEncuestas <= 0 && (
                                            <>El periodo de encuestas ya cerró.<br /></>
                                        )}

                                    </>
                                )}

                                {/* -------- INFORMES AC -------- */}
                                {periodoInformes && (
                                    <>
                                        <strong>Informes de Actividad Curricular:</strong><br />

                                        {diasParaAperturaInformes > 0 && (
                                            <>Abren en <strong>{diasParaAperturaInformes}</strong> días.<br /></>
                                        )}

                                        {diasParaAperturaInformes <= 0 && diasParaCierreInformes > 0 && (
                                            <>Cierran en <strong>{diasParaCierreInformes}</strong> días.<br /></>
                                        )}

                                        {diasParaCierreInformes <= 0 && (
                                            <>El periodo de informes AC ya cerró.<br /></>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <>No hay periodo activo.</>
                        )}

                    </p>
                </aside>
                <div className="secretaria-stats-wrapper">
                    <MiniEstadisticasSec/>
                </div>
            </div>

            {/* 2. Sección Principal */}
            <div className="secretaria-section">
                <h2 className="secretaria-section-title">
                    <FileText size={22} /> Informes Sintéticos más recientes
                </h2>
                <TarjetaSeleccionarInformes />
            </div>

            {/* 3. Navegación Rápida */}
            <div className="secretaria-section">
                <h2 className="secretaria-section-title">
                    <List size={22} /> Gestión y Estadísticas
                </h2>
                <div className="secretaria-cards-grid">
                    
                    {/* Tarjeta: Estadísticas */}
                    <div className="secretaria-nav-card sec-card-purple" onClick={() => navigate("estadisticas-docentes")}>
                        <ChartBar size={34} />
                        <h3>Estadísticas Docentes</h3>
                        <p>Visualizar métricas de desempeño y promedios generales.</p>
                    </div>
                    
                    {/* Tarjeta: Listado Completo */}
                    <div className="secretaria-nav-card sec-card-blue" onClick={() => navigate("listar-informes")}>
                        <Table size={34} />
                        <h3>Listado de Informes</h3>
                        <p>Acceder al histórico y tabla completa de informes sintéticos.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------
// 2. Layout de Secretaría
// ---------------------------------------------------

const SecretariaLayout = () => {
    const location = useLocation(); 
    const esDashboard = location.pathname === '/home/secretaria' || location.pathname === '/home/secretaria/';
    const rutaDestino = esDashboard ? '/home' : '/home/secretaria';

    return (
        <div className="menu-secretaria-layout-full">
            <main className="menu-secretaria-content">
                <Outlet />
            </main>
        </div>
    );
};

// ---------------------------------------------------
// 3. Router Principal Secretaría
// ---------------------------------------------------

const MenuSecretaria = () => {

    return (
        <Routes>
            <Route path="/" element={<SecretariaLayout />}>
                <Route index element={<SecretariaDashboard />} />
                
                {/* Rutas Hijas */}
                <Route path="listar-informes" element={<ListarInformesSinteticos />} /> 
                <Route path="informe-sintetico/ver/:id" element={<PrevisualizarInformeSinteticoSec />} />
                <Route path="estadisticas-docentes" element={<EstadisticasPromedioDocentes />} /> 
                <Route path="visualizar-ac" element={<SeleccionarInformeSinteticoSEC />} />
                <Route path="error" element={<ErrorCargaDatos />} />
                <Route path="sin-datos" element={<SinDatos />} />
            </Route>
        </Routes>
    );
};

export default MenuSecretaria;