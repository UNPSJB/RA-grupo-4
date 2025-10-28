
import React from 'react';


interface Props {

  formData: {
    porcentaje_teoricas: string | number;
    porcentaje_practicas: string | number;
    justificacion_porcentaje: string;
  };

  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const fadeIn = {
  animation: 'fadeIn 0.6s ease-in-out',
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '28px',
    backgroundColor: '#ffffff',
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
    animation: 'fadeIn 0.6s ease-in-out',
  },
  legend: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#003366',
    padding: '0 10px',
  },
  row: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginBottom: '16px',
  },
  label: {  
    fontWeight: 600,
    marginBottom: '6px',
    color: '#000',
    fontSize: '16px',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '10px 14px 10px 36px',
    borderRadius: '6px',
    border: '1px solid #222',
    fontSize: '16px',
    backgroundColor: '#cce4f6',
    color: '#111',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  adornment: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#003366',
    fontWeight: 'bold',
    fontSize: '16px',
    pointerEvents: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #222',
    fontSize: '16px',
    backgroundColor: '#cce4f6',
    color: '#111',
    resize: 'vertical' as const,
    height: '80px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
};
const CompletarPorcentajesDoc: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input:focus, textarea:focus {
            border-color: #0078D4;
            box-shadow: 0 0 0 2px rgba(0,120,212,0.2);
          }
          input:hover, textarea:hover {
            border-color: #0078D4;
          }
        `}
      </style>

      <p style={styles.instructions}>
        2. Consigne el porcentaje de horas de clases (teóricas y prácticas) dictadas respecto del total establecido en el plan de estudios y si es necesario justifique.
      </p>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Porcentaje de Clases Dictadas</legend>

        <div style={{ ...styles.row, ...fadeIn }}>
          <label htmlFor="porcentaje_teoricas" style={styles.label}>Clases Teóricas</label>
          <div style={styles.inputWrapper}>
            <span style={styles.adornment}>%</span>
            <input
              id="porcentaje_teoricas"
              type="number"
              name="porcentaje_teoricas"
              value={formData.porcentaje_teoricas}
              onChange={handleChange}
              style={styles.input}
              min="0"
              max="100"
            />
          </div>
        </div>

        <div style={{ ...styles.row, ...fadeIn }}>
          <label htmlFor="porcentaje_practicas" style={styles.label}>Clases Prácticas</label>
          <div style={styles.inputWrapper}>
            <span style={styles.adornment}>%</span>
            <input
              id="porcentaje_practicas"
              type="number"
              name="porcentaje_practicas"
              value={formData.porcentaje_practicas}
              onChange={handleChange}
              style={styles.input}
              min="0"
              max="100"
            />
          </div>
        </div>
      </fieldset>

      <div style={{ ...styles.row, ...fadeIn }}>
        <label htmlFor="justificacion_porcentaje" style={styles.label}>Justificación (si es necesario)</label>
        <textarea
          id="justificacion_porcentaje"
          name="justificacion_porcentaje"
          value={formData.justificacion_porcentaje}
          onChange={handleChange}
          style={styles.textarea}
          rows={3}
        />
      </div>
    </div>
  );
};

export default CompletarPorcentajesDoc;