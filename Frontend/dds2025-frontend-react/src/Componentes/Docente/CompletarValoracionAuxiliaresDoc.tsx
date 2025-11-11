import React from 'react';

export interface ValoracionAuxiliarData {
  nombre_auxiliar: string;
  calificacion: 'E' | 'MB' | 'B' | 'R' | 'I' | '';
  justificacion: string;
}

const CALIFICACIONES: ValoracionAuxiliarData['calificacion'][] = ['E', 'MB', 'B', 'R', 'I'];

const styles: { [key: string]: React.CSSProperties } = {
  section: { marginBottom: '28px', fontFamily: '"Segoe UI", "Roboto", sans-serif' },
  instructions: {
    color: '#000', fontSize: '15px', lineHeight: '1.5', marginBottom: '24px',
    padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd',
  },
  fieldset: {
    border: '2px solid #003366', borderRadius: '8px', padding: '20px', marginBottom: '28px', backgroundColor: '#fff',
  },
  legend: { padding: '0 10px', color: '#003366', fontWeight: 'bold', fontSize: '17px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' },
  th: {
    border: '1px solid #ccc', padding: '10px', textAlign: 'center',
    backgroundColor: '#e6f2ff', color: '#003366', fontWeight: 'bold',
  },
  td: { border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' },
  input: {
    width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #222',
    backgroundColor: '#cce4f6', color: '#111', fontSize: '14px', boxSizing: 'border-box',
  },
  button: {
    padding: '6px 12px', fontSize: '13px', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer',
  },
  addButton: { backgroundColor: '#0078D4', marginTop: '16px', fontSize: '14px', padding: '8px 16px' },
  removeButton: { backgroundColor: '#dc3545' },
};

interface Props {
  valoraciones: ValoracionAuxiliarData[];
  onValoracionesChange: (nuevasValoraciones: ValoracionAuxiliarData[]) => void;
  disabled?: boolean;
}

const CompletarValoracionAuxiliaresDoc: React.FC<Props> = ({ valoraciones, onValoracionesChange, disabled = false }) => {
  const addRow = () => onValoracionesChange([...valoraciones, { nombre_auxiliar: '', calificacion: '', justificacion: '' }]);
  const removeRow = (index: number) => onValoracionesChange(valoraciones.filter((_, i) => i !== index));
  const handleChange = (index: number, field: keyof ValoracionAuxiliarData, value: string) => {
    const nuevas = [...valoraciones];
    (nuevas[index] as any)[field] = value;
    onValoracionesChange(nuevas);
  };

  return (
    <div style={styles.section}>
      {!disabled && (
        <p style={styles.instructions}>
          4. Valore el desempeño de los Auxiliares de cátedra...
        </p>
      )}

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Valoración del Desempeño de Auxiliares de Cátedra</legend>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>JTP/Auxiliares</th>
              {CALIFICACIONES.map(calif => <th key={calif} style={styles.th}>{calif}</th>)}
              <th style={styles.th}>Justificación</th>
              {!disabled && <th style={styles.th}>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {valoraciones.map((valoracion, index) => (
              <tr key={index}>
                <td style={styles.td}>
                  <input
                    type="text" value={valoracion.nombre_auxiliar}
                    onChange={(e) => handleChange(index, 'nombre_auxiliar', e.target.value)}
                    style={styles.input} placeholder="Nombre Apellido" disabled={disabled}
                  />
                </td>
                {CALIFICACIONES.map(calif => (
                  <td key={calif} style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle', fontSize: '18px' }}>
                    {disabled ? (
                        <span>{valoracion.calificacion === calif ? '●' : '○'}</span>
                    ) : (
                        <input
                          type="radio" name={`calificacion-${index}`} value={calif}
                          checked={valoracion.calificacion === calif}
                          onChange={() => handleChange(index, 'calificacion', calif)}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                    )}
                  </td>
                ))}
                <td style={styles.td}>
                  <input
                    type="text" value={valoracion.justificacion}
                    onChange={(e) => handleChange(index, 'justificacion', e.target.value)}
                    style={styles.input} placeholder="Justifique..." disabled={disabled}
                  />
                </td>
                {!disabled && (
                  <td style={{ ...styles.td, textAlign: 'center', verticalAlign: 'middle' }}>
                    <button type="button" onClick={() => removeRow(index)} style={{ ...styles.button, ...styles.removeButton }} disabled={valoraciones.length <= 1}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {!disabled && (
          <button type="button" onClick={addRow} style={{ ...styles.button, ...styles.addButton }}>
            + Agregar Auxiliar
          </button>
        )}
      </fieldset>
    </div>
  );
};

export default CompletarValoracionAuxiliaresDoc;