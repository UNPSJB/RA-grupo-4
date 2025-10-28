import React, { useEffect, useState, useCallback } from "react";

interface MateriaEstadisticaItem {
  id_materia: number;
  nombre_materia: string;
  total_inscriptos: number;
  total_encuestas_procesadas: number;
}

const ID_DOCENTE_ACTUAL = 1;

const PaginaEstadisticasDoc: React.FC = () => {
  const [listaEstadisticas, setListaEstadisticas] = useState<MateriaEstadisticaItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticasDocente = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/materias/docente/${ID_DOCENTE_ACTUAL}/estadisticas`,
        { cache: 'no-cache' }
      );
      if (!response.ok) throw new Error("Error al obtener estadísticas del docente");
      const data: { estadisticas: MateriaEstadisticaItem[] } = await response.json();
      setListaEstadisticas(data.estadisticas || []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadisticasDocente();
  }, [fetchEstadisticasDocente]);

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '28px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
      animation: 'fadeIn 0.6s ease-in-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid #ccc',
      paddingBottom: '15px',
      marginBottom: '25px',
    },
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#003366',
      margin: 0,
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0078D4',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#005fa3',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
    },
    th: {
      backgroundColor: '#e6f2ff',
      color: '#003366',
      padding: '14px',
      textAlign: 'left' as const,
      fontWeight: 'bold',
      borderBottom: '2px solid #ccc',
      fontSize: '15px',
    },
    td: {
      padding: '14px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      color: '#000',
      height: '60px',
      verticalAlign: 'middle' as const,
      transition: 'background-color 0.3s ease',
    },
    rowAlt: {
      backgroundColor: '#f9f9f9',
    },
    rowBase: {
      backgroundColor: '#ffffff',
    },
    rowHover: {
      backgroundColor: '#dbeeff',
    },
    message: {
      fontSize: '15px',
      color: '#666',
      marginTop: '16px',
    },
    error: {
      fontSize: '15px',
      color: 'red',
      marginTop: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          button:hover {
            background-color: #005fa3 !important;
          }
          tr:hover td {
            background-color: #dbeeff !important;
          }
        `}
      </style>

      <div style={styles.header}>
        <h3 style={styles.title}> Estadísticas de Materias a Cargo</h3>
        <button onClick={fetchEstadisticasDocente} style={styles.button}>
          Refrescar
        </button>
      </div>

      {cargando && <p style={styles.message}>Cargando estadísticas...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!cargando && !error && listaEstadisticas.length === 0 ? (
        <p style={styles.message}>No se encontraron materias o estadísticas para este docente.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID Materia</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Inscriptos</th>
              <th style={styles.th}>Encuestas Procesadas</th>
            </tr>
          </thead>
          <tbody>
            {listaEstadisticas.map((item, index) => (
              <tr key={item.id_materia} style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}>
                <td style={styles.td}>{item.id_materia}</td>
                <td style={styles.td}>{item.nombre_materia}</td>
                <td style={styles.td} align="center">{item.total_inscriptos}</td>
                <td style={styles.td} align="center">{item.total_encuestas_procesadas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaginaEstadisticasDoc;
