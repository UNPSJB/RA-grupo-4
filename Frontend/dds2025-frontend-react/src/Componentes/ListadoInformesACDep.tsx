import { useState } from "react";

interface InformeAC {
  id_informesAC: number;
  anio: string;
}

const ListadoInformesACDep = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarListado, setMostrarListado] = useState(false);

  const cargarInformes = async () => {
    setLoading(true);
    setError(null);
    setMostrarListado(true);

    try {
      const res = await fetch("http://localhost:8000/informesAC");

      if (!res.ok) {
        throw new Error("Error al obtener informes");
      }

      const data = await res.json();
      setInformes(data);
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con la base de datos.");
      setInformes([]);
    } finally {
      setLoading(false);
    }
  };

  const estiloBoton = {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginBottom: "20px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Listado de Informes de Actividad Curricular</h3>

      <button style={estiloBoton} onClick={cargarInformes}>
        Cargar informes
      </button>

      {mostrarListado && (
        <>
          {loading ? (
            <p>Cargando informes...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : informes.length === 0 ? (
            <p>No hay informes disponibles.</p>
          ) : (
            <table
              border={1}
              cellPadding={8}
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Año</th>
                </tr>
              </thead>
              <tbody>
                {informes.map((informe) => (
                  <tr key={informe.id_informesAC}>
                    <td>{informe.id_informesAC}</td>
                    <td>{new Date(informe.anio).getFullYear()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ListadoInformesACDep;
