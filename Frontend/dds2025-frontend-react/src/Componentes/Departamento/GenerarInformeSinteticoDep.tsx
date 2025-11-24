import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

import HeaderInstitucional from "../Otros/HeaderInstitucional.tsx";
// --- Importaciones de Componentes Hijos ---
import CompletarDatosCabeceraDep from "../Departamento/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "../Departamento/AutoCompletarInformacionGeneral";
import AutocompletarNecesidadesDep from "../Departamento/AutocompletarNecesidadesDep";
import AutocompletarValoracionesDep from "../Departamento/AutocompletarValoracionesDep";
import ComentariosFinalesDep from "../Departamento/ComentariosFinalesDep";
import ConsignarDesarrolloDeActividadesDep from "./ConsignarDesarrolloDeActividadesDep.tsx";
import PorcentajesInformeSintetico from "../Departamento/PorcentajesInformeSintetico.tsx";
import AspecPosObstaculosInformeSintetico from "../Departamento/AspecPositivosObstaculosInformeSintetico.tsx";

import { createPortal } from "react-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";


const styles = {
    // --- ESTILOS DE LA NOTIFICACIÓN FLOTANTE ---
  floatingNotification: {
    position: 'fixed' as 'fixed', 
    top: '20px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    backgroundColor: 'white',
    padding: '20px 25px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)', 
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'flex-start' as 'flex-start', 
    maxWidth: '450px', 
    width: '90%', 
    animation: 'slideDownFade 0.5s ease-out forwards',
    borderTop: '6px solid', // Color se definirá dinámicamente
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    borderBottom: '1px solid #eee',
  },
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '15px',
  },
  notificationTitle: {
    margin: '0 0 0 15px',
    fontSize: '20px',
    fontWeight: '700',
    flexGrow: 1,
  },
  notificationText: {
    color: '#555',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '10px',
    width: '100%',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 5px',
    lineHeight: '1',
  },
  redirectText: {
    color: '#999',
    fontSize: '13px',
    fontStyle: 'italic',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
    // --- ESTILOS DEL CONTENEDOR PRINCIPAL ---
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#f9fbfd",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  section: {
    marginTop: "40px",
  },
  titulo: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#003366", 
    marginBottom: "30px",
    textAlign: "center" as const, 
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "15px"
  },
  divider: {
    height: "2px",
    backgroundColor: "#e0e0e0", 
    margin: "40px 0",
    borderRadius: "2px",
  },
};

// ------------------- NOTIFICACIÓN FLOTANTE -------------------
const FloatingNotification: React.FC<{
  tipo: "exito" | "error";
  mensaje: string;
  segundos?: number;
  onClose: () => void;
}> = ({ tipo, mensaje, segundos = 5, onClose }) => {
  const [contador, setContador] = useState(segundos);
  
  const colorPrincipal = tipo === "exito" ? "#4CAF50" : "#dc3545";
  const colorFondoIcono = tipo === "exito" ? "#e8f5e9" : "#f8d7da";
  const titulo = tipo === "exito" ? "¡Informe Creado!" : "Error al Enviar";
  const icono = tipo === "exito" ? '✔️' : '❌';

  useEffect(() => {
    const interval = setInterval(() => setContador((c) => c - 1), 1000);
    const timeout = setTimeout(onClose, segundos * 1000); 

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [segundos, onClose]);

  return createPortal(
    <>
      <div style={{...styles.floatingNotification, borderTop: `6px solid ${colorPrincipal}`}}>
          <div style={styles.notificationHeader}>
            <div style={{ width: '35px', height: '35px', backgroundColor: colorFondoIcono, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px', color: colorPrincipal }}>{icono}</span>
            </div>
            <h3 style={{...styles.notificationTitle, color: colorPrincipal}}>{titulo}</h3>
            <button onClick={onClose} style={styles.closeButton} title="Cerrar notificación">×</button>
          </div>

          <p style={styles.notificationText}>
            {mensaje}
          </p>
          
          {tipo === "exito" && (
            <div style={styles.redirectText}>
              <span>{contador > 0 ? '⏳' : '✅'}</span> 
              <span style={contador > 0 ? { animation: 'pulseGray 2s infinite' } : {}}>
                {contador > 0 ? `Volviendo a la vista principal en ${contador}s...` : 'Redirigiendo...'}
              </span>
            </div>
          )}
      </div>
    </>
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
    const [segundosRestantes, setSegundosRestantes] = useState(5);

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
                const resPeriodo = await fetch(`http://localhost:8000/periodos/${periodoId}`);
                if (!resPeriodo.ok) throw new Error("Error obteniendo periodo");

                const dataPeriodo = await resPeriodo.json();
                setPeriodo(dataPeriodo);

                // Obtener datos del departamento 
                const resDepto = await fetch(`http://localhost:8000/departamentos/${departamentoId}`);
                if (!resDepto.ok) throw new Error("Error obteniendo departamento");

                const dataDepto = await resDepto.json();
                setDepartamento(dataDepto);

            } catch (error) {
                console.error("Error cargando datos iniciales:", error);
            }
        };

        fetchDatos();
    }, [periodoId, departamentoId]);



    useEffect(() => {
        let timerRedirect: NodeJS.Timeout;
        let timerCount: NodeJS.Timeout;

        if (informeGenerado) {
            setSegundosRestantes(5); 
            timerRedirect = setTimeout(() => {
                navigate(-1); 
            }, 5000);
            timerCount = setInterval(() => {
                setSegundosRestantes((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(timerRedirect);
            clearInterval(timerCount);
        };
    
  }, [informeGenerado]); 


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

    const handleCrearInformeFinal = async () => {
        if (!datosInforme.departamento_id) {
            setMensaje({ tipo: "error", texto: "Por favor seleccione un Departamento antes de continuar." });
            return;
        }
        if (!datosInforme.sede || datosInforme.sede === "") {
            setMensaje({ tipo: "error", texto: "Por favor seleccione una Sede antes de continuar." });
            return;
        }

        setCreando(true);
        setMensaje(null);
        setInformeGenerado(null);

        try {
            // Preparamos el payload correcto
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
            setMensaje({ tipo: "exito", texto: `El informe ha sido guardado correctamente. ID: ${data.id}` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error: any) {
            setMensaje({ tipo: "error", texto: `Error: ${error.message || "desconocido"}` });
            setInformeGenerado(null);
        } finally {
            setCreando(false);
        }
    };
    return (
        <div>
            <HeaderInstitucional />

            {/* --- ESTILOS GLOBALES REFORZADOS --- */}
            <style>{`
                /* Animaciones globales */
                @keyframes slideDownFade { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
                @keyframes pulseGray { 0% { color: #999; } 50% { color: #555; } 100% { color: #999; } }

                /* --- ARREGLO REFORZADO PARA COLOR BLANCO EN TEXTO --- */
                /* Selecciona elementos con el fondo azul específico (aprox #005f9e o rgb(0, 95, 158)) */
                [style*="background-color: rgb(0, 95, 158)"], 
                [style*="background-color: #005f9e"],
                [style*="background-color:#005f9e"],
                [style*="rgb(0, 120, 212)"], /* Otro azul común en tus componentes (#0078D4) */
                [style*="#0078D4"] {
                    color: #ffffff !important;
                }

                /* Fuerza el color blanco en TODOS los hijos directos e indirectos de esos contenedores azules */
                [style*="background-color: rgb(0, 95, 158)"] *, 
                [style*="background-color: #005f9e"] *,
                [style*="background-color:#005f9e"] *,
                [style*="rgb(0, 120, 212)"] *,
                [style*="#0078D4"] * {
                    color: #ffffff !important;
                }
            `}</style>

            <div 
                style={{
                    ...styles.container, 
                    opacity: informeGenerado || mensaje?.tipo === 'exito' ? 0.4 : 1, 
                    filter: informeGenerado || mensaje?.tipo === 'exito' ? 'blur(2px)' : 'none', 
                    transition: 'all 0.5s',
                    pointerEvents: informeGenerado || mensaje?.tipo === 'exito' ? 'none' : 'auto' 
                }}
            >
                <h1 style={styles.titulo}>Generar Informe Sintético</h1>

                <section>
                    <CompletarDatosCabeceraDep
                        onCabeceraChange={handleCabeceraChange}
                    />
                </section>

                {datosInforme.departamento_id > 0 && (
                    <>
                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <AutocompletarInformacionGeneral departamentoId={departamentoId} />
                        </section>

                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <AutocompletarNecesidadesDep departamentoId={departamentoId} />
                        </section>

                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <PorcentajesInformeSintetico departamentoId={departamentoId} periodoId={periodoId} />
                        </section>

                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <AspecPosObstaculosInformeSintetico departamentoId={departamentoId} periodoId={periodoId} />
                        </section>

                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <ConsignarDesarrolloDeActividadesDep departamentoId={departamentoId} periodoId={periodoId}/>
                        </section>

                        <div style={styles.divider}></div>
                        <section style={styles.section}>
                            <AutocompletarValoracionesDep departamentoId={departamentoId} />
                        </section>
                    </>
                )}

                <div style={styles.divider}></div>

                <section style={styles.section}>
                    <ComentariosFinalesDep informeId={null} modoCreacion={true} onChange={handleComentariosChange} />

                    <div style={{ marginTop: 40, textAlign: "right" }}>
                        <button
                            onClick={handleCrearInformeFinal}
                            disabled={creando || !datosInforme.departamento_id}
                            style={{
                                padding: "15px 40px",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                color: "white",
                                backgroundColor: "#28a745",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(40, 167, 69, 0.3)",
                                transition: "all 0.3s ease",
                                opacity: creando || !datosInforme.departamento_id ? 0.6 : 1,
                            }}
                        >
                            {creando ? "Generando..." : "FINALIZAR Y CREAR INFORME"}
                        </button>
                    </div>
                </section>
            </div>
            
            {/* NOTIFICACIÓN FLOTANTE */}
            {mensaje && (
                <FloatingNotification
                    tipo={mensaje.tipo}
                    mensaje={mensaje.texto}
                    segundos={5}
                    onClose={() => {
                        setMensaje(null);
                        if (informeGenerado && mensaje.tipo === 'exito') {
                            navigate(-1); 
                        }
                    }}
                />
            )}
        </div>
    );
};

export default GenerarInformeSinteticoDep;