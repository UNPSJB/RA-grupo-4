import React, { useState } from "react";
import HeaderInstitucional from "../componentes/HeaderInstitucional";
import CompletarDatosCabecera from "../componentes/CompletarDatosCabeceraDep";
import AutocompletarInformacionGeneral from "../componentes/AutocompletarInformacionGeneral";

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: "#f4f7f6",
    padding: "0px",
    minHeight: "100vh",
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  container: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    animation: "fadeIn 0.6s ease-out",
  },
  title: {
    textAlign: "center",
    color: "#000",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "30px",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px",
  },
};

const GenerarInformeSintetico: React.FC = () => {
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number | null>(null);

  return (
    <div style={styles.page}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={styles.container}>
        <HeaderInstitucional />
        <h1 style={styles.title}>Generar Informe Sintético</h1>

        <CompletarDatosCabecera
          onSubmitSuccess={() => alert("Cabecera guardada")}
          onDepartamentoSeleccionado={setDepartamentoSeleccionado}
        />

        <AutocompletarInformacionGeneral departamentoId={departamentoSeleccionado} />
      </div>
    </div>
  );
};

export default GenerarInformeSintetico;
