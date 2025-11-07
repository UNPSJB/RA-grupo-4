import React, { useState } from "react";
import HeaderInstitucional from "../componentes/HeaderInstitucional";
import CompletarDatosCabeceraDep from "./Departamento/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "./Departamento/AutoCompletarInformacionGeneral";
import AutocompletarNecesidadesDep from "./Departamento/AutocompletarNecesidadesDep";

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
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);

  // Callback que viene desde CompletarDatosCabeceraDep
  const handleDepartamentoSeleccionado = (id: number) => {
    setDepartamentoSeleccionado(id);
  };

  return (
    <div>
      <HeaderInstitucional />

      <div style={styles.container}>
        <h1 style={styles.titulo}>Informe Sintetico </h1>

        {/* --- Sección: Completar datos de cabecera --- */}
        <section>
          <CompletarDatosCabeceraDep
            onDepartamentoSeleccionado={handleDepartamentoSeleccionado}
          />
        </section>

        {/* --- Separador visual --- */}
        <div style={styles.divider}></div>

        {/* --- Sección: Información general --- */}
        <section style={styles.section}>
          {departamentoSeleccionado ? (
            <AutocompletarInformacionGeneral departamentoId={departamentoSeleccionado} />
          ) : (
            <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
              Seleccione un departamento para ver la información general.
            </p>
          )}
        </section>

        {/* --- Separador visual --- */}
        <div style={styles.divider}></div>

        {/* --- Sección: Necesidades y equipamiento --- */}
        <section style={styles.section}>
          {departamentoSeleccionado ? (
            <AutocompletarNecesidadesDep departamentoId={departamentoSeleccionado} />
          ) : (
            <p style={{ textAlign: "center", color: "#666", fontSize: "16px" }}>
              Seleccione un departamento para ver las necesidades y equipamiento.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default GenerarInformeSinteticoDep;
