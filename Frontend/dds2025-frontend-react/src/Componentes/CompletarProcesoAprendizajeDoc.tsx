import React from 'react';

interface Props {
  formData: {
    aspectos_positivos_enseñanza: string;
    aspectos_positivos_aprendizaje: string;
    obstaculos_enseñanza: string;
    obstaculos_aprendizaje: string;
    estrategias_a_implementar: string;
    resumen_reflexion: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '28px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  instructions: {
    color: '#000',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '24px',
    padding: '14px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  fieldset: {
    border: '2px solid #003366',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '28px',
  },
  legend: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#003366',
    padding: '0 10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
    verticalAlign: 'top' as const,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '6px',
    display: 'block',
    fontSize: '15px',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #222',
    borderRadius: '6px',
    fontSize: '15px',
    backgroundColor: '#cce4f6',
    color: '#111',
    outline: 'none',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.3s ease',
  },
  resumen: {
    fontFamily: 'Georgia, serif',
    fontSize: '16px',
    backgroundColor: '#fdfdfd',
    border: '1px solid #aaa',
    padding: '12px',
    borderRadius: '6px',
    color: '#222',
    width: '100%',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
};

const CompletarProcesoAprendizajeDoc: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div style={styles.container}>
      <style>
        {`
          textarea:focus {
            border-color: #0078D4;
            box-shadow: 0 0 0 2px rgba(0,120,212,0.2);
          }
          textarea:hover {
            border-color: #0078D4;
          }
        `}
      </style>

      <p style={styles.instructions}>
        2.C. ¿Cuáles fueron los principales aspectos positivos y los obstáculos que se manifestaron durante el desarrollo del espacio curricular? Centrándose específicamente en los procesos de enseñanza y/o aprendizaje. Complete en el siguiente cuadro.
      </p>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Proceso de Enseñanza y Aprendizaje</legend>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.td}>
                <label style={styles.label}>Aspectos positivos - Enseñanza</label>
                <textarea
                  name="aspectos_positivos_enseñanza"
                  value={formData.aspectos_positivos_enseñanza}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </td>
              <td style={styles.td}>
                <label style={styles.label}>Aspectos positivos - Aprendizaje</label>
                <textarea
                  name="aspectos_positivos_aprendizaje"
                  value={formData.aspectos_positivos_aprendizaje}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </td>
            </tr>
            <tr>
              <td style={styles.td}>
                <label style={styles.label}>Obstáculos - Enseñanza</label>
                <textarea
                  name="obstaculos_enseñanza"
                  value={formData.obstaculos_enseñanza}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </td>
              <td style={styles.td}>
                <label style={styles.label}>Obstáculos - Aprendizaje</label>
                <textarea
                  name="obstaculos_aprendizaje"
                  value={formData.obstaculos_aprendizaje}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={styles.td}>
                <label style={styles.label}>Estrategias a implementar</label>
                <textarea
                  name="estrategias_a_implementar"
                  value={formData.estrategias_a_implementar}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>

      <p style={styles.instructions}>
        Escriba un resumen de la reflexión sobre la práctica docente que se realizó en la reunión de equipo de cátedra. En caso de corresponder, consigne nuevas estrategias a implementar (cambio de cronograma, modificación del proceso de evaluación, etc.).
      </p>

      <textarea
        name="resumen_reflexion"
        value={formData.resumen_reflexion}
        onChange={handleChange}
        style={styles.resumen}
        rows={5}
        placeholder="Escriba aquí su resumen..."
      />
    </div>
  );
};

export default CompletarProcesoAprendizajeDoc;
