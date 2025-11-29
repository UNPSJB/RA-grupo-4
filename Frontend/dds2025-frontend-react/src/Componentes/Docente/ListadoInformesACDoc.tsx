import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ChevronDown, FileText } from 'lucide-react'; 
import { useAuth } from "../../hooks";

// --- INTERFACES ---
interface Periodo {
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
}
interface Materia {
    id_materia: number;
    nombre: string;
    periodo: Periodo;
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
    
    const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);

    const { currentUser } = useAuth();
    const docenteId = currentUser?.docente_id;

    // Estados
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [informesHechos, setInformesHechos] = useState<InformeRealizado[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estado para controlar cuántos elementos se muestran
    const [mostrarCantidad, setMostrarCantidad] = useState<number>(ITEMS_PER_PAGE); 
    
    const navigate = useNavigate();

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
                    throw new Error("Error al consultar los datos al servidor.");
                }

                const dataMaterias: Materia[] = await resMaterias.json();
                const dataInformes: InformeRealizado[] = await resInformes.json();

                setMaterias(dataMaterias);
                setInformesHechos(dataInformes);

            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar listas.");
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    const materiasPendientes = useMemo(() => {
        return materias.filter(materia => {
            const correspondeDocente = materia.id_docente === docenteId;
            const esCicloLectivoActual = materia.periodo.id === periodoActual?.id;

            if (!correspondeDocente || !esCicloLectivoActual) return false;

            const yaEstaHecho = informesHechos.some(inf => 
                inf.materia.id_materia === materia.id_materia &&
                Number(inf.ciclo_lectivo) === periodoActual.ciclo_lectivo
            );

            return !yaEstaHecho;
        });
    }, [materias, informesHechos, docenteId]);
    
    const materiasVisibles = materiasPendientes.slice(0, mostrarCantidad);
    const tieneMasElementos = materiasPendientes.length > materiasVisibles.length;

    const handleVerMas = () => {
        setMostrarCantidad(prev => prev + ITEMS_PER_PAGE);
    };

    const handleSeleccionarMateria = (id_materia: number) => {
        navigate(`/home/generar-informe/${id_materia}`);
    };

    if (cargando) {
        return <div className="loading-message-container">Cargando informes...</div>;
    }
    
    if (error) {
        return <div className="error-message-container">Error: {error}</div>;
    }

    return (
        <div className="informes-ac-doc-page">
            <div className="card-container">
                
                <h3 className="section-title">
                    <span className="title-icon">
                        <FileText size={24} color={PRIMARY_ORANGE} />
                    </span> 
                    Informes AC Pendientes ({periodoActual?.cuatrimestre} Cuatrimestre {periodoActual?.ciclo_lectivo})
                </h3>
                
                {/* Lista de Items */}
                <div className="list-container">
                    {materiasPendientes.length === 0 ? (
                        <div className="todo-bien-message">
                            <h4>¡Todo al día!</h4>
                            <p>No tienes informes pendientes para el ciclo lectivo {periodoActual?.ciclo_lectivo} {" "} {periodoActual?.cuatrimestre}.</p>
                        </div>
                    ) : (
                        <>
                            <ul className="lista-informes-capsula">
                                {materiasVisibles.map((materia) => (
                                    <li 
                                        key={materia.id_materia} 
                                        className="tarjeta-informe-capsula"
                                        onClick={() => handleSeleccionarMateria(materia.id_materia)}
                                    >
                                        <div className="informe-info">
                                            <FileText size={24} className="icono-informe-capsula" />
                                            <div className="informe-texto">
                                                <div className="informe-titulo">
                                                    {materia.nombre}
                                                </div>
                                                <div className="informe-subtitulo">
                                                    Código: {materia.codigoMateria ?? '—'} - Pendiente de generación.
                                                </div>
                                            </div>
                                        </div>
                                    
                                        <button 
                                            className="boton-accion-capsula"
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleSeleccionarMateria(materia.id_materia);
                                            }}
                                        >
                                            Generar <Send size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            
                            {/* Botón "Ver Más" si hay elementos restantes */}
                            {tieneMasElementos && (
                                <div className="ver-mas-container">
                                    <button
                                        className="boton-ver-mas"
                                        onClick={handleVerMas}
                                    >
                                        Ver Mas 
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            <style>{`
                .loading-message-container, .error-message-container {
                    padding: 28px; 
                    text-align: center; 
                    font-weight: bold;
                    color: ${PRIMARY_ORANGE};
                }
                .error-message-container {
                    color: #d32f2f; /* Rojo para error */
                }

                .informes-ac-doc-page {
                    padding: 28px;
                }

                .card-container {
                    background-color: #ffffff; 
                    border-radius: 12px;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.1); 
                    font-family: '"Segoe UI", "Roboto", sans-serif';
                    max-width: 1000px; 
                    margin: 0 auto; 
                }

                .section-title { 
                    font-size: 22px; 
                    font-weight: bold; 
                    color: ${DARK_BLUE};
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    padding: 28px 28px 20px 28px; /* Ajuste para separar del listado */
                    border-bottom: 1px solid #eee;
                    margin: 0;
                }
                
                .title-icon {
                    display: flex;
                    align-items: center;
                    color: ${PRIMARY_ORANGE};
                }

                .list-container {
                    padding: 20px 28px 28px 28px;
                }

                .todo-bien-message {
                    padding: 30px; 
                    text-align: center; 
                    background-color: #fffaf0; /* Fondo muy claro naranja */
                    border-radius: 8px; 
                    border: 1px solid #f9d8b7; /* Borde naranja claro */
                    color: ${PRIMARY_ORANGE}; 
                    margin-top: 10px;
                }
                .todo-bien-message h4 { margin: 0 0 10px 0; }
                .todo-bien-message p { margin: 0; }


                /* --- Estilos de Cápsula --- */

                .lista-informes-capsula {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .tarjeta-informe-capsula {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #f9d8b7; /* Borde naranja claro */
                    border-left: 5px solid ${PRIMARY_ORANGE}; /* Banda lateral naranja */
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
                    cursor: pointer;
                }

                .tarjeta-informe-capsula:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    background-color: #fffbf5; /* Color sutil en hover */
                }

                .informe-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-grow: 1;
                    overflow: hidden;
                }

                .icono-informe-capsula {
                    color: ${PRIMARY_ORANGE}; 
                    flex-shrink: 0;
                }

                .informe-texto {
                    min-width: 0; 
                }

                .informe-titulo {
                    font-weight: 700;
                    color: ${DARK_BLUE}; 
                    font-size: 1.05rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .informe-subtitulo {
                    color: #555;
                    font-size: 0.9rem;
                    margin-top: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                /* Estilo del botón "Generar" */
                .boton-accion-capsula {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background-color: ${PRIMARY_ORANGE}; 
                    color: white; 
                    padding: 10px 18px;
                    border-radius: 8px;
                    font-weight: 600;
                    text-decoration: none;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    flex-shrink: 0;
                    margin-left: 20px;
                }

                .boton-accion-capsula:hover {
                    background-color: #f48c6b; 
                    transform: translateY(-1px);
                    color: white; 
                }
                
                /* Estilos del botón "Ver Más" */
                .ver-mas-container {
                    text-align: center;
                    margin-top: 25px;
                }
                
                .boton-ver-mas {
                    background: none;
                    color: ${PRIMARY_ORANGE}; 
                    border: 1px solid ${PRIMARY_ORANGE};
                    padding: 8px 15px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease, color 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .boton-ver-mas:hover {
                    background-color: #fff0d9; 
                }

                /* Media Queries para adaptabilidad */
                @media (max-width: 768px) {
                    .tarjeta-informe-capsula {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                        border-left: none; 
                        border: 1px solid ${PRIMARY_ORANGE};
                    }
                    
                    .informe-info {
                        width: 100%;
                        gap: 10px;
                        align-items: flex-start;
                    }

                    .boton-accion-capsula {
                        width: 100%;
                        justify-content: center;
                        margin-left: 0;
                    }
                    .section-title {
                        font-size: 20px;
                        padding: 20px 20px 15px 20px;
                    }
                    .list-container {
                        padding: 15px 20px 20px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ListadoInformesACDoc;