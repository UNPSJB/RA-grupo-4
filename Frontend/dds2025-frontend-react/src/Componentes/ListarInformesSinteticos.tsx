import React, { useState, useEffect } from 'react';

interface InformeSintetico {
  id: number;
  descripcion: string;
  departamento_id: number;
}

const ListarInformesSinteticos: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const response = await fetch("http://localhost:8000/informesSinteticos"); // URL del endpoint en FastAPI

        if (!response.ok) {
          throw new Error('Hubo un error al cargar los informes.');
        }

        const data: InformeSintetico[] = await response.json();
        setInformes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    fetchInformes();
  }, []); // El array vacío asegura que se ejecute una sola vez al montar el componente.

  // Si hay error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no hay informes
  if (informes.length === 0) {
    return <div>No se encontraron informes sintéticos.</div>;
  }

  // Si hay informes, mostrarlos
  return (
    <div>
      <h1>Informes Sintéticos</h1>
      <ul>
        {informes.map((informe) => (
          <li key={informe.id}>
            <strong>Descripción:</strong> {informe.descripcion} | 
            <strong>Departamento ID:</strong> {informe.departamento_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListarInformesSinteticos;
