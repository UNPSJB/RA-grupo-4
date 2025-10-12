import { useState } from "react";

function EncuestasDisponibles() {
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [mostrarListado, setMostrarListado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarEncuestasDisponibles = async () => {
    try {
      setError(null);
      const res = await fetch("http://localhost:8000/encuestas");

      if (!res.ok) {
        throw new Error("Error al obtener encuestas");
      }

      const data = await res.json();
      console.log("Datos recibidos:", data);

      const disponibles = data.filter(
        (e: any) => e.disponible === true || e.disponible === 1
      );

      setEncuestas(disponibles);
      setMostrarListado(true);
    } catch (err) {
      console.error("Error al obtener encuestas:", err);
      setError("No se pudo cargar la lista de encuestas.");
      setEncuestas([]);
      setMostrarListado(true);
    }
  };

  const estiloBotonAzul = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Encuestas disponibles</h2>

      <div style={{ marginBottom: "20px" }}>
        <button style={estiloBotonAzul} onClick={cargarEncuestasDisponibles}>
          Listar encuestas disponibles
        </button>
      </div>

      {mostrarListado && (
        <>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : encuestas.length === 0 ? (
            <p>No hay encuestas disponibles.</p>
          ) : (
            <table
              border={1}
              cellPadding={8}
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {encuestas.map((encuesta) => (
                  <tr key={encuesta.id_encuesta}>
                    <td>{encuesta.id_encuesta}</td>
                    <td>{encuesta.nombre || "(Sin nombre)"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default EncuestasDisponibles;
