// Archivo: src/Componentes/CompletarPorcentajesDoc.tsx
// ROL: Componente "Hijo" (Controlado)

import React from 'react';

// --- Definición de Props ---
interface Props {
  // Recibe solo los datos que necesita del padre
  formData: {
    porcentaje_teoricas: string | number;
    porcentaje_practicas: string | number;
    justificacion_porcentaje: string;
  };
  // Recibe la función para manejar cambios
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// --- (Estilos de la tabla, reutilizados) ---
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #ddd',
};
const tdLabelStyle: React.CSSProperties = {
  width: '40%',
  padding: '16px',
  fontWeight: '600',
  color: '#444',
  border: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
  verticalAlign: 'middle',
};
const tdInputStyle: React.CSSProperties = {
  width: '60%',
  padding: '10px 16px',
  border: '1px solid #ddd',
  verticalAlign: 'middle',
};
const baseInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  borderRadius: '5px',
  fontSize: '15px',
  transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
};
// Estilo para el textarea
const textareaStyle: React.CSSProperties = {
  ...baseInputStyle,
  height: '80px',
  resize: 'vertical',
};
// Estilo para el párrafo de instrucciones
const instructionsStyle: React.CSSProperties = {
  color: '#333',
  fontSize: '0.95em',
  lineHeight: '1.5',
  marginBottom: '15px',
  padding: '10px',
  backgroundColor: '#f9f9f9',
  borderRadius: '6px',
  border: '1px solid #ddd',
};


const CompletarPorcentajesDoc: React.FC<Props> = ({
  formData,
  handleChange,
}) => {
  return (
    <div>
      {/* Párrafo de instrucciones basado en tu imagen */}
      <p style={instructionsStyle}>
        2. Consigne el porcentaje de horas de clases (teóricas y prácticas) dictadas respecto del total establecido en el plan de estudios y si es necesario justifique.
      </p>
      
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={tdLabelStyle}>
              <label htmlFor="porcentaje_teoricas">Clases Teóricas: %</label>
            </td>
            <td style={tdInputStyle}>
              <input
                id="porcentaje_teoricas"
                type="number"
                name="porcentaje_teoricas"
                value={formData.porcentaje_teoricas}
                onChange={handleChange}
                style={baseInputStyle}
                min="0"
                max="100"
                placeholder="%"
              />
            </td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>
              <label htmlFor="porcentaje_practicas">Clases Prácticas: %</label>
            </td>
            <td style={tdInputStyle}>
              <input
                id="porcentaje_practicas"
                type="number"
                name="porcentaje_practicas"
                value={formData.porcentaje_practicas}
                onChange={handleChange}
                style={baseInputStyle}
                min="0"
                max="100"
                placeholder="%"
              />
            </td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>
              <label htmlFor="justificacion_porcentaje">Justificación (si es necesario)</label>
            </td>
            <td style={tdInputStyle}>
              <textarea
                id="justificacion_porcentaje"
                name="justificacion_porcentaje"
                value={formData.justificacion_porcentaje}
                onChange={handleChange}
                style={textareaStyle}
                rows={3}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompletarPorcentajesDoc;