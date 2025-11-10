import React, { useState, useEffect, useCallback } from 'react';
import ErrorCargaDatos from './ErrorCargaDatos';
import SinDatos from '../Otros/SinDatos';

interface InformeSintetico {
  id: number;
  descripcion: string;
  departamento_id: number;
}

const ListarInformesSinteticos: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInformes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/informes-sinteticos");

      if (!response.ok) {
        throw new Error('Hubo un error al cargar los informes.');
      }

      const data: InformeSintetico[] = await response.json();
      setInformes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);


  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#003366' }}>Cargando informes...</div>;
  }

  if (error) {
    return (
      <ErrorCargaDatos 
        mensajeError={error} 
        onReintentar={fetchInformes} 
      />
    );
  }

  // --- USO DEL NUEVO COMPONENTE SIN DATOS ---
  if (informes.length === 0) {
    return <SinDatos mensaje="No se encontraron informes sintéticos registrados." />;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ color: '#003366', borderBottom: '2px solid #0078D4', paddingBottom: 10 }}>
        Informes Sintéticos
      </h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {informes.map((informe) => (
          <li 
            key={informe.id} 
            style={{ 
              padding: '15px', 
              marginBottom: '10px', 
              backgroundColor: '#f9f9f9', 
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          >
            <strong style={{ color: '#003366' }}>Descripción:</strong> {informe.descripcion} <br/>
            <small style={{ color: '#666' }}>Departamento ID: {informe.departamento_id}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarInformesSinteticos;