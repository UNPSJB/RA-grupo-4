import React, { useState } from 'react';

interface Docente {
  id_docente: number;
  nombre: string;
}

interface Materia {
  id_materia: number;
  nombre: string;
  anio: string; 
}

interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
}

const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const cargarInformes = async () => {
    setLoading(true);
    setError(null);
    setMostrarTabla(false); 

    try {
      const res = await fetch('http://localhost:8000/informesAC/listar');
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      const data: InformeAC[] = await res.json();
      setInformes(data);
      setMostrarTabla(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Listado de InformesAC</h2>
      <button onClick={cargarInformes} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Informes'}
      </button>

      {loading && <p>Cargando informes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {mostrarTabla && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Año</th>
              <th>Materia</th>
              <th>Docente</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe) => (
              <tr key={informe.id_informesAC}>
                <td>{informe.id_informesAC}</td>
                <td>{informe.materia?.anio ?? 'N/A'}</td>
                <td>{informe.materia?.nombre ?? 'Sin materia'}</td>
                <td>{informe.docente?.nombre ?? 'Sin docente'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDep;