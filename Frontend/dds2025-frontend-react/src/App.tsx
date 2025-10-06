import React, { useState } from "react";
import AgregarPreguntaAEncuesta from "./Componentes/AgregarPreguntaAEncuesta";
import HistorialEncuestas from "./Componentes/HistorialEncuestasRealizadasEstudiante";
import EncuestasDisponibles from "./Componentes/EncuestasList";
import ListadoInformesACDep from "./Componentes/ListadoInformesACDep"; 

function App() {
  const [idEncuestaSeleccionada, setIdEncuestaSeleccionada] = useState<number>(1);
  const [idEstudiante, setIdEstudiante] = useState<number>(1);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestión de Encuestas</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>1. Encuestas Disponibles</h2>
        <EncuestasDisponibles />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>2. Historial de Encuestas del Estudiante</h2>
        <HistorialEncuestas studentId={idEstudiante} />
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>3. Listado de Informes de Actividad Curricular del Departamento</h2>
        <ListadoInformesACDep />
      </section>

      <section>
        <h2>4. Agregar Pregunta a Encuesta</h2>
        <AgregarPreguntaAEncuesta idEncuesta={idEncuestaSeleccionada} />
      </section>
    </div>
  );
}

export default App;
