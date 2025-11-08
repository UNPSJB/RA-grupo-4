import React, { useState, useEffect } from "react";
import FiltradoInformeACDep from "./FiltradoInformeACDep";

const BASE_URL = "http://localhost:8000";

const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<any[]>([]);
  const [informesFiltrados, setInformesFiltrados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de informes
  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/informesAC/listar`);
        if (!res.ok) throw new Error("Error al obtener los informes");
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

  // Handler del filtro
  const handleFiltrar = (criterios: any) => {
    let filtrados = [...informes];

    if (criterios.anio) {
      filtrados = filtrados.filter(
        (i) => String(i.ciclo_lectivo) === String(criterios.anio)
      );
    }
    if (criterios.docente) {
      filtrados = filtrados.filter((i) =>
        i.docente?.nombre?.toLowerCase().includes(criterios.docente.toLowerCase())
      );
    }
    if (criterios.materia) {
      filtrados = filtrados.filter((i) =>
        i.materia?.nombre?.toLowerCase().includes(criterios.materia.toLowerCase())
      );
    }

    setInformesFiltrados(filtrados);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", fontSize: "22px", marginBottom: "20px" }}>
        Listado de Informes de Actividad Curricular
      </h2>

      {/* Sección de filtro */}
      <FiltradoInformeACDep onFiltrar={handleFiltrar} />

      {loading && <p style={{ textAlign: "center" }}>Cargando informes...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && informesFiltrados.length === 0 && (
        <p style={{ textAlign: "center", color: "#555" }}>No se encontraron informes.</p>
      )}

      {!loading && !error && informesFiltrados.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            background: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#0078D4", color: "white" }}>
            <tr>
              <th style={{ padding: "10px" }}>Materia</th>
              <th style={{ padding: "10px" }}>Docente</th>
              <th style={{ padding: "10px" }}>Año</th>
              <th style={{ padding: "10px" }}>Ciclo Lectivo</th>
            </tr>
          </thead>
          <tbody>
            {informesFiltrados.map((inf, index) => (
              <tr
                key={inf.id_informe ?? `${inf.materia?.nombre}-${index}`} 
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "8px" }}>{inf.materia?.nombre || "—"}</td>
                <td style={{ padding: "8px" }}>{inf.docente?.nombre || "—"}</td>
                <td style={{ padding: "8px" }}>{inf.materia?.anio || "—"}</td>
                <td style={{ padding: "8px" }}>{inf.ciclo_lectivo || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDep;
