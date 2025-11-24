import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import HeaderInstitucional from "../Otros/HeaderInstitucional.tsx";
// --- Importaciones de Componentes Hijos ---
import CompletarDatosCabeceraDep from "../Departamento/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "../Departamento/AutoCompletarInformacionGeneral";
import AutocompletarNecesidadesDep from "./AutocompletarNecesidadesDep.tsx";
import AutocompletarValoracionesDep from "./AutocompletarValoracionesDep.tsx";
import ComentariosFinalesDep from "../Departamento/ComentariosFinalesDep";
import ConsignarDesarrolloDeActividadesDep from "./ConsignarDesarrolloDeActividadesDep.tsx";
import PorcentajesInformeSintetico from "../Departamento/PorcentajesInformeSintetico.tsx";
import AspecPosObstaculosInformeSintetico from "../Departamento/AspecPositivosObstaculosInformeSintetico.tsx";

import { createPortal } from "react-dom";

// Usamos el valor por defecto ya que import.meta.env no está disponible en este entorno
const API_BASE = "http://localhost:8000"; 

// ------------------- NOTIFICACIÓN FLOTANTE -------------------
interface FloatingNotificationProps {
    tipo: "exito" | "error";
    mensaje: string;
    segundos?: number;
    onClose: () => void;
}

const FloatingNotification: React.FC<FloatingNotificationProps> = ({ tipo, mensaje, segundos = 5, onClose }) => {
    const [contador, setContador] = useState(segundos);
    
    const colorPrincipal = tipo === "exito" ? "#28a745" : "#dc3545";
    const titulo = tipo === "exito" ? "¡Informe Creado!" : "Error al Enviar";
    const icono = tipo === "exito" ? '✔' : '✘'; 

    useEffect(() => {
        const interval = setInterval(() => setContador((c) => c - 1), 1000);
        const timeout = setTimeout(onClose, segundos * 1000); 

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [segundos, onClose]);

    return createPortal(
        <div className={`notification-portal notification-${tipo}`}>
            <div className="notification-content">
                <div className="notification-header">
                    <div className="notification-icon" style={{ backgroundColor: colorPrincipal, color: 'white' }}>
                        {icono}
                    </div>
                    <h3 className="notification-title">{titulo}</h3>
                    <button onClick={onClose} className="notification-close-btn" title="Cerrar notificación">×</button>
                </div>

                <p className="notification-text">
                    {mensaje}
                </p>
                
                {tipo === "exito" && (
                    <div className="notification-redirect-text">
                        <span className="redirect-icon">{contador > 0 ? '⏳' : '✅'}</span> 
                        <span className={contador > 0 ? 'pulse' : ''}>
                            {contador > 0 ? `Volviendo a la vista principal en ${contador}s...` : 'Redirigiendo...'}
                        </span>
                    </div>
                )}
            </div>
        </div>
        , document.body
    );
};

// ------------------- COMPONENTE PRINCIPAL -------------------
interface Periodo {
  id_periodo: number;
  ciclo_lectivo: number;
  cuatrimestre: string;
  nombre: string;
}
interface Departamento {
  id_departamento: number;
  nombre: string;
}

const GenerarInformeSinteticoDep: React.FC = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const periodoId = Number(params.get("periodoId"));
    const departamentoId = Number(params.get("departamentoId"));
    const navigate = useNavigate();

    const [datosInforme, setDatosInforme] = useState({
      departamento_id: departamentoId,
      periodo_id: periodoId,
      sede: "",
      integrantes: "",
      comentarios: "",
      descripcion: "Informe Sintético del Departamento",
    });

    const [periodo, setPeriodo] = useState<Periodo | null>(null);
    const [departamento, setDepartamento] = useState<Departamento | null>(null);

    const [creando, setCreando] = useState(false);
    const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
    const [informeGenerado, setInformeGenerado] = useState<any>(null); 
    // const [segundosRestantes, setSegundosRestantes] = useState(5); // Eliminado: no se usa directamente

    useEffect(() => {
        if (!departamentoId || !periodoId) return;

        setDatosInforme((prev) => ({
            ...prev,
            departamento_id: departamentoId,
            periodo_id: periodoId,
        }));
    }, [departamentoId, periodoId]);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Obtener datos del periodo 
                const resPeriodo = await fetch(`${API_BASE}/periodos/${periodoId}`);
                if (!resPeriodo.ok) throw new Error("Error obteniendo periodo");

                const dataPeriodo = await resPeriodo.json();
                setPeriodo(dataPeriodo);

                // Obtener datos del departamento 
                const resDepto = await fetch(`${API_BASE}/departamentos/${departamentoId}`);
                if (!resDepto.ok) throw new Error("Error obteniendo departamento");

                const dataDepto = await resDepto.json();
                setDepartamento(dataDepto);

            } catch (error) {
                console.error("Error cargando datos iniciales:", error);
            }
        };

        if (periodoId > 0 && departamentoId > 0) {
            fetchDatos();
        }
    }, [periodoId, departamentoId]);


    useEffect(() => {
        let timerRedirect: NodeJS.Timeout | undefined;
        if (informeGenerado && mensaje?.tipo === 'exito') {
            timerRedirect = setTimeout(() => {
                navigate(-1); 
            }, 5000);
        }

        return () => {
            if (timerRedirect) clearTimeout(timerRedirect);
        };
    
    }, [informeGenerado, navigate, mensaje]); 


    const handleCabeceraChange = (data: { sede: string; integrantes: string }) => {
        setDatosInforme((prev) => ({
            ...prev,
            sede: data.sede,
            integrantes: data.integrantes,
        }));
    };

    const handleComentariosChange = (texto: string) => {
        setDatosInforme((prev) => ({ ...prev, comentarios: texto }));
    };
    
    // ✨ FUNCIÓN AGREGADA/CORREGIDA: Esta era la función que faltaba en el código original ✨
    const handleDepartamentoSeleccionado = (id: number) => {
        // En este componente, el ID del departamento se obtiene de la URL. 
        // Si el componente hijo permite cambiarlo, esta función actualizaría el estado.
        console.log(`Departamento seleccionado en Cabecera: ${id}`);
        setDatosInforme((prev) => ({ ...prev, departamento_id: id }));
    };

    const handleCrearInformeFinal = useCallback(async () => {
        if (!datosInforme.departamento_id || datosInforme.departamento_id <= 0) {
            setMensaje({ tipo: "error", texto: "Por favor seleccione un Departamento válido antes de continuar." });
            return;
        }
        if (!datosInforme.sede || datosInforme.sede === "") {
            setMensaje({ tipo: "error", texto: "Por favor complete los datos de Cabecera (Sede/Ciclo Lectivo) antes de continuar." });
            return;
        }

        setCreando(true);
        setMensaje(null);
        setInformeGenerado(null);

        try {
            const payload = {
                descripcion: datosInforme.descripcion,
                periodo_id: datosInforme.periodo_id, 
                sede: datosInforme.sede,
                integrantes: datosInforme.integrantes,
                departamento_id: datosInforme.departamento_id,
                comentarios: datosInforme.comentarios || "",
            };

            const response = await fetch(`${API_BASE}/informes-sinteticos/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al crear el informe");
            }

            const data = await response.json();
            
            setInformeGenerado(data);
            setMensaje({ tipo: "exito", texto: `El informe ha sido guardado correctamente. ID: ${data.id}.` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            setMensaje({ tipo: "error", texto: `Error: ${error.message || "desconocido"}` });
            setInformeGenerado(null);
        } finally {
            setCreando(false);
        }
    }, [datosInforme]);
    
    const handleCloseNotification = useCallback(() => {
        setMensaje(null);
        if (informeGenerado && mensaje?.tipo === 'exito') {
            navigate(-1); 
        }
    }, [informeGenerado, mensaje, navigate]);


    return (
        <>
            <HeaderInstitucional />
            
            <style>{`
                /* --- VARIABLES Y ESTILOS GLOBALES DE LA PÁGINA --- */
                :root {
                    --uni-primary: #003366; /* Azul Oscuro Institucional */
                    --uni-secondary: #007bff; /* Azul de énfasis */
                    --uni-bg: #f4f6f9; /* Fondo de la página */
                    --uni-card-bg: #ffffff; /* FONDO BLANCO PARA EL CONTENEDOR PRINCIPAL */
                    --uni-border: #e0e0e0;
                    --uni-success: #28a745;
                    --uni-danger: #dc3545;
                }

                /* Nuevo estilo para los recuadros de texto introductorios */
                .section-intro-text {
                    background-color: #f0f8ff; /* Fondo azul claro institucional */
                    border-left: 5px solid var(--uni-secondary); /* Borde de énfasis */
                    padding: 20px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #333;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .section-intro-text p {
                    margin: 0 0 10px 0;
                }
                .section-intro-text p:last-child {
                    margin-bottom: 0;
                }
                .section-intro-text strong {
                    color: var(--uni-primary);
                    font-weight: 700;
                }

                .informe-sintetico-page {
                    padding-top: 20px;
                    background-color: var(--uni-bg); /* Color de fondo de la página, fuera del contenedor principal */
                    min-height: 100vh;
                }

                .main-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 30px;
                    background-color: var(--uni-card-bg); /* Esto establece el fondo en blanco */
                    border-radius: 12px;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
                    transition: all 0.5s;
                }

                .main-title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: var(--uni-primary); 
                    margin-bottom: 30px;
                    text-align: center;
                    border-bottom: 3px solid var(--uni-primary);
                    padding-bottom: 15px;
                }

                .section-divider {
                    height: 1px;
                    background-color: var(--uni-border); 
                    margin: 40px 0;
                }
                
                .section-spacing {
                    margin-top: 40px;
                }
                
                /* --- BOTÓN FINALIZAR --- */
                .btn-finalizar {
                    padding: 15px 40px;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: white;
                    background-color: var(--uni-success);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                }
                .btn-finalizar:hover:not(:disabled) {
                    background-color: #1e7e34;
                    transform: translateY(-2px);
                }
                .btn-finalizar:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* --- NOTIFICACIÓN FLOTANTE (Portal) --- */

                @keyframes slideDownFade { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
                @keyframes pulseGray { 0% { color: #999; } 50% { color: #555; } 100% { color: #999; } }

                .notification-portal {
                    position: fixed; 
                    top: 20px; 
                    left: 50%; 
                    transform: translateX(-50%); 
                    z-index: 1000;
                    animation: slideDownFade 0.5s ease-out forwards;
                }

                .notification-content {
                    background-color: var(--uni-card-bg);
                    padding: 20px 25px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.25); 
                    max-width: 450px; 
                    width: 90vw; 
                    border-top: 6px solid; 
                }

                .notification-portal.notification-exito .notification-content { border-top-color: var(--uni-success); }
                .notification-portal.notification-error .notification-content { border-top-color: var(--uni-danger); }

                .notification-header {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    margin-bottom: 15px;
                }
                .notification-icon {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 20px;
                    font-weight: 700;
                }
                .notification-title {
                    margin: 0 0 0 15px; 
                    font-size: 20px;
                    font-weight: 700;
                    flex-grow: 1;
                }
                .notification-text {
                    color: #555;
                    font-size: 15px;
                    line-height: 1.5;
                    margin-bottom: 10px;
                    width: 100%;
                }
                .notification-close-btn {
                    background: transparent;
                    border: none;
                    color: #999;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0 5px;
                    line-height: 1;
                }

                .notification-redirect-text {
                    color: #999;
                    font-size: 13px;
                    font-style: italic;
                    margin-bottom: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .notification-redirect-text .pulse {
                    animation: pulseGray 2s infinite;
                }
                
                @keyframes pulseGray { 0% { color: #999; } 50% { color: #555; } 100% { color: #999; } }
            `}</style>

            <div className="informe-sintetico-page">
                <div 
                    className="main-container"
                    style={{
                        opacity: informeGenerado || mensaje?.tipo === 'exito' ? 0.4 : 1, 
                        filter: informeGenerado || mensaje?.tipo === 'exito' ? 'blur(2px)' : 'none', 
                        pointerEvents: informeGenerado || mensaje?.tipo === 'exito' ? 'none' : 'auto' 
                    }}
                >
                    <h1 className="main-title">Generar Informe Sintético Departamental</h1>

                    <section>
                        {/* 1. CABECERA Y SELECCIÓN DE DEPARTAMENTO */}
                        <CompletarDatosCabeceraDep
                            onDepartamentoSeleccionado={handleDepartamentoSeleccionado}
                            onCabeceraChange={handleCabeceraChange}
                        />
                    </section>

                    {datosInforme.departamento_id > 0 && (
                        <>
                            {/* 2. INTRODUCCIÓN GENERAL DEL INFORME */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>El Informe Anual Sintético</strong> muestra en forma resumida el detalle de las actividades curriculares.
                                </p>
                                <p>
                                    Tiene como propósito el ofrecer información de las actividades curriculares dependientes de cada departamento, Delegación de Facultad o Secretaría Académica, que permita analizar la evolución de cada espacio curricular dentro de cada dependencia y por Sede de Facultad con el fin de realizar un seguimiento y acompañamiento de las propuestas de mejora realizadas por cada equipo docente. 
                                </p>
                            </div>

                            {/* 2. INFORMACIÓN GENERAL (Componente) */}
                            <section className="section-spacing">
                                <AutocompletarInformacionGeneral departamentoId={datosInforme.departamento_id} />
                            </section>

                            {/* 3. NECESIDADES Y REQUERIMIENTOS (Introducción) */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>Completar los siguientes apartados con los aspectos relevados de los Informes Anuales de Actividades Curriculares:</strong>
                                </p>
                                <p>
                                    <strong>1. Necesidades de equipamiento y bibliografía:</strong> En el siguiente cuadro, informar sobre la necesidad de actualización de bibliografía (hasta dos títulos por actividad curricular). De corresponder, indicar los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamiento informático, requerimientos de nuevos equipos para el desarrollo de clases, etc.
                                </p>
                            </div>

                            {/* 3. NECESIDADES Y REQUERIMIENTOS (Componente) */}
                            <section className="section-spacing">
                                <AutocompletarNecesidadesDep departamentoId={datosInforme.departamento_id} />
                            </section>

                            {/* 4. PORCENTAJES (Introducción) */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>2.A. Consigne el porcentaje de contenidos planificados alcanzados por cada espacio curricular.</strong> Mencione en caso de corresponder, las estrategias propuestas por el equipo de cátedra para el próximo dictado a fin de ajustar el cronograma.
                                </p>
                            </div>
                            
                            {/* 4. PORCENTAJES (Componente) */}
                            <section className="section-spacing">
                                <PorcentajesInformeSintetico 
                                    departamentoId={datosInforme.departamento_id} 
                                    periodoId={datosInforme.periodo_id} // Corregido de .periodo a .periodo_id
                                />
                            </section>
                            
                            {/* 5. ASPECTOS POSITIVOS Y OBSTÁCULOS (Introducción) */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>2.C. Complete los aspectos positivos, obstáculos</strong> y de mencionarse en el Informe de Actividad Curricular, las estrategias a implementar en el proceso de enseñanza y/o del proceso de aprendizaje de cada espacio curricular.
                                </p>
                            </div>

                            {/* 5. ASPECTOS POSITIVOS Y OBSTÁCULOS (Componente) */}
                            <section className="section-spacing">
                                <AspecPosObstaculosInformeSintetico 
                                    departamentoId={datosInforme.departamento_id} 
                                    periodoId={datosInforme.periodo_id} // Corregido de .periodo a .periodo_id
                                />
                            </section>

                            {/* 6. DESARROLLO DE ACTIVIDADES (Introducción) */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>Señale con una cruz si ha desarrollado actividades de Capacitación, Investigación, Extensión y Gestión</strong> en el ámbito de la Facultad de Ingeniería por cada uno los integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo evaluado. Explicite las observaciones y comentarios que considere pertinentes.
                                </p>
                            </div>

                            {/* 6. DESARROLLO DE ACTIVIDADES (Componente) */}
                            <section className="section-spacing">
                                <ConsignarDesarrolloDeActividadesDep 
                                    departamentoId={datosInforme.departamento_id} 
                                    periodoId={datosInforme.periodo_id} // Corregido de .periodo a .periodo_id
                                />
                            </section>

                            {/* 7. VALORACIONES FINALES (Introducción) */}
                            <div className="section-divider"></div>
                            <div className="section-intro-text">
                                <p>
                                    <strong>4.- Señale con una cruz las valoraciones del desempeño de los auxiliares de cátedra</strong> consignadas en el informe de actividad curricular. Indique la justificación informada de la valoración.
                                </p>
                            </div>

                            {/* 7. VALORACIONES FINALES (Componente) */}
                            <section className="section-spacing">
                                <AutocompletarValoracionesDep departamentoId={datosInforme.departamento_id} />
                            </section>
                        </>
                    )}

                    {/* 8. COMENTARIOS Y BOTÓN FINAL */}
                    <div className="section-divider"></div>
                    
                    {/* 8. COMENTARIOS Y BOTÓN FINAL (Introducción) */}
                    <div className="section-intro-text" style={{ marginBottom: 40 }}>
                        <p>
                            <strong>5.- Observaciones o comentarios que desee expresar la Comisión Asesora</strong> en relación al conjunto de actividades desarrolladas por los docentes de los diferentes espacios curriculares.
                        </p>
                    </div>

                    <section className="section-spacing">
                        <ComentariosFinalesDep informeId={null} modoCreacion={true} onChange={handleComentariosChange} />

                        <div style={{ marginTop: 40, textAlign: "right" }}>
                            <button
                                onClick={handleCrearInformeFinal}
                                disabled={creando || !datosInforme.departamento_id || datosInforme.departamento_id <= 0}
                                className="btn-finalizar"
                            >
                                {creando ? "Generando..." : "FINALIZAR Y CREAR INFORME"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
            
            {/* NOTIFICACIÓN FLOTANTE (Portal) */}
            {mensaje && (
                <FloatingNotification
                    tipo={mensaje.tipo}
                    mensaje={mensaje.texto}
                    segundos={5}
                    onClose={handleCloseNotification}
                />
            )}
        </>
    );
};

export default GenerarInformeSinteticoDep;