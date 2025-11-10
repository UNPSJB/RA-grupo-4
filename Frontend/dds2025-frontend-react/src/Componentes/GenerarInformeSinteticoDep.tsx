import React, { useState } from "react";
import HeaderInstitucional from "../Componentes/HeaderInstitucional";

// --- Importaciones de Componentes Hijos ---
import CompletarDatosCabeceraDep from "./Departamento/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "./Departamento/AutoCompletarInformacionGeneral";
import AutocompletarNecesidadesDep from "./Departamento/AutocompletarNecesidadesDep";
import AutocompletarValoracionesDep from "./Departamento/AutocompletarValoracionesDep";
import ComentariosFinalesDep from "./Departamento/ComentariosFinalesDep";
import ConsolidarDesarrolloDeActividades from "./ConsignarDesarrolloDeActividadesDep.tsx";

import PorcentajesInformeSintetico from "./Departamento/PorcentajesInformeSintetico.tsx";
import AspecPosObstaculosInformeSintetico from "./Departamento/AspecPositivosObstaculosInformeSintetico.tsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const styles = {
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
    color: "#222",
    marginBottom: "20px",
  },
  divider: {
    height: "2px",
    backgroundColor: "#0078D4",
    margin: "30px 0",
    borderRadius: "2px",
  },
};

const GenerarInformeSinteticoDep: React.FC = () => {
  // Estado global del informe a crear
  const [datosInforme, setDatosInforme] = useState({
    departamento_id: 0,
    periodo: "",
    sede: "",
    integrantes: "",
    comentarios: "",
    descripcion: "Informe Sintético del Departamento", 
    anio: 2025,
  });
  const [creando, setCreando] = useState(false);

  // Handlers para actualizar el estado desde los hijos
  const handleDepartamentoSeleccionado = (id: number) => {
      setDatosInforme(prev => ({ ...prev, departamento_id: id }));
  };

const handleCabeceraChange = (data: { periodo: string, sede: string, integrantes: string }) => {
      setDatosInforme(prev => ({ 
          ...prev, 
          periodo: data.periodo,
          sede: data.sede,
          integrantes: data.integrantes,
          // Nota: Si 'periodo' es un año (ej: "2025"), también podrías querer actualizar 'anio' aquí:
          anio: Number(data.periodo) || 2025 
      }));
  };

  // Handler para recibir los comentarios del componente hijo
  const handleComentariosChange = (texto: string) => {
    setDatosInforme(prev => ({ ...prev, comentarios: texto }));
  };

  // FUNCIÓN PRINCIPAL: CREAR EL INFORME
  const handleCrearInformeFinal = async () => {
    // Validación básica antes de enviar
    if (!datosInforme.departamento_id) {
        alert("Por favor seleccione un Departamento antes de continuar.");
        return;
    }
    
    if (!datosInforme.sede || datosInforme.sede === "") {
      alert("Por favor seleccione una Sede (Trelew, Esquel, etc.) antes de continuar.");
      return;
    }

    setCreando(true);
    try {
        console.log("Datos que se enviarán:", datosInforme);
        const response = await fetch(`${API_BASE}/informes-sinteticos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosInforme)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al crear el informe");
        }

        const data = await response.json();
        alert(`¡Informe Sintético creado con éxito! ID: ${data.id}`);
    } catch (error: any) {
        console.error("Error creando informe:", error);
        const errorMessage = error.message || (error.response?.json()?.detail || "Error desconocido");
        alert(`Error al crear el informe: ${JSON.stringify(errorMessage)}`);
    } finally {
        setCreando(false);
    }
  };

  return (
    <div>
      <HeaderInstitucional />

      <div style={styles.container}>
        <h1 style={styles.titulo}>Generar Informe Sintético</h1>

        {/* Seccion cabecera*/}
        <section>
          <CompletarDatosCabeceraDep 
            onDepartamentoSeleccionado={handleDepartamentoSeleccionado} 
            onCabeceraChange={handleCabeceraChange} 
          />
        </section>

        {/* Seccione de vistas, solamente si selecciona un deparatamento en la cabecera, despues modificar cuando se agrege el periodo */}
        {datosInforme.departamento_id > 0 && (
            <>
                {/* Información General */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <AutocompletarInformacionGeneral departamentoId={datosInforme.departamento_id} />
                </section>

                {/* Consolidación de Actividades-Santi */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <ConsolidarDesarrolloDeActividades />
                </section>

                {/* Necesidades */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <AutocompletarNecesidadesDep departamentoId={datosInforme.departamento_id} />
                </section>

                {/* Porcentajes */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <PorcentajesInformeSintetico departamentoId={datosInforme.departamento_id} anio={2025} />
                </section>

                {/* Aspectos positivos y Obstaculos */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <AspecPosObstaculosInformeSintetico departamentoId={datosInforme.departamento_id} anio={2025} />
                </section>

                {/* Valoraciones */}
                <div style={styles.divider}></div>
                <section style={styles.section}>
                    <AutocompletarValoracionesDep departamentoId={datosInforme.departamento_id} />
                </section>
            </>
        )}

        <div style={styles.divider}></div>

        <section style={styles.section}>
           <ComentariosFinalesDep
              informeId={null}
              modoCreacion={true}
              onChange={handleComentariosChange}
           />

           <div style={{ marginTop: 40, textAlign: 'right' }}>
               <button
                   onClick={handleCrearInformeFinal}
                   disabled={creando || !datosInforme.departamento_id}
                   style={{
                       padding: '15px 40px',
                       fontSize: '1.2rem',
                       fontWeight: 'bold',
                       color: 'white',
                       backgroundColor: '#28a745',
                       border: 'none',
                       borderRadius: '8px',
                       cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                       transition: 'all 0.3s ease',
                       opacity: (creando || !datosInforme.departamento_id) ? 0.6 : 1
                   }}
               >
                   {creando ? "Generando..." : " FINALIZAR Y CREAR INFORME"}
               </button>
           </div>
        </section>

      </div>
    </div>
  );
};

export default GenerarInformeSinteticoDep;