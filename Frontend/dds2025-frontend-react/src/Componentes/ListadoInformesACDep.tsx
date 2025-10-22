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
  const [error, setError] = useState<string | null>(null); // Añadido manejo de errores

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
      })
      .catch((err) => {
        console.error(err);
        setError(err.message); // Guardar error en el estado
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: "#333" }}>Cargando informes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

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
    <div className="content-card">
      <h3 className="content-title">Listado de Informes de Actividad Curricular</h3>
      {informes.length === 0 ? (
        <p>No hay informes disponibles.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: "6px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#444" }}>
              <th style={{ border: "1px solid #555", padding: "12px", textAlign: "left" }}>ID</th>
              <th style={{ border: "1px solid #555", padding: "12px", textAlign: "left" }}>Año</th>
              <th>Materia</th>
              <th>Docente</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe, index) => (
              <tr key={informe.id_informesAC} style={{ backgroundColor: index % 2 === 0 ? "#2b2b2b" : "#1e1e1e" }}>
                <td style={{ border: "1px solid #444", padding: "12px" }}>{informe.id_informesAC}</td>
                <td style={{ border: "1px solid #444", padding: "12px" }}>{new Date(informe.anio).getFullYear()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDep;