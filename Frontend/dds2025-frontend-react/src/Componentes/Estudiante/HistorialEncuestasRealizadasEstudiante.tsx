import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export type Survey = {
  id_encuesta: number;
  nombre: string;
  fecha?: string; // Agrego fecha opcional por si tu back la trae
};

// Por ahora, como no tenemos Login real, hardcodeamos el ID para probar
const ID_ESTUDIANTE_PRUEBA = 1; 

const HistorialEncuestasRealizadasEstudiante: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      setError(null);

      try {
        // Usamos el ID de prueba. Luego esto vendrá de tu contexto de usuario
        const response = await fetch(`http://127.0.0.1:8000/estudiantes/${ID_ESTUDIANTE_PRUEBA}/encuestas`);

        if (response.status === 404) {
          // Si es 404, asumimos que no tiene encuestas o el alumno no existe, devolvemos array vacío
          setSurveys([]);
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

    fetchSurveys();
  }, []);

  return (
    <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '30px',
        fontFamily: '"Segoe UI", Roboto, sans-serif',
        color: '#333'
    }}>
      
      <h2 style={{ 
          color: '#28a745', // Verde estilo Alumno
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '15px',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: '700'
      }}>
        Historial de Encuestas Respondidas
      </h2>

      {/* ESTADO: CARGANDO */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <p>Cargando historial...</p>
        </div>
      )}

      {/* ESTADO: ERROR */}
      {error && (
        <div style={{ 
            backgroundColor: '#fff3cd', 
            color: '#856404', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <AlertCircle size={20} />
            {error}
        </div>
      )}

      {/* ESTADO: RESULTADOS */}
      {!loading && !error && (
        <>
          {surveys.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {surveys.map((survey) => (
                <div 
                    key={survey.id_encuesta}
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                        backgroundColor: '#d4edda', 
                        color: '#155724', 
                        padding: '10px', 
                        borderRadius: '50%' 
                    }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#343a40' }}>
                            {survey.nombre}
                        </h3>
                        <span style={{ fontSize: '13px', color: '#6c757d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{fontWeight: 'bold'}}>ID Encuesta:</span> {survey.id_encuesta}
                        </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                     <span style={{ 
                         backgroundColor: '#c3e6cb', 
                         color: '#155724', 
                         padding: '5px 12px', 
                         borderRadius: '20px',
                         fontSize: '12px',
                         fontWeight: 'bold'
                     }}>
                         COMPLETADA
                     </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
                textAlign: 'center', 
                padding: '50px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '12px',
                color: '#6c757d'
            }}>
                <p style={{ fontSize: '18px', fontWeight: '500' }}>No has respondido ninguna encuesta todavía.</p>
                <p style={{ fontSize: '14px' }}>Las encuestas completadas aparecerán aquí.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistorialEncuestasRealizadasEstudiante;