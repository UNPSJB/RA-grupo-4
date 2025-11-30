import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { Send, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react"; 
import { useAuth } from "../../hooks";
// --- IMPORTACIONES DE COMPONENTES DE CONTROL ---
import FaltanCamposObligatorios from "../Otros/FaltanCamposObligatorios"; 
import TodoBien from "../Otros/TodoBien"; 
import HeaderInstitucional from "../Otros/HeaderInstitucional";

// Interfaces +
interface OpcionRespuesta { id: number; descripcion: string; pregunta_id: number; }
interface Pregunta { id: number; enunciado: string; tipo: "ABIERTA" | "CERRADA"; obligatoria: boolean; opciones_respuestas?: OpcionRespuesta[]; }
interface Seccion { id: number; sigla: string; descripcion: string; preguntas: Pregunta[]; }
interface Encuesta { id_encuesta: number; nombre: string; secciones: Seccion[]; }
interface RespuestaInput { pregunta_id: number; inscripcion_id: number; opcion_respuesta_id?: number | null; respuesta_abierta?: string | null; }
interface ErrorItem { seccionSigla: string; preguntaId: number; enunciado: string; }

// colores
const styles = {
    colorPrincipal: '#003366', 
    colorSecundario: '#0078D4', 
    colorExito: '#28a745', 
    colorAlerta: '#dc3545', 
    colorFondoClaro: '#fff', 
    colorFondoTarjeta: '#ffffff', 
    sombraTarjeta: '0 8px 20px rgba(0,0,0,0.1)',
    transicionSuave: '0.3s ease',
    bordeRadio: '10px',
    colorHoverSutil: '#cce4f6', 
};


const PreguntaCerrada: React.FC<any> = ({ pregunta, respuesta, onChange }) => (
    <div className="opciones-grid">
        {pregunta.opciones_respuestas?.map((opcion: OpcionRespuesta) => (
            <label key={opcion.id} className="opcion-label">
                <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuesta.opcion_respuesta_id === opcion.id}
                    onChange={() => onChange(pregunta.id, opcion.id)}
                    id={`opcion-${opcion.id}`}
                    style={{ marginRight: "10px" }}
                />
                <span className="opcion-descripcion">{opcion.descripcion}</span>
            </label>
        ))}
    </div>
);

const PreguntaAbierta: React.FC<any> = ({ pregunta, respuesta, onChange }) => (
    <textarea
        name={`pregunta-${pregunta.id}`}
        value={respuesta.respuesta_abierta || ""}
        onChange={(e) => onChange(pregunta.id, e.target.value)}
        placeholder="Escribe tu respuesta..."
        rows={4}
        className="input-abierta"
        id={`pregunta-${pregunta.id}`}
        required={pregunta.obligatoria}
        style={{ backgroundColor: "#cce4f6" }}
    />
);


const ResponderEncuesta: React.FC = () => {
    const { inscripcionId: inscripcionIdFromUrl } = useParams<{ inscripcionId: string }>();
    const inscripcionId = inscripcionIdFromUrl ? parseInt(inscripcionIdFromUrl, 10) : null;
    
    const { currentUser } = useAuth();
    const estudianteId = currentUser?.alumno_id;

    const [encuesta, setEncuesta] = useState<any | null>(null);
    const [respuestas, setRespuestas] = useState<any[]>([]);
    const [cargandoPagina, setCargandoPagina] = useState<boolean>(true);
    const [cargandoEnvio, setCargandoEnvio] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<boolean>(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0); 
    const [validationErrors, setValidationErrors] = useState<any[]>([]); 
    const [showSectionWarning, setShowSectionWarning] = useState(false); 
    const navigate = useNavigate();
    const sections = encuesta?.secciones || [];
    const totalSections = sections.length;
    const isFirstSection = currentSectionIndex === 0;
    const isLastSection = currentSectionIndex === totalSections - 1;
    const currentSection = sections[currentSectionIndex];
    /*Pra regresar al menu*/
    const handleGoBack = () => {
        navigate('/home/alumno');
    };

    // Calcula el progreso de la sección actual para la barra de progreso
    const currentSectionProgress = useMemo(() => {
        if (!currentSection || !currentSection.preguntas.length) return 100;
        
        const totalPreguntas = currentSection.preguntas.length;
        const respondidas = currentSection.preguntas.filter(preg => {
            const respuesta = respuestas.find(r => r.pregunta_id === preg.id);
            if (!respuesta) return false;
            
            const cerradaRespondida = preg.tipo === "CERRADA" && !!respuesta.opcion_respuesta_id;
            const abiertaRespondida = preg.tipo === "ABIERTA" && !!respuesta.respuesta_abierta?.trim();
            
            return cerradaRespondida || abiertaRespondida;
        }).length;
        
        return (respondidas / totalPreguntas) * 100;
    }, [currentSection, respuestas]);

    // Función para validar la seccion antes de avanzar
    const validarSeccionActual = (section: Seccion): ErrorItem[] => {
        const errors: ErrorItem[] = [];
        section.preguntas.forEach((preg) => {
            if (preg.obligatoria) {
                const respuesta = respuestas.find((r) => r.pregunta_id === preg.id);
                const noRespondida =
                    !respuesta || (preg.tipo === "CERRADA" && !respuesta.opcion_respuesta_id) || (preg.tipo === "ABIERTA" && !respuesta.respuesta_abierta?.trim());
                if (noRespondida) { errors.push({ seccionSigla: section.sigla, preguntaId: preg.id, enunciado: preg.enunciado }); }
            }
        });
        return errors;
    };
    
    const jumpToSection = (preguntaId: number) => {
        for (let i = 0; i < totalSections; i++) {
            if (sections[i].preguntas.some(p => p.id === preguntaId)) {
                setCurrentSectionIndex(i);
                setValidationErrors([]); 
                setShowSectionWarning(false);
                window.scrollTo(0, 0); 
                return;
            }
        }
    };
    
    const validarTodo = (): ErrorItem[] => {
        const errors: ErrorItem[] = [];
        encuesta?.secciones.forEach((seccion) => {
            seccion.preguntas.forEach((preg) => {
                if (preg.obligatoria) {
                    const respuesta = respuestas.find((r) => r.pregunta_id === preg.id);
                    const noRespondida =
                        !respuesta ||
                        (preg.tipo === "CERRADA" && !respuesta.opcion_respuesta_id) ||
                        (preg.tipo === "ABIERTA" && !respuesta.respuesta_abierta?.trim());

                    if (noRespondida) { errors.push({ seccionSigla: seccion.sigla, preguntaId: preg.id, enunciado: preg.enunciado }); }
                }
            });
        });
        return errors;
    };
    useEffect(() => {
        if (!inscripcionId) { setError("ID de inscripción inválido en la URL."); setCargandoPagina(false); return; }

        const fetchEncuesta = async () => {
            try {
                setCargandoPagina(true); setError(null);
                const res = await fetch(`http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/preguntas`);

                if (!res.ok) {
                    let errorDetail = `Error ${res.status} al cargar la encuesta`;
                    try { const errorData = await res.clone().json(); if (errorData.detail) errorDetail = errorData.detail; } catch (jsonError) { /* Ignorar */ }
                    if (res.status === 400 && errorDetail.includes("ya ha sido respondida")) { setError("Ya has respondido esta encuesta."); } else { throw new Error(errorDetail); }
                } else {
                    const data: Encuesta = await res.json();
                    setEncuesta(data);
                    
                    const initRespuestas = data.secciones?.flatMap((s) =>
                        s.preguntas?.map((p) => ({ pregunta_id: p.id, inscripcion_id: inscripcionId, opcion_respuesta_id: null, respuesta_abierta: "", })) ?? []
                    ) ?? [];
                    setRespuestas(initRespuestas);
                }
            } catch (err: any) {
                setError(err.message || "Error desconocido al cargar la encuesta.");
            } finally { setCargandoPagina(false); }
        };
        fetchEncuesta();
    }, [inscripcionId, estudianteId]);
    
    const manejarCambioCerrada = (preguntaId: number, opcionId: number) => {
        setRespuestas((prev) => prev.map((r) => r.pregunta_id === preguntaId ? { ...r, opcion_respuesta_id: opcionId, respuesta_abierta: null } : r ));
        setShowSectionWarning(false);
    };

    const manejarCambioAbierta = (preguntaId: number, texto: string) => {
        setRespuestas((prev) => prev.map((r) => r.pregunta_id === preguntaId ? { ...r, respuesta_abierta: texto, opcion_respuesta_id: null } : r ));
        setShowSectionWarning(false);
    };

    const handleNext = () => {
        const errors = validarSeccionActual(currentSection);
        if (errors.length > 0) { setShowSectionWarning(true); return; }

        if (!isLastSection) {
            setCurrentSectionIndex((prev) => prev + 1);
            window.scrollTo(0, 0);
            setShowSectionWarning(false);
        }
    };

    const handlePrev = () => {
        if (!isFirstSection) {
            setCurrentSectionIndex((prev) => prev - 1);
            window.scrollTo(0, 0); 
            setShowSectionWarning(false);
        }
    };

    const enviarRespuestas = async () => {
        if (!inscripcionId) { setError("ID de inscripción inválido."); return; }
        
        const errors = validarTodo();
        
        if (errors.length > 0) { setValidationErrors(errors); return; }

        setCargandoEnvio(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8000/estudiantes/${estudianteId}/inscripciones/${inscripcionId}/respuestas`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(respuestas),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || `Error al enviar: ${res.status}`);
            }
            setExito(true);
        } catch (err: any) {
            console.error("Error en enviarRespuestas:", err);
            setError(err.message || "Error desconocido al enviar.");
        } finally {
            setCargandoEnvio(false);
        }
    };

    if (!inscripcionId) return <p className="error-msg global-message">Error: No se proporcionó un ID de inscripción válido.</p>;
    if (cargandoPagina) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5rem', color: styles.colorPrincipal, backgroundColor: styles.colorFondoTarjeta, borderRadius: styles.bordeRadio, boxShadow: styles.sombraTarjeta, margin: '30px auto', maxWidth: '1100px' }}>
                Cargando encuesta... Por favor, espera.
            </div>
        );
    }
    
    if (!encuesta) return <p className="error-msg global-message">No se encontró la encuesta para esta inscripción.</p>;
    if (exito) {
        return (
            <div className="global-message">
                <TodoBien /> 
            </div>
        );
    }
    
    if (error) {
         const message = error.includes("Ya has respondido") ? error : "Error al cargar la encuesta: " + error;
         const isWarning = error.includes("Ya has respondido");
         return <p className={`global-message ${isWarning ? 'warning-msg' : 'error-msg'}`}>{message}</p>;
    }


    return (
        <div className="encuesta-form-container">
            
            {/* Modal de Errores de Validación Global */}
            {validationErrors.length > 0 && (
                <FaltanCamposObligatorios 
                    errores={validationErrors}
                    onClose={() => setValidationErrors([])}
                    onJumpToSection={jumpToSection}
                />
            )}
            
            {/* INYECCIÓN DE ESTILOS */}
            <style>{`
                /* --- General --- */
                .encuesta-form-container { 
                    max-width: 2000px; margin: 30px auto; padding: 30px; 
                    background-color: ${styles.colorFondoClaro}; 
                    border-radius: ${styles.bordeRadio}; box-shadow: ${styles.sombraTarjeta};
                    animation: fadeInContainer 0.5s ease-out;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                @keyframes fadeInContainer { from { opacity: 0; } to { opacity: 1; } }

                .form-header {position:relative; text-align: center; margin-bottom: 30px; }
                .form-title { color: ${styles.colorPrincipal}; margin-bottom: 5px; font-size: 2.5rem; font-weight: 700; }
                
                /* Barra de Progreso */
                .progress-bar-wrapper { margin-bottom: 30px; position: relative; }
                .progress-bar-container { width: 100%; height: 12px; background-color: #ddd; border-radius: 6px; overflow: hidden; position: relative; }
                .progress-bar-fill { height: 100%; background-color: ${styles.colorSecundario}; width: ${(currentSectionIndex + 1) / totalSections * 100}%; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 6px; }
                .progress-bar-section { 
                    height: 12px; 
                    background: linear-gradient(90deg, ${styles.colorExito}AA 0%, ${styles.colorExito}FF 100%);
                    width: ${currentSectionProgress}%; 
                    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
                    border-radius: 6px; 
                    position: absolute; 
                    top: 0; 
                    opacity: 0.9;
                    animation: sectionWave 3s linear infinite alternate; 
                }
                @keyframes sectionWave { 0% { transform: scaleX(1.0); } 100% { transform: scaleX(1.01); } }

                .progress-text { margin-top: 10px; font-size: 1rem; color: ${styles.colorPrincipal}; text-align: center; font-weight: 600; }

                /* Sección Actual */
                .section-card { 
                    padding: 30px; 
                    border-radius: ${styles.bordeRadio}; background-color: ${styles.colorFondoTarjeta}; 
                    box-shadow: ${styles.sombraTarjeta};
                    animation: slideInContent 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
                }
                @keyframes slideInContent { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

                .section-header { margin-bottom: 25px; border-left: 6px solid ${styles.colorSecundario}; padding-left: 20px; } 
                .section-title { color: ${styles.colorPrincipal}; margin: 0; font-size: 1.8rem; font-weight: 700; }
                .section-desc { color: ${styles.colorPrincipal}; margin-top: 5px; font-size: 1.1rem; }
                
                /* Preguntas */
                .pregunta-item { margin-bottom: 30px; padding-bottom: 25px; border-bottom: 1px dashed #ddd; }
                .pregunta-item:last-child { border-bottom: none; }
                .pregunta-enunciado { font-size: 1.15rem; margin-bottom: 15px; color: ${styles.colorPrincipal}; font-weight: bold; }
                .obligatoria { color: ${styles.colorAlerta}; font-weight: bold; }

                /* Opciones Cerradas */
                .opciones-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; }
                .opcion-label { padding: 15px; background-color: ${styles.colorFondoTarjeta}; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
                .opcion-label:hover { background-color: ${styles.colorHoverSutil}; border-color: ${styles.colorSecundario}; }
                input[type="radio"] { accent-color: ${styles.colorSecundario}; } 
                input[type="radio"]:checked + .opcion-descripcion { font-weight: 700; color: ${styles.colorPrincipal}; }
                input[type="radio"]:checked + .opcion-descripcion::before { content: "✓ "; color: ${styles.colorSecundario}; }

                /* Abierta  */
                .input-abierta { 
                    width: 100%; padding: 15px; border: 1px solid #cce4f6; 
                    background-color: ${styles.colorFondoTarjeta}; /* FONDO BLANCO */
                    border-radius: ${styles.bordeRadio}; box-sizing: border-box; resize: vertical;
                    min-height: 120px; font-size: 1rem; color: ${styles.colorPrincipal};
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.08); /* Sombra interna para profundidad */
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }
                .input-abierta:focus { border-color: ${styles.colorSecundario}; box-shadow: 0 0 5px ${styles.colorSecundario}80; outline: none; }

                .section-warning-card {
                    margin-top: 30px; padding: 20px; background-color: #f8d7da; 
                    color: ${styles.colorAlerta}; border: 1px solid ${styles.colorAlerta};
                    border-radius: ${styles.bordeRadio}; display: flex; align-items: center; font-weight: 600;
                    animation: shake 0.5s ease-out; 
                }
                .section-warning-card svg { margin-right: 15px; min-width: 24px; color: #f2a600; }


                /* Navegación */
                .nav-buttons { display: flex; justify-content: space-between; margin-top: 40px; gap: 20px; }
                .nav-button { 
                    width: 48%; padding: 15px 25px; border-radius: ${styles.bordeRadio}; font-weight: 700; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .nav-button:disabled { background-color: #ccc; color: #666; box-shadow: none; cursor: not-allowed; }
                
                /* Botón Anterior */
                .prev-button { background-color: ${styles.colorFondoTarjeta}; color: ${styles.colorPrincipal}; border: 1px solid #ddd; }
                .prev-button:hover:not(:disabled) { background-color: #f0f4f8; transform: translateY(-3px); box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); }
                
                /* Botón Siguiente */
                .next-button { background-color: ${styles.colorSecundario}; color: white; }
                .next-button:hover:not(:disabled) { background-color: #005bb5; transform: translateY(-3px); }
                
                /* Botón Enviar (Color Alerta) */
                .send-button { background-color: ${styles.colorAlerta}; }
                .send-button:hover:not(:disabled) { background-color: #a02834; transform: translateY(-3px); }
             
                /*Boton de atras*/
                .go-back-button {
                    position: absolute;
                    top: 0; 
                    right: 0;
                    background-color: #f0f4f8;
                    color: #0078D4;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease;
                }

                .go-back-button:hover {
                    background-color: #e8f4ff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

            `}</style>

            <div className="form-header">
                <button 
                    className="go-back-button"
                    onClick={handleGoBack}
                >
                    <ArrowLeft size={20} />
                    Regresar al incio
                </button>
                <HeaderInstitucional/>
                <h1 className="form-title">{encuesta.nombre}</h1>
                <p className="form-subtitle">Completa las {totalSections} secciones. Tu progreso se guardará al final.</p>
            </div>

            {/* BARRA DE PROGRESO GLOBAL Y DINÁMICA */}
            <div className="progress-bar-wrapper">
                <div className="progress-bar-section" style={{ width: `${currentSectionProgress}%` }}></div> 
                <div className="progress-bar-container">
                    <div className="progress-bar-fill"></div>
                </div>
            </div>
            <p className="progress-text">Sección {currentSectionIndex + 1} de {totalSections} | Avance en la sección: {Math.round(currentSectionProgress)}%</p>
            
            {/* Contenido de la Sección Actual */}
            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">{currentSection.sigla}</h3>
                    <p className="section-desc">{currentSection.descripcion}</p>
                </div>

                {currentSection.preguntas?.map((pregunta, index) => {
                    const respuesta = respuestas.find(r => r.pregunta_id === pregunta.id);
                    if (!respuesta) return null;

                    return (
                        <div key={pregunta.id} className="pregunta-item">
                            <label className="pregunta-enunciado" htmlFor={`pregunta-${pregunta.id}`}>
                                {index + 1}. {pregunta.enunciado}{" "}
                                {pregunta.obligatoria && <span className="obligatoria">*</span>}
                            </label>

                            {pregunta.tipo === "CERRADA" && pregunta.opciones_respuestas && (
                                <PreguntaCerrada pregunta={pregunta} respuesta={respuesta} onChange={manejarCambioCerrada} />
                            )}

                            {pregunta.tipo === "ABIERTA" && (
                                <PreguntaAbierta pregunta={pregunta} respuesta={respuesta} onChange={manejarCambioAbierta} />
                            )}
                        </div>
                    );
                })}
                
                {/*Advertencia al avanzar*/}
                {showSectionWarning && (
                    <div className="section-warning-card">
                        <AlertTriangle size={24} />
                        Debe completar todos los campos obligatorios antes de pasar a la siguiente seccion.
                    </div>
                )}
            </div>

            {/* Botones de Navegación y Envío */}
            <div className="nav-buttons">
                <button
                    onClick={handlePrev}
                    disabled={isFirstSection}
                    className="nav-button prev-button"
                >
                    <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Anterior
                </button>

                {isLastSection ? (
                    <button
                        onClick={enviarRespuestas}
                        disabled={cargandoEnvio}
                        className="nav-button send-button"
                    >
                        {cargandoEnvio ? "Enviando..." : <><Send size={18} style={{ marginRight: '8px' }} /> Confirmar y Enviar</>}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="nav-button next-button"
                    >
                        Siguiente <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResponderEncuesta;