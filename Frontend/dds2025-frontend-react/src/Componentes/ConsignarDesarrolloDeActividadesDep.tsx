import React, { useState, useEffect } from "react";

// 1. Definir la interfaz 
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

// (Azules: #0078D4, #cce4f6)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: "20px",
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  title: {
    color: "#333", 
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    border: "2px solid #0078D4", // Borde exterior azul
    borderRadius: "8px",
    overflow: "hidden", // Para redondear las esquinas
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  // Cabecera (Azul claro, como los campos de CompletarDatosCabecera)
  th: {
    backgroundColor: "#cce4f6", // Azul claro
    color: "#111", // Texto oscuro
    border: "1px solid #0078D4", // Bordes azules
    padding: "12px 15px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  // Celdas
  td: {
    border: "1px solid #b4d7f0", // Borde azul más suave
    padding: "12px 15px",
    fontSize: "13px",
    verticalAlign: "top", // Alinear arriba
    color: "#333",
  },
  // Celda para Espacio Curricular (Código y Nombre)
  tdMateria: {
    border: "1px solid #b4d7f0",
    padding: "12px 15px",
    fontSize: "13px",
    verticalAlign: "top",
    width: "20%",
  },
  // Celda para la 'X' (centrada)
  tdCenter: {
    border: "1px solid #b4d7f0",
    padding: "12px 15px",
    fontSize: "13px",
    verticalAlign: "top",
    textAlign: "center",
    fontWeight: "bold",
  },
  tdObs: {
    border: "1px solid #b4d7f0",
    padding: "12px 15px",
    fontSize: "12px",
    verticalAlign: "top",
    fontStyle: "italic",
    color: "#333",
    width: "25%",
  },
  materiaCodigo: {
    fontWeight: "bold",
    marginRight: "5px",
    color: "#005a9e", 
  },
  materiaNombre: {
    fontSize: "13px",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
    color: "red",
    border: "1px solid #fdd",
    backgroundColor: "#fff5f5",
    borderRadius: "4px",
  },
};

function tieneContenido(texto: string | null | undefined): boolean {
  return Boolean(texto && texto.trim().length > 0);
}

const ConsolidarDesarrolloDeActividades: React.FC = () => {
  const [registros, setRegistros] = useState<ActividadParaInformeRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. useEffect para cargar los datos 
  useEffect(() => {
    const fetchInformeActividades = async () => {
      setLoading(true);
      setError(null);
      console.log("Iniciando fetch a /informes-sinteticos/actividades...");

      try {
        const response = await fetch("http://localhost:8000/informes-sinteticos/actividades");
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo obtener la información de actividades.`);
        }
        
        const result = await response.json();
        
        if (result.registros) {
          console.log("Datos recibidos (individuales):", result.registros);
          setRegistros(result.registros);
        } else {
          throw new Error("Formato de datos incorrecto.");
        }
        
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error en fetchInformeActividades:", err.message);
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInformeActividades();
  }, []); 

  // 3. Renderizado de estados
  if (loading) {
    return <div style={styles.loading}>Cargando datos de actividades (Capacitación, Investigación, etc.)...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }
  
  if (registros.length === 0) {
    return <div style={styles.loading}>No se encontraron datos de actividades para mostrar (La tabla 'Actividades' puede estar vacía).</div>;
  }

  // 4. Renderizado de la tabla 
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        3. Desarrollo de Actividades (Capacitación, Investigación, Extensión y Gestión)
      </h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Espacio curricular</th>
            <th style={styles.th}>Responsable, Profesor, JTP y/o Auxiliares</th>
            <th style={{...styles.th, ...styles.tdCenter}}>Capacitación</th>
            <th style={{...styles.th, ...styles.tdCenter}}>Investigación</th>
            <th style={{...styles.th, ...styles.tdCenter}}>Extensión</th>
            <th style={{...styles.th, ...styles.tdCenter}}>Gestión</th>
            <th style={styles.th}>Observaciones-Comentarios</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((item, index) => (
            <tr key={index}>
              {/* Celda de Espacio Curricular (combinada) */}
              <td style={styles.tdMateria}>
                {/* Lógica de renderizado para ID y Nombre */}
                <span style={styles.materiaCodigo}>{item.codigoMateria}</span>
                <span style={styles.materiaNombre}>- {item.nombreMateria}</span>
              </td>
              <td style={styles.td}>
                {item.integranteCatedra}
              </td>
              
              {/* Celdas de 'X' o '-' */}
              <td style={styles.tdCenter}>
                {tieneContenido(item.capacitacion) ? 'X' : '-'}
              </td>
              <td style={styles.tdCenter}>
                {tieneContenido(item.investigacion) ? 'X' : '-'}
              </td>
              <td style={styles.tdCenter}>
                {tieneContenido(item.extension) ? 'X' : '-'}
              </td>
              <td style={styles.tdCenter}>
                {tieneContenido(item.gestion) ? 'X' : '-'}
              </td>
              
              <td style={styles.tdObs}>
                {item.observacionComentarios || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConsolidarDesarrolloDeActividades;