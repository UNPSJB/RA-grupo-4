import { useState } from 'react';
import './App.css';

interface Survey {
  id_encuesta: string;
  nombre: string;
}

function App() {
  const [surveys, setSurveys] = useState<Survey[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false); 

  // Estudiante hardcodeado
  const studentId = 1;

  const fetchSurveys = async () => {
    setLoading(true);
    setError(null);
    setSurveys(null);
    setFetched(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/estudiantes/${studentId}/encuestas`);

      if (response.status === 404) {
        setError('El estudiante no existe.');
        setSurveys(null);
      } else if (!response.ok) {
        throw new Error('Error al obtener los datos de la API.');
      } else {
        const data: Survey[] = await response.json();
        setSurveys(data);
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Historial de Encuestas de Estudiante {studentId}</h1>

      {/* Botón para cargar las encuestas */}
      {!fetched && (
        <button onClick={fetchSurveys}>
          Listar Encuestas
        </button>
      )}

      {loading && <p>Cargando encuestas...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {surveys && (
        <div className="results">
          {surveys.length > 0 ? (
            <div>
              <h2>Encuestas Respondidas</h2>
              <ul>
                {surveys.map((survey, index) => (
                  <li key={index}>
                    <strong>ID de encuesta:</strong> {survey.id_encuesta} <br />
                    <strong>Nombre:</strong> {survey.nombre}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>El estudiante no tiene encuestas respondidas.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
