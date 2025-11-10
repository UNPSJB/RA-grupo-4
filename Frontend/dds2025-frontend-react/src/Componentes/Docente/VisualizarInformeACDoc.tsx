import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList,
} from 'recharts';

const BASE_URL = 'http://localhost:8000';


interface Materia {
  id_materia: number;
  nombre: string;
  codigoMateria: string;
  anio: number; 
}
interface Docente {
  id_docente: number;
  nombre: string;
}
interface ValoracionAuxiliarData {
  nombre_auxiliar: string;
  calificacion: string;
  justificacion: string;
}
interface Actividad {
  integranteCatedra: string;
  capacitacion: string;
  investigacion: string;
  extension: string;
  gestion: string;
  observacionComentarios: string;
}
interface SeccionResumen {
    id: number;
    sigla: string;
    nombre: string;
    porcentajes_opciones: Record<string, number>;
}
interface InformeACCompleto {
  id_informesAC: number;
  completado: number;
  sede: string;
  ciclo_lectivo: number;
  materia: Materia;
  docente: Docente;
  cantidad_alumnos_inscriptos: number;
  cantidad_comisiones_teoricas: number;
  cantidad_comisiones_practicas: number;
  porcentaje_teoricas: number;
  porcentaje_practicas: number;
  justificacion_porcentaje?: string; // Opcional
  porcentaje_contenido_abordado: number;
  opinionSobreResumen: string;
  resumenSecciones: SeccionResumen[];
  valoracion_auxiliares: ValoracionAuxiliarData[];
  actividades: Actividad[];
  necesidades_equipamiento?: string[]; // Opcional
  necesidades_bibliografia?: string[]; // Opcional
  aspectos_positivos_enseñanza: string;
  aspectos_positivos_aprendizaje: string;
  obstaculos_enseñanza: string;
  obstaculos_aprendizaje: string;
  estrategias_a_implementar: string;
  resumen_reflexion: string;
}


interface DataFieldProps {
  label: string;
  value: string | number | undefined | null;
}
const DataField: React.FC<DataFieldProps> = ({ label, value }) => (
  <div style={styles.fieldContainer}>
    <p style={styles.fieldLabel}>{label}</p>
    <p style={styles.fieldValue}>{value || 'No completado'}</p>
  </div>
);


interface DataListProps {
  label: string;
  items: string[] | undefined | null;
}
const DataList: React.FC<DataListProps> = ({ label, items }) => (
  <div style={styles.fieldContainer}>
    <p style={styles.fieldLabel}>{label}</p>
    {items && items.length > 0 ? (
      <ul style={styles.ul}>
        {items.map((item, index) => (
          <li key={index} style={styles.li}>{item}</li>
        ))}
      </ul>
    ) : (
      <p style={styles.fieldValue}>No completado</p>
    )}
  </div>
);


const VisualizarInformeACDoc: React.FC = () => {
  const { id_informe } = useParams<{ id_informe: string }>();
  const navigate = useNavigate();
  const [informe, setInforme] = useState<InformeACCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInforme = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BASE_URL}/informesAC/${id_informe}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el informe.');
        }
        const data: InformeACCompleto = await response.json();
        setInforme(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_informe) {
      fetchInforme();
    }
  }, [id_informe]);

  if (loading) {
    return <div style={styles.container}><p style={styles.message}>Cargando informe...</p></div>;
  }
  if (error) {
    return <div style={styles.container}><p style={styles.error}>{error}</p></div>;
  }
  if (!informe) {
    return <div style={styles.container}><p style={styles.message}>No se encontró el informe.</p></div>;
  }
  
  const seccionesFiltradas = informe.resumenSecciones?.filter(s =>
        ["B", "C", "D", "E-Teoria", "E-Practica"].includes(s.sigla)
    ) || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Informe de Actividad Curricular (ID: {informe.id_informesAC})</h2>
        
        {/* --- Sección 1: Datos Generales --- */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Datos Generales</h3>
          <div style={styles.grid}>
            <DataField label="Actividad Curricular" value={informe.materia.nombre} />
            <DataField label="Código" value={informe.materia.codigoMateria} />
            <DataField label="Ciclo Lectivo" value={informe.ciclo_lectivo} />
            <DataField label="Docente Responsable" value={informe.docente.nombre} />
            <DataField label="Sede" value={informe.sede} />
            <DataField label="Cantidad de Alumnos Inscriptos" value={informe.cantidad_alumnos_inscriptos} />
            <DataField label="Comisiones Teóricas" value={informe.cantidad_comisiones_teoricas} />
            <DataField label="Comisiones Prácticas" value={informe.cantidad_comisiones_practicas} />
          </div>
        </div>

        {/* --- Sección 2: Necesidades --- */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Necesidades (Opcional)</h3>
          <div style={styles.grid}>
            <DataList label="Equipamiento e Insumos" items={informe.necesidades_equipamiento} />
            <DataList label="Bibliografía" items={informe.necesidades_bibliografia} />
          </div>
        </div>

        {/* --- Sección 3: Porcentajes --- */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Porcentajes</h3>
          <div style={styles.grid}>
            <DataField label="% Clases Teóricas" value={`${informe.porcentaje_teoricas}%`} />
            <DataField label="% Clases Prácticas" value={`${informe.porcentaje_practicas}%`} />
            <DataField label="Justificación (Opcional)" value={informe.justificacion_porcentaje} />
            <DataField label="% Contenido Abordado" value={`${informe.porcentaje_contenido_abordado}%`} />
          </div>
        </div>

        {/* --- Sección 4: Resumen Encuesta --- */}
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>4. Resumen Valores de Encuesta</h3>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
                {seccionesFiltradas.map((seccion) => (
                    <div key={seccion.id} style={styles.chartBox}>
                        <h4 style={styles.chartTitle}>{seccion.sigla} - {seccion.nombre}</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={Object.entries(seccion.porcentajes_opciones).map(([opcion, porcentaje]) => ({ opcion, porcentaje }))}
                                margin={{ top: 20, right: 10, left: 0, bottom: 70 }}
                            >
                                <XAxis dataKey="opcion" interval={0} angle={-45} textAnchor="end" height={80} tick={{ fontSize: 13 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value: any) => `${value}%`} />
                                <Bar dataKey="porcentaje" fill="#4f46e5" barSize={25}>
                                    <LabelList dataKey="porcentaje" position="top" formatter={(value: any) => `${value}%`} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
            <DataField label="Observaciones sobre valores" value={informe.opinionSobreResumen} />
        </div>

        {/* --- Sección 5: Proceso de Aprendizaje --- */}
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>5. Proceso de Enseñanza-Aprendizaje</h3>
            <DataField label="Aspectos Positivos (Enseñanza)" value={informe.aspectos_positivos_enseñanza} />
            <DataField label="Aspectos Positivos (Aprendizaje)" value={informe.aspectos_positivos_aprendizaje} />
            <DataField label="Obstáculos (Enseñanza)" value={informe.obstaculos_enseñanza} />
            <DataField label="Obstáculos (Aprendizaje)" value={informe.obstaculos_aprendizaje} />
            <DataField label="Estrategias a Implementar" value={informe.estrategias_a_implementar} />
            <DataField label="Resumen y Reflexión" value={informe.resumen_reflexion} />
        </div>

        {/* --- Sección 6: Actividades --- */}
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>6. Actividades de Cátedra</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Integrante</th>
                        <th style={styles.th}>Capacitación</th>
                        <th style={styles.th}>Investigación</th>
                        <th style={styles.th}>Extensión</th>
                        <th style={styles.th}>Gestión</th>
                        <th style={styles.th}>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {informe.actividades.map((act, index) => (
                        <tr key={index} style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}>
                            <td style={styles.td}>{act.integranteCatedra}</td>
                            <td style={styles.td}>{act.capacitacion}</td>
                            <td style={styles.td}>{act.investigacion}</td>
                            <td style={styles.td}>{act.extension}</td>
                            <td style={styles.td}>{act.gestion}</td>
                            <td style={styles.td}>{act.observacionComentarios}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* --- Sección 7: Valoración Auxiliares --- */}
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>7. Valoración de Auxiliares</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre Auxiliar</th>
                        <th style={styles.th}>Calificación</th>
                        <th style={styles.th}>Justificación</th>
                    </tr>
                </thead>
                <tbody>
                    {informe.valoracion_auxiliares.map((val, index) => (
                        <tr key={index} style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}>
                            <td style={styles.td}>{val.nombre_auxiliar}</td>
                            <td style={styles.td}>{val.calificacion}</td>
                            <td style={styles.td}>{val.justificacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div style={styles.buttonContainer}>
            <button onClick={() => navigate(-1)} style={styles.button}>Volver al Historial</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f4f7f6',
    padding: '30px 20px',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  container: {
    maxWidth: '950px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    color: '#003366',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#005f9e',
    borderBottom: '2px solid #e6f2ff',
    paddingBottom: '8px',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  fieldContainer: {
    backgroundColor: '#f9f9f9',
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
  fieldLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0',
  },
  fieldValue: {
    fontSize: '16px',
    color: '#555',
    margin: 0,
    whiteSpace: 'pre-wrap' as const,
  },
  ul: {
      paddingLeft: '20px',
      margin: 0,
  },
  li: {
      fontSize: '16px',
      color: '#555',
      marginBottom: '5px',
  },
  chartBox: {
    flex: `1 1 calc(33.33% - 1rem)`,
    minWidth: "280px",
    maxWidth: "400px",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  chartTitle: {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "0.3rem",
    textAlign: "center" as const
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
    verticalAlign: 'middle' as const,
  },
  rowAlt: {
    backgroundColor: '#f9f9f9',
  },
  rowBase: {
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '40px',
  },
  button: {
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0078D4',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  message: {
    fontSize: '15px',
    color: '#666',
    marginTop: '16px',
    textAlign: 'center' as const,
  },
  error: {
    fontSize: '15px',
    color: 'red',
    marginTop: '16px',
    textAlign: 'center' as const,
  },
};

export default VisualizarInformeACDoc;