import React from 'react';

interface Props {
  formData: {
    porcentaje_contenido_abordado: string | number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const styles = {
  container: {
    maxWidth: '800px', margin: '0 auto', padding: '28px', backgroundColor: '#ffffff',
    borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  instructions: {
    color: '#000', fontSize: '15px', lineHeight: '1.5', marginBottom: '24px',
    padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd',
  },
  fieldset: {
    border: '2px solid #003366', borderRadius: '8px', padding: '20px', marginBottom: '28px',
  },
  legend: { fontSize: '17px', fontWeight: 'bold', color: '#003366', padding: '0 10px' },
  label: { fontWeight: 600, marginBottom: '6px', color: '#000', fontSize: '16px', display: 'block' },
  inputWrapper: { position: 'relative' as const },
  input: {
    width: '100%', height: '44px', padding: '10px 14px 10px 36px', borderRadius: '6px',
    border: '1px solid #222', fontSize: '16px', backgroundColor: '#cce4f6', color: '#111',
    outline: 'none', boxSizing: 'border-box',
  },
  adornment: {
    position: 'absolute' as const, left: '12px', top: '50%', transform: 'translateY(-50%)',
    color: '#003366', fontWeight: 'bold', fontSize: '16px', pointerEvents: 'none',
  },
  readOnlyValue: {
    fontSize: '16px', color: '#000', padding: '10px 0', borderBottom: '1px dashed #ccc', fontWeight: 500
  }
};

const CompletarContenidoAbordadoDoc: React.FC<Props> = ({ formData, handleChange, disabled = false }) => {
  return (
    <div style={styles.container}>
      {!disabled && (
        <p style={styles.instructions}>
            2.A. ¿Se logró desarrollar la totalidad de los contenidos planificados? Consigne el porcentaje...
        </p>
      )}

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Desarrollo de Contenidos Planificados</legend>
        <label style={styles.label}>Porcentaje de Contenidos Planificados Alcanzados:</label>
        
        {disabled ? (
            <div style={styles.readOnlyValue}>{formData.porcentaje_contenido_abordado || '0'} %</div>
        ) : (
            <div style={styles.inputWrapper}>
                <span style={styles.adornment}>%</span>
                <input
                type="number" id="porcentaje_contenido_abordado" name="porcentaje_contenido_abordado"
                value={formData.porcentaje_contenido_abordado} onChange={handleChange}
                min="0" max="100" style={styles.input}
                />
            </div>
        )}
      </fieldset>
    </div>
  );
};

export default CompletarContenidoAbordadoDoc;