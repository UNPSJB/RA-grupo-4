import React, { useEffect, useState } from "react";
// --- NUEVO (Importar hook de navegación) ---
import { useNavigate } from "react-router-dom";

// --- Interfaces (MODIFICADAS) ---
// Esta interfaz ahora representa una MATERIA, no un informe
interface MateriaPendiente {
  id_materia: number;
  nombre: string;
  anio: number;
  codigoMateria?: string;
}
// --- FIN Interfaces ---

const ListadoInformesACDoc: React.FC = () => {
  // ID del docente hardcodeado (como pediste)
  const idDocenteActual = 1;
  const cicloLectivoActual = new Date().getFullYear(); // o 2025

  // --- ESTADOS MODIFICADOS ---
  const [materias, setMaterias] = useState<MateriaPendiente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para navegar
  // --- FIN ESTADOS ---

  // --- LÓGICA MODIFICADA ---
  useEffect(() => {
    const fetchMateriasPendientes = async () => {
      try {
        setCargando(true);
        setError(null);

        // Pedimos las MATERIAS PENDIENTES
        const response = await fetch(
          `http://localhost:8000/materias/docente/${idDocenteActual}/pendientes?ciclo_lectivo=${cicloLectivoActual}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al obtener materias pendientes");
        }

        const data: MateriaPendiente[] = await response.json();
        setMaterias(data);

      } catch (err: any)
      {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    fetchMateriasPendientes();
  }, [idDocenteActual, cicloLectivoActual]);

  // --- NUEVA FUNCIÓN (Navegación) ---
  const handleSeleccionarMateria = (id_materia: number) => {
    // Navega a la ruta que definimos en App.tsx
    navigate(`/home/generar-informe/${id_materia}`);
  };

  // (Tus estilos originales)
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
    trClickable: {
      cursor: 'pointer',
      transition: 'background-color 0.2s',
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
    completeButton: {
      padding: '5px 10px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#0078D4',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.2s',
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fila-materia:hover {
             background-color: #f0f8ff !important;
          }
          .btn-generar:hover {
            background-color: #005a9e !important;
            transform: scale(1.05);
          }
        `}
      </style>

      <h3 style={styles.title}>Informes de Actividad Curricular Pendientes</h3>

      {cargando && <p style={styles.message}>Cargando materias pendientes...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!cargando && !error && materias.length === 0 ? (
        <p style={styles.message}>No hay informes pendientes por generar para el ciclo lectivo {cicloLectivoActual}.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Materia</th>
              <th style={styles.th}>Código</th>
              <th style={styles.th}>Año</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((materia, index) => (
              <tr
                key={materia.id_materia}
                style={{
                  ...(index % 2 === 0 ? styles.rowBase : styles.rowAlt),
                  ...styles.trClickable,
                }}
                className="fila-materia" // Para el hover
                onClick={() => handleSeleccionarMateria(materia.id_materia)}
              >
                <td style={styles.td}>{materia.nombre}</td>
                <td style={styles.td}>{materia.codigoMateria ?? '—'}</td>
                <td style={styles.td}>{materia.anio}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.completeButton}
                    className="btn-generar"
                  >
                    Generar Informe
                  </button>
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