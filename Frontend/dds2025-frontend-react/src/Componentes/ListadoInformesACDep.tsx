import React, { useState } from 'react';
// <-- NUEVO: Importa tu componente de filtrado
import FiltradoInformesACDep from './FiltradoInformeACDep';


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

// <-- NUEVO: Define una interfaz para los filtros que tu componente enviará
// (Ajusta esto según los filtros reales que tengas: anio, id_docente, etc.)
interface FiltrosData {
  anio?: string;
  docente_id?: number;
  // Agrega aquí otros filtros que tu componente pueda manejar
}


const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  // --- FUNCIÓN ORIGINAL (Carga todo) ---
  // Esta función se queda como estaba, para tu botón original
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

  // --- NUEVA FUNCIÓN (Carga con filtros) ---
  // Esta función la usará tu componente FiltradoInformesACDep
  const cargarInformesFiltrados = async (filtros: FiltrosData) => {
    setLoading(true);
    setError(null);
    setMostrarTabla(false); 

    try {
      // Construye la URL con query parameters
      const url = new URL('http://localhost:8000/informesAC/listar');
      
      // Agrega los filtros a la URL si existen
      if (filtros.anio) {
        url.searchParams.append('anio', filtros.anio);
      }
      if (filtros.docente_id) {
        url.searchParams.append('docente_id', String(filtros.docente_id));
      }
      // ... agrega más 'if' para otros filtros

      const res = await fetch(url.toString()); // Usa la URL con filtros
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
      
      {/* Botón original sin modificar */}
      <button onClick={cargarInformes} disabled={loading}>
        {loading ? 'Cargando...' : 'Cargar Informes'}
      </button>

      {/* <-- NUEVO: Aquí agregamos tu componente de filtrado --> */}
      {/* * Asumo que tu componente 'FiltradoInformesACDep' (que puede contener inputs y un botón)
        * aceptará una prop llamada 'onAplicarFiltros'.
        * Cuando el usuario haga clic en el botón *dentro* de tu componente,
        * tu componente deberá llamar a esta prop con los datos del filtro.
      */}
      <FiltradoInformesACDep onAplicarFiltros={cargarInformesFiltrados} />


      {loading && <p>Cargando informes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {mostrarTabla && (
        // ... (Tu tabla sigue exactamente igual) ...
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