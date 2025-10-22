import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface InformeSintetico {
  id: number;
  descripcion: string;
}

const SeleccionarInformeSinteticoSEC: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformesSinteticos = async () => {
      try {
        setCargando(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/informesSinteticos/`
        );
        if (!response.ok) throw new Error("Error al obtener los informes sintéticos");
        const data: InformeSintetico[] = await response.json();
        setInformes(data);
        
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    fetchInformesSinteticos();
  }, []);

  if (cargando) return <p style={{ color: "#333" }}>Cargando informes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="content-card">
      <h3 className="content-title">
        Seleccionar Informe Sintético
      </h3>

      {informes.length === 0 ? (
        <p>No hay informes sintéticos disponibles.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#444", color: "#fff" }}>
              <th style={{ border: "1px solid #555", padding: "12px", textAlign: "left" }}>
                ID
              </th>
              <th style={{ border: "1px solid #555", padding: "12px", textAlign: "left" }}>
                Descripción
              </th>
              <th style={{ border: "1px solid #555", padding: "12px", textAlign: "left" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {informes.map((inf, index) => (
              <tr
                key={inf.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#2b2b2b" : "#1e1e1e",
                }}
              >
                <td style={{ border: "1px solid #444", padding: "12px" }}>
                  {inf.id}
                </td>
                <td style={{ border: "1px solid #444", padding: "12px" }}>
                  {inf.descripcion}
                </td>
                <td style={{ border: "1px solid #444", padding: "12px" }}>
                  <Link to={`/home/informe-sintetico/ver/${inf.id}`} className="styled-button">
                    Seleccionar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SeleccionarInformeSinteticoSEC;