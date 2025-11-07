import React, { useState } from "react";
import HeaderInstitucional from "../componentes/HeaderInstitucional";
// Importa tus componentes hijos...
import CompletarDatosCabeceraDep from "./Departamento/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "./Departamento/AutoCompletarInformacionGeneral";
import AutocompletarNecesidadesDep from "./Departamento/AutocompletarNecesidadesDep";
import AutocompletarValoracionesDep from "./Departamento/AutocompletarValoracionesDep";
// Importamos el nuevo componente de comentarios
import ComentariosFinalesDep from "./Departamento/ComentariosFinalesDep";

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
    comentarios: "" 
  });
  const [creando, setCreando] = useState(false);

  // Handlers para actualizar el estado desde los hijos
  const handleDepartamentoSeleccionado = (id: number) => {
      setDatosInforme(prev => ({ ...prev, departamento_id: id }));
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
    // Puedes agregar más validaciones aquí si periodo o sede son obligatorios desde el inicio

    setCreando(true);
    try {
        const response = await fetch(`${API_BASE}/informes-sinteticos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Enviamos todo el estado junto
            body: JSON.stringify(datosInforme)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al crear el informe");
        }
        
        const data = await response.json();
        alert(`¡Informe Sintético creado con éxito! ID: ${data.id}`);
        // Aquí podrías redirigir al usuario o limpiar el formulario
    } catch (error: any) {
        console.error("Error creando informe:", error);
        alert(`Error al crear el informe: ${error.message}`);
    } finally {
        setCreando(false);
    }
  };

  return (
    <div>
      <HeaderInstitucional />

      <div style={styles.container}>
        <h1 style={styles.titulo}>Generar Informe Sintético</h1>

        {/* SECCIÓN 1: CABECERA (Debe actualizar datosInforme, por ahora solo ID depto) */}
        <section>
           {/* NOTA: Deberás ajustar CompletarDatosCabeceraDep para que pase 
               periodo, sede e integrantes hacia arriba si quieres guardarlos también.
               Por ahora solo recibe el ID. */}
          <CompletarDatosCabeceraDep onDepartamentoSeleccionado={handleDepartamentoSeleccionado} />
        </section>

        {/* SECCIONES DE PREVISUALIZACIÓN (Solo visibles si hay depto seleccionado) */}
        {datosInforme.departamento_id > 0 && (
            <>
                <div style={styles.divider}></div>
                <section style={styles.section}>
                <AutocompletarInformacionGeneral departamentoId={datosInforme.departamento_id} />
                </section>

                <div style={styles.divider}></div>
                <section style={styles.section}>
                <AutocompletarNecesidadesDep departamentoId={datosInforme.departamento_id} />
                </section>

                <div style={styles.divider}></div>
                <section style={styles.section}>
                <AutocompletarValoracionesDep departamentoId={datosInforme.departamento_id} />
                </section>
            </>
        )}

        <div style={styles.divider}></div>

        {/* SECCIÓN FINAL: COMENTARIOS Y BOTÓN DE CREACIÓN */}
        <section style={styles.section}>
           <ComentariosFinalesDep 
              informeId={null} // Aún no existe
              modoCreacion={true} // Activamos modo creación
              onChange={handleComentariosChange} // Recibimos el texto
           />

           {/* BOTÓN FINAL GRANDE */}
           <div style={{ marginTop: 40, textAlign: 'right' }}>
               <button 
                   onClick={handleCrearInformeFinal}
                   disabled={creando || !datosInforme.departamento_id}
                   style={{
                       padding: '15px 40px', 
                       fontSize: '1.2rem', 
                       fontWeight: 'bold', 
                       color: 'white',
                       backgroundColor: '#28a745', // Verde éxito
                       border: 'none', 
                       borderRadius: '8px', 
                       cursor: 'pointer',
                       boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
                       transition: 'all 0.3s ease',
                       opacity: (creando || !datosInforme.departamento_id) ? 0.6 : 1
                   }}
               >
                   {creando ? "Generando..." : "✅ FINALIZAR Y CREAR INFORME"}
               </button>
           </div>
        </section>

      </div>
    </div>
  );
};

export default GenerarInformeSinteticoDep;