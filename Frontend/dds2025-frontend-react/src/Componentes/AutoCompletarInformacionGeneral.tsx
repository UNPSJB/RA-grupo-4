import React, { useEffect, useState } from "react";

interface FilaResumen {
  codigo: string;
  nombre: string;
  alumnos_inscriptos: number;
  comisiones_teoricas: number;
  comisiones_practicas: number;
}

interface Props {
  departamentoId: number | null;
}

const API_BASE = "http://localhost:8000";

const styles: { [key: string]: React.CSSProperties } = {
  section: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f9fbfa",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#e8f0fe",
    color: "#000",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #ccc",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    color: "#000", // ✅ negro puro para los datos
  },
  loading: {
    color: "#004080",
    fontStyle: "italic",
    marginTop: "10px",
  },
  empty: {
    color: "#666",
    fontStyle: "italic",
    marginTop: "10px",
  },
};

const AutocompletarInformacionGeneral: React.FC<Props> = ({ departamentoId }) => {
  const [resumen, setResumen] = useState<FilaResumen[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!departamentoId) return;

    const fetchResumen = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/departamentos/${departamentoId}/resumen`);
        if (!res.ok) throw new Error("Error al obtener resumen");
        const data = await res.json();
        setResumen(data);
      } catch (error) {
        console.error("Error cargando resumen general:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [departamentoId]);

  return (
    <div style={styles.section}>
      <h2 style={styles.title}>0. Información general</h2>
      {loading && <p style={styles.loading}>Cargando datos...</p>}

      {!loading && resumen.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Actividad Curricular</th>
              <th style={styles.th}>Alumnos Inscriptos</th>
              <th style={styles.th}>Comisiones Teóricas</th>
              <th style={styles.th}>Comisiones Prácticas</th>
            </tr>
          </thead>
          <tbody>
            {resumen.map((fila, index) => (
              <tr key={index}>
                <td style={styles.td}>{fila.codigo}</td>
                <td style={styles.td}>{fila.nombre}</td>
                <td style={styles.td}>{fila.alumnos_inscriptos}</td>
                <td style={styles.td}>{fila.comisiones_teoricas}</td>
                <td style={styles.td}>{fila.comisiones_practicas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && resumen.length === 0 && departamentoId && (
        <p style={styles.empty}>No hay datos de materias para este departamento.</p>
      )}
    </div>
  );
};

export default AutocompletarInformacionGeneral;
