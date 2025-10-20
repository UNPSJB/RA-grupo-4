import React, { useState, useEffect } from 'react';
import FiltradoInformeACDep from './FiltradoInformeACDep';

// ... (tus interfaces no cambian) ...
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
interface FiltrosData {
  anio?: string;
  docente_id?: number;
}

const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  // <-- NUEVO: Estado para el mensaje de "no hay resultados"
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarInformes = async () => {
    setLoading(true);
    setError(null);
    setMostrarTabla(false); 
    setMensaje(null); // <-- MODIFICADO: Limpia el mensaje en cada carga
    try {
      const res = await fetch('http://localhost:8000/informesAC/listar');
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      const data: InformeAC[] = await res.json();
      
      // <-- MODIFICADO: Comprueba si hay datos
      if (data.length > 0) {
        setInformes(data);
        setMostrarTabla(true);
      } else {
        // Si no hay datos, muestra el mensaje
        setInformes([]);
        setMensaje("No se encontraron informes de actividad curricular.");
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarInformesFiltrados = async (filtros: FiltrosData) => {
    setLoading(true);
    setError(null);
    setMostrarTabla(false); 
    setMensaje(null); // <-- MODIFICADO: Limpia el mensaje en cada carga
    try {
      const url = new URL('http://localhost:8000/informesAC/listar');
      if (filtros.anio) {
        url.searchParams.append('anio', filtros.anio);
      }
      if (filtros.docente_id) {
        url.searchParams.append('docente_id', String(filtros.docente_id));
      }
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }
      const data: InformeAC[] = await res.json();
      
      // <-- MODIFICADO: Comprueba si hay datos
      if (data.length > 0) {
        setInformes(data);
        setMostrarTabla(true);
      } else {
        // Si no hay datos, muestra el mensaje
        setInformes([]);
        setMensaje("No hay informes con los filtros seleccionados.");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInformes(); 
  }, []); 

  return (
    <div>
      <h2>Listado de InformesAC</h2>
      
      <FiltradoInformeACDep 
        onAplicarFiltros={cargarInformesFiltrados}
        onQuitarFiltros={cargarInformes} 
      />

      {loading && <p>Cargando informes...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {/* <-- NUEVO: Muestra el mensaje si no hay resultados --> */}
      {mensaje && <p>{mensaje}</p>}

      {/* La tabla solo se muestra si mostrarTabla es true (es decir, si hay datos) */}
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
                <td>{informe.docente?.nombre ?? 'Sin materia'}</td>

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