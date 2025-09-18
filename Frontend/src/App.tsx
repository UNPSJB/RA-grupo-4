import React from 'react';
import './App.css'
import AgregarPreguntaAEncuesta from './Componentes/AgregarPreguntaAEncuesta';

function App() {
  const encuesta_id = 1;
  return (
    <div className="App">
      <h1>HdU: agregar preguntas a la encuesta</h1>
      <AgregarPreguntaAEncuesta idEncuesta={encuesta_id} />
    </div>
  );
}

export default App;