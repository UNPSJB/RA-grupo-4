import React, { useState, useEffect } from "react";
import FiltradoInformeACDep from "./FiltradoInformeACDep";
import VisualizarInformeACDep from "./VisualizarInformeACDep";

const BASE_URL = "http://localhost:8000";

const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<any[]>([]);
  const [informesFiltrados, setInformesFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informeSeleccionado, setInformeSeleccionado] = useState<any>(null);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/informesAC/listar`);
        if (!res.ok) throw new Error("Error al obtener informes");
        const data = await res.json();
        setInformes(data);
        setInformesFiltrados(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInformes();
  }, []);

  const handleFiltrar = (criterios: any) => {
    let filtrados = [...informes];
    if (criterios.anio) filtrados = filtrados.filter((i) => String(i.ciclo_lectivo) === String(criterios.anio));
    if (criterios.docente) filtrados = filtrados.filter((i) => i.docente?.nombre?.toLowerCase().includes(criterios.docente.toLowerCase()));
    if (criterios.materia) filtrados = filtrados.filter((i) => i.materia?.nombre?.toLowerCase().includes(criterios.materia.toLowerCase()));
    setInformesFiltrados(filtrados);
  };

  if (informeSeleccionado) {
      return (
          <VisualizarInformeACDep 
              informe={informeSeleccionado} 
              onVolver={() => setInformeSeleccionado(null)} 
          />
      );
  }

  const cellStyle = { padding: "12px", color: "#333" };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "25px", color: "#1a1a1a" }}>
        Listado de Informes de Actividad Curricular
      </h2>

      {loading && <p style={{ textAlign: "center", color: "#666", fontSize: '18px' }}>Cargando informes...</p>}
      {error && <p style={{ color: "#d32f2f", textAlign: "center", padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>{error}</p>}

      {!loading && !error && informesFiltrados.length > 0 && (
        <div style={{ overflowX: 'auto', boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: "8px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead style={{ backgroundColor: "#0078D4", color: "white" }}>
              <tr>
                <th style={{ padding: "15px", textAlign: 'left' }}>Materia</th>
                <th style={{ padding: "15px", textAlign: 'left' }}>Docente</th>
                <th style={{ padding: "15px", textAlign: 'center' }}>Año</th>
                <th style={{ padding: "15px", textAlign: 'center' }}>Ciclo</th>
                <th style={{ padding: "15px", textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informesFiltrados.map((inf) => {
                  const id = inf.id_informesAC ?? inf.id_informe;
                  return (
                    <tr key={id} style={{ borderBottom: "1px solid #eee", transition: 'background 0.2s' }}>
                      <td style={{ ...cellStyle, fontWeight: '500' }}>{inf.materia?.nombre}</td>
                      <td style={cellStyle}>{inf.docente?.nombre}</td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>{inf.materia?.anio}</td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>{inf.ciclo_lectivo}</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <button
                            onClick={() => setInformeSeleccionado(inf)}
                            style={{
                                backgroundColor: "#0078D4", color: "white", border: "none",
                                borderRadius: "6px", padding: "8px 16px", cursor: "pointer",
                                fontSize: '14px', fontWeight: '500',
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                boxShadow: '0 2px 4px rgba(0,120,212,0.2)'
                            }}
                        >
                           <span>👁️</span> Ver Informe
                        </button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <FiltradoInformeACDep onFiltrar={handleFiltrar} />
      </div>
    </div>
  );
};

export default ListadoInformesACDep;