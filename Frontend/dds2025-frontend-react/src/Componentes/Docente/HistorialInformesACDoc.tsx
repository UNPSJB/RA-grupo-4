import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Send, BookOpen, Clock4, ArrowLeft } from "lucide-react"; 
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

interface Docente {
    id_docente: number;
    nombre: string;
}

interface Periodo{
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
}
interface Materia {
    id_materia: number;
    nombre: string;
    periodo: Periodo;
    ciclo_lectivo: number
    cuatrimestre: string
    codigoMateria?: string;
}

interface InformeAC {
    id_informesAC: number;
    sede: string;
    ciclo_lectivo: number;
    cantidad_alumnos_inscriptos?: number;
    cantidad_comisiones_teoricas?: number;
    cantidad_comisiones_practicas?: number;
    docente: Docente;
    materia: Materia;
    completado: number; 
}


const HistorialInformesACDoc: React.FC = () => {
    const idDocenteActual = 1; 
    const COLOR_PRINCIPAL = "#17a2b8"; 
    const COLOR_OSCURO = "#2a7374"; 
    const COLOR_TEXTO_GRIS = "#343a40"; 

    const [informes, setInformes] = useState<InformeAC[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleGoBack = () => { navigate('/home/docente'); };
    
    useEffect(() => {
        const fetchInformesCompletados = async () => {
            try {
                setCargando(true);
                setError(null);

                const response = await fetch(
                    `http://localhost:8000/informesAC/docente/${idDocenteActual}`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || "Error al obtener informes");
                }

                const data: InformeAC[] = await response.json();
                setInformes(data);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setCargando(false);
            }
        };
        fetchInformesCompletados();
    }, [idDocenteActual]);


    const handleSeleccionar = (id_informe: number) => {
        navigate(`/home/docente/visualizar-informe/${id_informe}`);
    };
    
    if (error) return <ErrorCargaDatos mensaje={error} />;

    return (
        <div className="main-card-container">
            <style>{`
                .main-card-container {
                    max-width: 1200px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.1); 
                    padding: 28px; 
                    font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
                    animation: fadeIn 0.6s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px; 
                }
                
                .go-back-button {
                    background-color: #f0f4f8;
                    color: #003366; 
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
                    order: 2; /* Mueve el botón a la derecha */
                }

                .go-back-button:hover {
                    background-color: #e8f4ff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    color: ${COLOR_PRINCIPAL}; 
                }
                
                .go-back-button svg {
                    color: #003366;
                    transition: color 0.2s ease;
                }

                .go-back-button:hover svg {
                    color: ${COLOR_PRINCIPAL};
                }

                .seccion-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color:#003366; 
                    font-size: 1.5rem;
                    font-weight: 650; 
                    border-left: 5px solid ${COLOR_PRINCIPAL} !important; 
                    padding-left: 15px !important;
                    margin-bottom: 0; /* Ajustamos el margen ya que está dentro de header-content */
                    order: 1; /* Mueve el título a la izquierda */
                }

                .seccion-title svg {
                    color: ${COLOR_PRINCIPAL}; 
                }

                .lista-informes {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .tarjeta-informe {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                    border: 1px solid #e8f4ff;
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .tarjeta-informe:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                }

                .informe-info {
                    display: flex;
                    align-items: flex-start; 
                    gap: 12px;
                    flex-grow: 1;
                    overflow: hidden;
                    flex-wrap: wrap; 
                }

                .materia-header {
                    display: flex;
                    align-items: center;
                    gap: 8px; 
                    flex-basis: 100%; 
                    margin-bottom: 4px;
                }

                .icono-materia {
                    color: ${COLOR_PRINCIPAL};
                    flex-shrink: 0;
                }

                .materia-nombre {
                    font-weight: 700;
                    color: #003366; 
                    font-size: 1.15rem; 
                    margin: 0;
                }
                
                .informe-detalles {
                    display: flex;
                    gap: 20px;
                    color: ${COLOR_TEXTO_GRIS};
                    font-size: 0.95rem;
                    margin-left: 28px; 
                    align-items: center;
                }
                
                .informe-detalles span {
                    white-space: nowrap;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .detalle-item strong {
                    font-weight: 600;
                    color: ${COLOR_TEXTO_GRIS}; 
                }

                .informe-detalles svg { 
                    color: #003366; 
                }

                .boton-primario-informe {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px; 
                    background-color: ${COLOR_PRINCIPAL}; 
                    color: white; 
                    padding: 8px 12px; 
                    border-radius: 6px; 
                    font-weight: 600;
                    font-size: 0.9rem; 
                    text-decoration: none;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                    border: none;
                    cursor: pointer;
                    flex-shrink: 0;
                }

                .boton-primario-informe:hover {
                    background-color: ${COLOR_OSCURO}
                    transform: translateY(-1px);
                    color: white; 
                }
        
                @media (max-width: 768px) {
                    .main-card-container {
                        margin: 10px;
                        padding: 15px;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                    
                    .go-back-button {
                        width: 100%;
                        justify-content: center;
                        margin-bottom: 0;
                        order: 1;
                    }
                    
                    .seccion-title {
                        margin-top: 0;
                        order: 2;
                    }
                    
                    .tarjeta-informe {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .informe-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                        width: 100%;
                    }
                    
                    .materia-header {
                        margin-bottom: 8px;
                    }

                    .informe-detalles {
                        flex-direction: column;
                        gap: 4px;
                        margin-top: 0; 
                        margin-left: 0;
                    }
                    
                    .boton-primario-informe {
                        width: 100%;
                        justify-content: center;
                    }
                }

            `}</style>
            
            <div className="header-content">
                <h3 className="seccion-title">
                    <History size={28} />
                    Historial de Informes de Actividad Curricular
                </h3>
                
                <button 
                    className="go-back-button"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={20} />
                    Regresar al incio
                </button>
            </div>


            {!cargando && !error && informes.length === 0 ? (
                <SinDatos 
                    mensaje="No hay informes completados en el historial."
                    titulo="Historial Vacío"
                />
            ) : (
                <ul className="lista-informes">
                    {informes.map((inf) => (
                        <li key={inf.id_informesAC} className="tarjeta-informe">
                            <div className="informe-info">
                                
                                <div className="materia-header">
                                    <BookOpen size={20} className="icono-materia" />
                                    <span className="materia-nombre">{inf.materia.nombre}</span>
                                </div>
                                
                                <div className="informe-detalles">
                                    <span className="detalle-item">
                                        Código: <strong>{inf.materia.codigoMateria ?? '—'}</strong>
                                    </span>
                                    <span className="detalle-item">
                                        Ciclo: <strong>{inf.ciclo_lectivo}</strong>
                                    </span>
                                    <span className="detalle-item">
                                        <Clock4 size={14} />
                                        {inf.materia.periodo.cuatrimestre}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSeleccionar(inf.id_informesAC)}
                                className="boton-primario-informe"
                            >
                                Ver Informe <Send size={14} /> 
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HistorialInformesACDoc;