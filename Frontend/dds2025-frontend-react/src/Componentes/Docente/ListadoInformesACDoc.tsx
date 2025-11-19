import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- INTERFACES ---
// Ajustamos la interfaz para que coincida con lo que devuelve tu backend en /materias/listar
interface Periodo {
  id: number;
  ciclo_lectivo: number;
  cuatrimestre: string;

}
interface Materia {
  id_materia: number;
  nombre: string; 
  periodo: Periodo;
  codigoMateria?: string;
  id_docente: number; // Necesario para saber si le corresponde a este docente
}

// Interfaz para los informes que ya existen
interface InformeRealizado {
  id_informesAC: number;
  ciclo_lectivo: number | string;
  cuatrimestre: string;
  materia: { id_materia: number };
}

const ListadoInformesACDoc: React.FC = () => {
  // Constantes de entorno
  const ID_DOCENTE_ACTUAL = 1; // Hardcodeado por ahora
  const CICLO_LECTIVO_ACTUAL = new Date().getFullYear();  // cambiar seguramente
  const CUATRIMESTRE_ACTUAL = "Segundo";
  const API_BASE = "http://localhost:8000";

  // Estados
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informesHechos, setInformesHechos] = useState<InformeRealizado[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // --- EFECTO DE CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        // 1. Solicitamos TODAS las materias y TODOS los informes del docente en paralelo
        const [resMaterias, resInformes] = await Promise.all([
          fetch(`${API_BASE}/materias/listar`),
          fetch(`${API_BASE}/informesAC/filtradoInformesAc?id_docente=${ID_DOCENTE_ACTUAL}`)
        ]);

        if (!resMaterias.ok || !resInformes.ok) {
          throw new Error("Error al consultar los datos al servidor.");
        }

        const dataMaterias: Materia[] = await resMaterias.json();
        const dataInformes: InformeRealizado[] = await resInformes.json();

        setMaterias(dataMaterias);
        setInformesHechos(dataInformes);

      } catch (err: any) {
        setError(err.message || "Error desconocido al cargar listas.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [CICLO_LECTIVO_ACTUAL]);

  // --- LÓGICA DE FILTRADO PRINCIPAL ---
  // Una materia está pendiente si:
  // 1. Pertenece al docente actual.
  // 2. Es del año actual.
  // 3. NO existe un informe ya hecho para esa materia y ese año.
  const materiasPendientes = materias.filter(materia => {
      // a. Verificar si corresponde al docente y año
      const correspondeDocente = materia.id_docente === ID_DOCENTE_ACTUAL;
      const esCicloLectivoActual = Number(materia.periodo.ciclo_lectivo) === CICLO_LECTIVO_ACTUAL
                                    && materia.periodo.cuatrimestre === CUATRIMESTRE_ACTUAL; //Habria que comparar por periodo

      if (!correspondeDocente || !esCicloLectivoActual) return false;

      // b. Verificar si YA ESTÁ HECHO
      const yaEstaHecho = informesHechos.some(inf => 
          inf.materia.id_materia === materia.id_materia &&
          Number(inf.ciclo_lectivo) === CICLO_LECTIVO_ACTUAL
      );

      // c. Si NO está hecho, entonces está pendiente
      return !yaEstaHecho;
  });


  // --- NAVEGACIÓN ---
  const handleSeleccionarMateria = (id_materia: number) => {
    navigate(`/home/generar-informe/${id_materia}`);
  };

  // --- ESTILOS ---
  const styles = {
    container: {
      maxWidth: '1000px', margin: '0 auto', padding: '28px',
      backgroundColor: '#ffffff', borderRadius: '12px',
      boxShadow: '0 6px 16px rgba(0,0,0,0.1)', fontFamily: '"Segoe UI", "Roboto", sans-serif',
      animation: 'fadeIn 0.6s ease-in-out',
    },
    title: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#003366' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '16px' },
    th: {
      backgroundColor: '#e6f2ff', color: '#003366', padding: '14px',
      textAlign: 'left' as const, fontWeight: 'bold', borderBottom: '2px solid #ccc', fontSize: '15px'
    },
    td: {
      padding: '14px', borderBottom: '1px solid #ddd', fontSize: '14px',
      color: '#000', height: '60px', verticalAlign: 'middle' as const
    },
    trClickable: { cursor: 'pointer', transition: 'background-color 0.2s' },
    rowAlt: { backgroundColor: '#f9f9f9' },
    rowBase: { backgroundColor: '#ffffff' },
    message: { fontSize: '15px', color: '#666', marginTop: '16px' },
    error: { fontSize: '15px', color: 'red', marginTop: '16px' },
    completeButton: {
      padding: '8px 16px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff',
      backgroundColor: '#0078D4', border: 'none', borderRadius: '6px', cursor: 'pointer',
      transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    emptyState: {
        padding: '30px', textAlign: 'center' as const, backgroundColor: '#f8fff8',
        borderRadius: '8px', border: '1px solid #c8e6c9', color: '#2e7d32', marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .fila-materia:hover { background-color: #e3f2fd !important; }
          .btn-generar:hover { background-color: #005a9e !important; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important; }
        `}</style>

      <h3 style={styles.title}>Informes de Actividad Curricular Pendientes</h3>

      {cargando && <p style={styles.message}>Cargando materias...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!cargando && !error && (
          materiasPendientes.length === 0 ? (
            <div style={styles.emptyState}>
              <h4 style={{margin: '0 0 10px 0'}}>✅ ¡Todo al día!</h4>
              <p style={{margin: 0}}>No tienes informes pendientes para el ciclo lectivo {CICLO_LECTIVO_ACTUAL}.</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Materia</th>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Ciclo Lectivo</th>
                  <th style={styles.th}>Cuatrimestre</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {materiasPendientes.map((materia, index) => (
                  <tr
                    key={materia.id_materia}
                    style={{ ...(index % 2 === 0 ? styles.rowBase : styles.rowAlt), ...styles.trClickable }}
                    className="fila-materia"
                    onClick={() => handleSeleccionarMateria(materia.id_materia)}
                  >
                    <td style={{...styles.td, fontWeight: 500}}>{materia.nombre}</td>
                    <td style={styles.td}>{materia.codigoMateria ?? '—'}</td>
                    <td style={styles.td}>{materia.periodo.ciclo_lectivo}</td>
                    <td style={styles.td}>{materia.periodo.cuatrimestre}</td>
                    <td style={styles.td}>
                      <button style={styles.completeButton} className="btn-generar">
                        Generar Informe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
      )}
    </div>
  );
};

export default ListadoInformesACDoc;