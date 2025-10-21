import React, { useEffect, useState } from "react";

interface InformeAC {
  id_informesAC: number;
  anio: string;
}

const ListadoInformesACDoc: React.FC = () => {
  const idDocenteActual = 1;
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setCargando(true);
        setError(null);
        const response = await fetch(
          `http://localhost:8000/informesAC/docente/${idDocenteActual}`
        );
        if (!response.ok) throw new Error("Error al obtener informes");
        const data: InformeAC[] = await response.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    fetchInformes();
  }, []);

  if (cargando) return <p style={{ color: "#333" }}>Cargando informes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="content-card">
      <h3 className="content-title">
        Informes de Actividad Curricular del Docente
      </h3>

      {informes.length === 0 ? (
        <p>No hay informes disponibles para este docente.</p>
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
                Año
              </th>
            </tr>
          </thead>
          <tbody>
            {informes.map((inf, index) => (
              <tr
                key={inf.id_informesAC}
                style={{
                  backgroundColor: index % 2 === 0 ? "#2b2b2b" : "#1e1e1e",
                }}
              >
                <td style={{ border: "1px solid #444", padding: "12px" }}>
                  {inf.id_informesAC}
                </td>
                <td style={{ border: "1px solid #444", padding: "12px" }}>
                  {new Date(inf.anio).getFullYear()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDoc;