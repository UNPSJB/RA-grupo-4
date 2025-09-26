import { useState } from "react";
import axios from "axios";

function EncuestasDisponibles() {
  const [encuestas, setEncuestas] = useState<any[]>([]);
  const [mostrarListado, setMostrarListado] = useState(false);

  const cargarEncuestasDisponibles = async () => {
    try {
      const url = "http://localhost:8000/encuestas";
      const res = await axios.get(url);
      console.log("Datos recibidos:", res.data);

      const disponibles = res.data.filter(
        (e: any) => e.disponible === true || e.disponible === 1
      );

      setEncuestas(disponibles);
      setMostrarListado(true);
    } catch (err) {
      console.error("Error al obtener encuestas:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Encuestas disponibles</h2>

      {/* Botón para cargar encuestas disponibles */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={cargarEncuestasDisponibles}>
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