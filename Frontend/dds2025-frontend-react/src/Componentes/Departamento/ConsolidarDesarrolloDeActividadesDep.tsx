import React, { useState, useEffect } from "react";

// 1️⃣ Interfaz de datos
interface ActividadParaInformeRow {
  codigoMateria: string;
  nombreMateria: string;
  integranteCatedra: string;
  capacitacion: string | null;
  investigacion: string | null;
  extension: string | null;
  gestion: string | null;
  observacionComentarios: string | null;
}

// 2️⃣ Estilos inline
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f9fafc",
    borderRadius: "12px",
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
  },
  instruccion: {
    fontSize: "14px",
    color: "#333",
    backgroundColor: "#eef5fb",
    padding: "15px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    lineHeight: "1.5",
    borderLeft: "4px solid #0078D4",
  },
  title: {
    color: "#0a2e52",
    fontSize: "19px",
    fontWeight: 600,
    marginBottom: "18px",
    borderBottom: "2px solid #0078D4",
    paddingBottom: "8px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },
  th: {
    backgroundColor: "#0078D4",
    color: "white",
    padding: "10px 12px",
    fontSize: "13px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  td: {
    border: "1px solid #dce7f3",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#333",
  },
  tdMateria: {
    border: "1px solid #dce7f3",
    padding: "10px 12px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#005a9e",
    backgroundColor: "#f4f9ff",
  },
  tdCenter: {
    border: "1px solid #dce7f3",
    padding: "10px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "15px",
    color: "#0078D4",
  },
  tdObs: {
    border: "1px solid #dce7f3",
    padding: "10px 12px",
    fontSize: "12px",
    color: "#444",
    fontStyle: "italic",
    backgroundColor: "#fafafa",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "15px",
    color: "#333",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
    color: "#b00020",
    backgroundColor: "#fff2f2",
    border: "1px solid #ffcdd2",
    borderRadius: "6px",
  },
  separadorMateria: {
    height: "3px",
    backgroundColor: "#0078D4",
    opacity: 0.25,
  },
};

// 3️⃣ Auxiliar
function tieneContenido(texto: string | null | undefined): boolean {
  return Boolean(texto && texto.trim().length > 0);
}

// 4️⃣ Agrupador de materias
function agruparPorMateria(registros: ActividadParaInformeRow[]) {
  const grupos: { [codigo: string]: ActividadParaInformeRow[] } = {};
  registros.forEach((item) => {
    if (!grupos[item.codigoMateria]) grupos[item.codigoMateria] = [];
    grupos[item.codigoMateria].push(item);
  });
  return grupos;
}

// 5️⃣ Componente principal
const ConsolidarDesarrolloDeActividades: React.FC = () => {
  const [registros, setRegistros] = useState<ActividadParaInformeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformeActividades = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/informes-sinteticos/actividades");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener la información de actividades.`);
        }

        const result = await response.json();
        if (result.registros) {
          setRegistros(result.registros);
        } else {
          throw new Error("Formato de datos incorrecto.");
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Ocurrió un error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchInformeActividades();
  }, []);

  if (loading) return <div style={styles.loading}>Cargando datos de actividades...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;
  if (registros.length === 0)
    return <div style={styles.loading}>No hay datos de actividades para mostrar.</div>;

  const registrosAgrupados = agruparPorMateria(registros);
  const codigosMaterias = Object.keys(registrosAgrupados);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        3. Desarrollo de Actividades (Capacitación, Investigación, Extensión y Gestión)
      </h3>

      <p style={styles.instruccion}>
        Señale con una cruz si ha desarrollado actividades de <strong>Capacitación, Investigación,
        Extensión y Gestión</strong> en el ámbito de la Facultad de Ingeniería por cada uno de los
        integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo
        evaluado. Explicite las observaciones y comentarios que considere pertinentes.
      </p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Espacio Curricular</th>
            <th style={styles.th}>Responsable / Profesor / Auxiliar</th>
            <th style={styles.th}>Capacitación</th>
            <th style={styles.th}>Investigación</th>
            <th style={styles.th}>Extensión</th>
            <th style={styles.th}>Gestión</th>
            <th style={styles.th}>Observaciones / Comentarios</th>
          </tr>
        </thead>

        <tbody>
          {codigosMaterias.map((codigo, materiaIndex) => {
            const grupo = registrosAgrupados[codigo];
            return (
              <React.Fragment key={codigo}>
                {grupo.map((item, index) => (
                  <tr key={`${codigo}-${index}`}>
                    {/* Mostrar la materia solo una vez (en la primera fila del grupo) */}
                    {index === 0 ? (
                      <td style={styles.tdMateria} rowSpan={grupo.length}>
                        {item.codigoMateria} - {item.nombreMateria}
                      </td>
                    ) : null}

                    <td style={styles.td}>{item.integranteCatedra}</td>

                    {["capacitacion", "investigacion", "extension", "gestion"].map((campo) => {
                      const valor = item[campo as keyof ActividadParaInformeRow] as string | null;
                      const hayContenido = tieneContenido(valor);
                      return (
                        <td
                          key={campo}
                          style={{
                            ...styles.tdCenter,
                            backgroundColor: hayContenido ? "#e6f3fc" : "transparent",
                            color: hayContenido ? "#0078D4" : "#999",
                          }}
                        >
                          {hayContenido ? "X" : "-"}
                        </td>
                      );
                    })}

                    <td style={styles.tdObs}>{item.observacionComentarios || ""}</td>
                  </tr>
                ))}
                {/* 🔹 Línea divisoria entre materias */}
                {materiaIndex < codigosMaterias.length - 1 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 0 }}>
                      <div style={styles.separadorMateria}></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ConsolidarDesarrolloDeActividades;
