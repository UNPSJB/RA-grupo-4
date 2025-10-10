import { useState } from "react";

function EncuestasDisponibles() {
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [mostrarListado, setMostrarListado] = useState(false);

  const cargarEncuestasDisponibles = async () => {
    try {
      const url = "http://localhost:8000/encuestas";
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
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
          {encuestas.length === 0 ? (
            <div>
              <p>No hay encuestas disponibles.</p>
              <button>Crear nueva encuesta</button>
            </div>
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

