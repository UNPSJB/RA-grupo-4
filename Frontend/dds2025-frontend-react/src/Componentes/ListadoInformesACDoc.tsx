import React, { useEffect, useState } from "react";

interface Docente {
  id_docente: number;
  nombre: string;
}

interface Materia {
  id_materia: number;
  nombre: string;
  anio: number;
  codigoMateria?: string;
}

interface InformeAC {
  id_informesAC: number;
  sede: string;
  ciclo_lectivo: number;
  cantidad_alumnos_inscriptos?: number;
  cantidad_comisiones_teoricas?: number;
  cantidad_comisiones_practicas?: number;
  docente: Docente;
  materia: Materia;
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al obtener informes");
        }

        const data: InformeAC[] = await response.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    fetchInformes();
  }, [idDocenteActual]);

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
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#003366',
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
    },
    rowAlt: {
      backgroundColor: '#f9f9f9',
    },
    rowBase: {
      backgroundColor: '#ffffff',
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
        `}
      </style>

      <h3 style={styles.title}> Informes de Actividad Curricular</h3>

      {cargando && <p style={styles.message}>Cargando informes...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!cargando && !error && informes.length === 0 ? (
        <p style={styles.message}>No hay informes disponibles para este docente.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Materia</th>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Sede</th>
              <th style={styles.th}>Ciclo</th>
              <th style={styles.th}>Alumnos</th>
              <th style={styles.th}>Teóricas</th>
              <th style={styles.th}>Prácticas</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((inf, index) => (
              <tr
                key={inf.id_informesAC}
                style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}
              >
                <td style={styles.td}>{inf.id_informesAC}</td>
                <td style={styles.td}>{inf.materia.nombre}</td>
                <td style={styles.td}>{inf.materia.codigoMateria ?? '—'}</td>
                <td style={styles.td}>{inf.sede}</td>
                <td style={styles.td}>{inf.ciclo_lectivo}</td>
                <td style={styles.td}>{inf.cantidad_alumnos_inscriptos ?? '—'}</td>
                <td style={styles.td}>{inf.cantidad_comisiones_teoricas ?? '—'}</td>
                <td style={styles.td}>{inf.cantidad_comisiones_practicas ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDoc;
