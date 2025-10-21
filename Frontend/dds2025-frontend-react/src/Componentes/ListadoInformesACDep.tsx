import React, { useEffect, useState } from "react";

interface InformeAC {
  id_informesAC: number;
  anio: string;
}

const ListadoInformesACDep: React.FC = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Añadido manejo de errores

  useEffect(() => {
    fetch("http://localhost:8000/informesAC") 
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener informes");
        return res.json();
      })
      .then((data) => {
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
