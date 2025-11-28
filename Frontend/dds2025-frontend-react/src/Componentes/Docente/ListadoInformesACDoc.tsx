import React, { useEffect, useState } from "react";
import { BookOpen, Send, AlertCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SinDatos from "../Otros/SinDatos";

interface Periodo {
    ciclo_lectivo: number;
    cuatrimestre: string;
    fecha_cierre_informesAC?: string;
}

interface Materia {
    id_materia: number;
    nombre: string;
    id_periodo: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    codigoMateria?: string;
    id_docente: number;
    informeACCompletado?: boolean;
}

const API_BASE = "http://localhost:8000";
const ID_DOCENTE_ACTUAL = 1;
const ID_PERIODO_ACTUAL = 2;

const ListadoInformesACDoc: React.FC = () => {
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 3;
    const [mostrarCantidad, setMostrarCantidad] = useState(ITEMS_PER_PAGE);

    const COLOR_ACCION_PRINCIPAL = "#17a2b8"; 
    const COLOR_VER_MAS = "#17a2b8"; 
    const COLOR_TEXTO_PRINCIPAL = "#343a40"; 
    const COLOR_TEXTO_SECUNDARIO = "#6c757d"; 
    const COLOR_BORDE_ITEM = "#e9ecef";

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);

                const [resMaterias, resPeriodo] = await Promise.all([
                    fetch(`${API_BASE}/materias/listar`),
                    fetch(`${API_BASE}/periodos/${ID_PERIODO_ACTUAL}`)
                ]);

                if (!resMaterias.ok || !resPeriodo.ok) {
                    throw new Error("Error al obtener datos del servidor.");
                }

                const dataMaterias: Materia[] = await resMaterias.json();
                const dataPeriodo: Periodo = await resPeriodo.json();

                setMaterias(dataMaterias);
                setPeriodoActual(dataPeriodo);
            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar datos.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const materiasPendientes = materias.filter(
        (m) =>
            m.id_docente === ID_DOCENTE_ACTUAL &&
            m.id_periodo === ID_PERIODO_ACTUAL &&
            m.informeACCompletado !== true
    );

    const materiasVisibles = materiasPendientes.slice(0, mostrarCantidad);

    const handleVerMas = () => {
        setMostrarCantidad((prev) => prev + ITEMS_PER_PAGE);
    };

    const handleGenerarInforme = (id: number) => {
        navigate(`/home/docente/generar-informe/${id}`);
    };

    return (
        <div className="seccion-box">
            <style>{`
     
                .pending-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .pending-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: transparent; /* MODIFICADO: Cambiado a transparente */
                    border: 1px solid ${COLOR_BORDE_ITEM}; /* MODIFICADO: Cambiado a un borde de color para definir mejor el ítem */
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .pending-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                }

                .pending-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-grow: 1;
                    overflow: hidden;
                }

                .pending-icon {
                    color: ${COLOR_ACCION_PRINCIPAL}; 
                    flex-shrink: 0;
                }

                .pending-text {
                    overflow: hidden;
                    white-space: nowrap;
                    flex-grow: 1;
                }

                .pending-text h4 {
                    font-weight: 700;
                    color: ${COLOR_TEXTO_PRINCIPAL};
                    font-size: 1.05rem;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .pending-text p {
                    color: ${COLOR_TEXTO_SECUNDARIO};
                    font-size: 0.9rem;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .btn-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background-color: ${COLOR_ACCION_PRINCIPAL}; 
                    color: white;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    flex-shrink: 0;
                }

                .btn-action:hover {
                    background-color: #17a2b8;
                    transform: translateY(-1px);
                    color: white; 
                }

                .btn-ver-mas {
                    background-color: ${COLOR_VER_MAS} !important;
                }

                .btn-ver-mas:hover {
                    background-color: #138496 !important; 
                }

                .empty-list-message {
                    padding: 20px;
                    text-align: center;
                    color: ${COLOR_TEXTO_SECUNDARIO};
                    background: #ffff;
                    border-radius: 8px;
                }
                
                @media (max-width: 768px) {
                    .pending-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .pending-info {
                        align-items: flex-start;
                        gap: 8px;
                        width: 100%;
                    }
                }
            `}</style>
            
            <h2 className="seccion-title">
                <AlertCircle size={24} />
                Informes Pendientes ({periodoActual?.cuatrimestre} {periodoActual?.ciclo_lectivo})
            </h2>

            <div className="pending-list">
                {cargando && <div className="empty-list-message">Cargando pendientes...</div>}
                {error && <div className="empty-list-message" style={{ color: COLOR_ACCION_PRINCIPAL }}>Error: {error}</div>}

                {!cargando && !error && materiasPendientes.length === 0 && (
                    <div className="empty-list-message">
                        <SinDatos/>
                    </div>
                )}

                {!cargando && !error && materiasPendientes.length > 0 && (
                    <>
                        {materiasVisibles.map((materia) => (
                            <div className="pending-item" key={materia.id_materia}>
                                <div className="pending-info">
                                    <BookOpen size={24} className="pending-icon" />
                                    <div className="pending-text">
                                        <h4>{materia.nombre}</h4>
                                        <p>Codigo: {materia.codigoMateria ?? "N/A"} - Pendiente de generación.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleGenerarInforme(materia.id_materia)}
                                    className="btn-action"
                                >
                                    Generar Informe <Send size={16} />
                                </button>
                            </div>
                        ))}

                        {materiasVisibles.length < materiasPendientes.length && (
                            <div style={{ padding: "20px 15px 0", textAlign: "center" }}>
                                <button
                                    className="btn-action btn-ver-mas"
                                    onClick={handleVerMas}
                                >
                                    Ver {materiasPendientes.length - materiasVisibles.length} restantes
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ListadoInformesACDoc;