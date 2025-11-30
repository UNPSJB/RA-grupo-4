import React, { useEffect, useState, useMemo } from "react";
import { BookOpen, Send, AlertCircle, ChevronDown, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SinDatos from "../Otros/SinDatos";
import { useAuth } from "../../hooks";

interface Periodo {
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    fecha_cierre_informesAC?: string;
}

interface Materia {
    id_materia: number;
    nombre: string;
    id_periodo: number;
    periodo: Periodo;
    ciclo_lectivo: number;
    cuatrimestre: string;
    codigoMateria?: string;
    id_docente: number;
    informeACCompletado: boolean;
}

// Interfaz para los informes que ya existen
interface InformeRealizado {
    id_informesAC: number;
    ciclo_lectivo: number | string;
    cuatrimestre: string;
    materia: { id_materia: number };
}

const ITEMS_PER_PAGE = 3; // Constante para definir cuántos items mostrar por vez
const PRIMARY_ORANGE = "#e76f51"; // Naranja principal
const DARK_BLUE = "#003366"; // Azul oscuro para texto principal

const ListadoInformesACDoc: React.FC = () => {
    const API_BASE = "http://localhost:8000";
    
    const { currentUser } = useAuth();
    const docenteId = currentUser?.docente_id;

    // Estados
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [informesHechos, setInformesHechos] = useState<InformeRealizado[]>([]);
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

    // --- EFECTO DE CARGA DE DATOS ---
    useEffect(() => {
        const cargarPeriodo = async () => {
            try {
                const resPeriodo = await fetch(`${API_BASE}/periodos/actual/informesAC`);
                if (!resPeriodo.ok) throw new Error("No se pudo obtener el periodo actual.");
                const dataPeriodo: Periodo = await resPeriodo.json();
                setPeriodoActual(dataPeriodo);
            } catch (err) {
                console.error(err);
            }
        };
        cargarPeriodo();
    }, []);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                setError(null);

                const [resMaterias, resInformes] = await Promise.all([
                    fetch(`${API_BASE}/materias/listar`),
                    fetch(`${API_BASE}/informesAC/filtradoInformesAc?id_docente=${docenteId}`)
                ]);

                if (!resMaterias.ok || !resInformes.ok) {
                    throw new Error("Error al obtener datos del servidor.");
                }

                const dataMaterias: Materia[] = await resMaterias.json();
                const dataInformes: InformeRealizado[] = await resInformes.json();

                setMaterias(dataMaterias);
                setInformesHechos(dataInformes);
            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar datos.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    const materiasPendientes = useMemo(() => {
        return materias.filter(materia => {
            const correspondeDocente = materia.id_docente === docenteId;
            const esCicloLectivoActual = materia.id_periodo === periodoActual?.id;

            if (!correspondeDocente || !esCicloLectivoActual) return false;

            const yaEstaHecho = informesHechos.some(inf => 
                inf.materia.id_materia === materia.id_materia &&
                Number(inf.ciclo_lectivo) === periodoActual?.ciclo_lectivo
            );

            return !yaEstaHecho;
        });
    }, [materias, informesHechos, docenteId]);
    
    const materiasVisibles = materiasPendientes.slice(0, mostrarCantidad);
    const tieneMasElementos = materiasPendientes.length > materiasVisibles.length;

    const handleVerMas = () => {
        setMostrarCantidad((prev) => prev + ITEMS_PER_PAGE);
    };
    
    const handleSeleccionarMateria = (id_materia: number) => {
        navigate(`/home/generar-informe/${id_materia}`);
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