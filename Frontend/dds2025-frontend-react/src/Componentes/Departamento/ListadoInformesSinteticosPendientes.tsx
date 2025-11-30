import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send, FileText } from "lucide-react"; 

import TodoBien from "../Otros/TodoBien";


interface PendienteSintetico {
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    cantidad_informes_esperados: number;
    cantidad_informes_recibidos: number;
}

interface Props {
    departamentoId: number;
}

const InformesSinteticosPendientes: React.FC<Props> = ({ departamentoId }) => {
    const [pendientes, setPendientes] = useState<PendienteSintetico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAll, setShowAll] = useState<boolean>(false); // Nuevo estado para "Ver Más"

    useEffect(() => {
        const fetchPendientes = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `http://localhost:8000/departamentos/${departamentoId}/informes-sinteticos/pendientes`
                );

                if (!res.ok) {
                    throw new Error(`Error al cargar datos: ${res.status}`);
                }

                const data = await res.json();
                setPendientes(data);
            } catch (err) {
                console.error("Error al obtener pendientes", err);
                // Aquí podrías manejar un estado de error, pero lo simplificamos
            } finally {
                setLoading(false);
            }
        };

        fetchPendientes();
    }, [departamentoId]);

    if (loading) return <p className="loading-message">Cargando informes...</p>;

    const informesToShow = showAll ? pendientes : pendientes.slice(0, 3);
    const hasMore = pendientes.length > 3 && !showAll;


    return (
        <div className="informes-capsulas-container">

            {pendientes.length === 0 ? (
                <div className="empty-list-message">
                    <TodoBien
                        mensaje="No tienes informes sintéticos pendientes de generar."
                    />
                </div>
            ) : (
                <>
                    <ul className="lista-informes-capsula"> 
                        {informesToShow.map((p) => (
                            <li key={p.id} className="tarjeta-informe-capsula">
                                <div className="informe-info">
                                    <FileText size={24} className="icono-informe-capsula" />
                                    <div className="informe-texto">
                                        <div className="informe-titulo">
                                            Informe Sintético {p.ciclo_lectivo} – {p.cuatrimestre}
                                        </div>
                                        <div className="informe-subtitulo">
                                            Actividades Curriculares Recibidas: 
                                            <span className="informe-contador"> {p.cantidad_informes_recibidos} / {p.cantidad_informes_esperados}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Link
                                    to={`generar-informe-sintetico?periodoId=${p.id}&departamentoId=${departamentoId}`}
                                    className="boton-accion-capsula"
                                >
                                    Generar <Send size={16} />
                                </Link>
                            </li>
                        ))}
                    </ul>

                
                    {hasMore && (
                        <div className="ver-mas-container">
                            <button 
                                onClick={() => setShowAll(true)} 
                                className="boton-ver-mas"
                            >
                                Ver Mas Informes
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>{`
                .loading-message {
                    color: #e76f51; /* Naranja principal */
                    padding: 20px;
                }
               

                /* Estilo de la Cápsula/Tarjeta */
                .tarjeta-informe-capsula {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .tarjeta-informe-capsula:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
                }

                .informe-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    flex-grow: 1;
                    overflow: hidden;
                }

                .icono-informe-capsula {
                    color: #e76f51; 
                    flex-shrink: 0;
                }

                .informe-titulo {
                    font-weight: 700;
                    color: #003366;
                    font-size: 1.05rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .informe-subtitulo {
                    color: #555;
                    font-size: 0.95rem;
                    margin-top: 4px;
                }
                
                .informe-contador {
                    font-weight: 700;
                    color: #e76f51;
                }

                /* Estilo del botón "Generar" */
                .boton-accion-capsula {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background-color: #e76f51; /* Botón naranja principal */
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
                    background-color: #f48c6b; /* Naranja más claro en hover */
                    transform: translateY(-1px);
                    color: white; 
                }
                
                /* Estilos del botón "Ver Más" */
                .ver-mas-container {
                    text-align: center;
                    margin-top: 20px;
                }
                
                .boton-ver-mas {
                    background: none;
                    color: #e76f51; /* Texto naranja principal */
                    border: 1px solid #e76f51;
                    padding: 8px 15px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease, color 0.2s ease;
                }
                
                .boton-ver-mas:hover {
                    background-color: #ffffffff; /* Fondo muy claro naranja en hover */
                }

                /* Media Queries para adaptabilidad */
                @media (max-width: 768px) {
                    .tarjeta-informe-capsula {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                        border-left: none; /* Mejor eliminar la banda lateral en móvil si se usa como borde completo */
                        border: 1px solid #e76f51;
                    }
                    
                    .informe-info {
                        width: 100%;
                        gap: 10px;
                        align-items: flex-start;
                    }

                    .informe-texto {
                        min-width: 0;
                    }

                    .boton-accion-capsula {
                        width: 100%;
                        justify-content: center;
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default InformesSinteticosPendientes;