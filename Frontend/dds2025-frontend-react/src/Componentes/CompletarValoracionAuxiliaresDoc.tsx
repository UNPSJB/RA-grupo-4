import React from 'react';

// Definimos el tipo para una valoración individual, debe coincidir con el schema Pydantic
export interface ValoracionAuxiliarData {
  nombre_auxiliar: string;
  calificacion: 'E' | 'MB' | 'B' | 'R' | 'I' | ''; // Añadimos '' para el estado inicial
  justificacion: string;
}

// Opciones de calificación
const CALIFICACIONES: ValoracionAuxiliarData['calificacion'][] = ['E', 'MB', 'B', 'R', 'I'];

// Estilos locales (pueden ir en App.css)
const sectionStyle: React.CSSProperties = { marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginTop: '15px' };
const thStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '10px', textAlign: 'left', backgroundColor: '#f8f9fa', color: '#333' };
const tdStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const radioContainerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '5px 0' };
const radioLabelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '0.8rem' };
const radioInputStyle: React.CSSProperties = { margin: '0 0 4px 0' };
const buttonStyle: React.CSSProperties = { padding: '8px 15px', fontSize: '14px', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' };
const addButton = { ...buttonStyle, backgroundColor: '#28a745' }; // Verde
const removeButton = { ...buttonStyle, backgroundColor: '#dc3545' }; // Rojo
const addRowButtonStyle = { ...buttonStyle, backgroundColor: '#007bff', marginTop: '15px' }; // Azul

interface Props {
  valoraciones: ValoracionAuxiliarData[]; // Lista actual de valoraciones
  onValoracionesChange: (nuevasValoraciones: ValoracionAuxiliarData[]) => void; // Función para actualizar la lista en el padre
}

const CompletarValoracionAuxiliaresDoc: React.FC<Props> = ({ valoraciones, onValoracionesChange }) => {

  // Añadir una nueva fila vacía
  const addRow = () => {
    onValoracionesChange([
      ...valoraciones,
      { nombre_auxiliar: '', calificacion: '', justificacion: '' }
    ]);
  };

  // Eliminar una fila por su índice
  const removeRow = (index: number) => {
    onValoracionesChange(valoraciones.filter((_, i) => i !== index));
  };

  // Manejar cambios en los inputs (nombre, justificación)
  const handleChange = (index: number, field: 'nombre_auxiliar' | 'justificacion', value: string) => {
    const nuevasValoraciones = [...valoraciones];
    nuevasValoraciones[index] = { ...nuevasValoraciones[index], [field]: value };
    onValoracionesChange(nuevasValoraciones);
  };

  // Manejar cambios en los radio buttons (calificación)
  const handleCalificacionChange = (index: number, value: ValoracionAuxiliarData['calificacion']) => {
    const nuevasValoraciones = [...valoraciones];
    nuevasValoraciones[index] = { ...nuevasValoraciones[index], calificacion: value };
    onValoracionesChange(nuevasValoraciones);
  };

  return (
    <div style={sectionStyle}>
      <h4 style={{ marginTop: 0, marginBottom: '5px', color: '#333' }}>
        4. Valoración del Desempeño de Auxiliares de Cátedra
      </h4>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
        Valore el desempeño de los Auxiliares de cátedra (de acuerdo a las atribuciones y deberes de la
        categoría docente que corresponda, según consta en el Art. 14 del Reglamento Académico). Utilice la
        siguiente escala de valoración: E (Excelente), MB (Muy bueno), B (Bueno), R (Regular) o I
        (Insuficiente). Justifique explicando en no más de tres renglones los motivos por los cuales realiza esa
        valoración.
      </p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>JTP/Auxiliares</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>E</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>MB</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>B</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>R</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>I</th>
            <th style={thStyle}>Justificación de la Calificación</th>
            <th style={thStyle}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {valoraciones.map((valoracion, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={valoracion.nombre_auxiliar}
                  onChange={(e) => handleChange(index, 'nombre_auxiliar', e.target.value)}
                  style={inputStyle}
                  placeholder="Nombre Apellido"
                  required // Validación HTML básica
                />
              </td>
              {/* Celdas para los radio buttons */}
              {CALIFICACIONES.map(calif => (
                <td key={calif} style={{ ...tdStyle, textAlign: 'center' }}>
                  <input
                    type="radio"
                    name={`calificacion-${index}`} // Grupo único por fila
                    value={calif}
                    checked={valoracion.calificacion === calif}
                    onChange={() => handleCalificacionChange(index, calif)}
                    style={radioInputStyle}
                    required // Validación HTML básica
                  />
                </td>
              ))}
              <td style={tdStyle}>
                <input
                  type="text"
                  value={valoracion.justificacion}
                  onChange={(e) => handleChange(index, 'justificacion', e.target.value)}
                  style={inputStyle}
                  placeholder="Justifique brevemente..."
                  required // Validación HTML básica
                  maxLength={150} // Límite ejemplo (3 renglones aprox)
                />
              </td>
              <td style={tdStyle}>
                <button
                  type="button" // Importante para que no envíe el form
                  onClick={() => removeRow(index)}
                  style={removeButton}
                  // Deshabilitar si es la única fila
                  disabled={valoraciones.length <= 1}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button" // Importante para que no envíe el form
        onClick={addRow}
        style={addRowButtonStyle}
      >
        + Agregar Auxiliar
      </button>
    </div>
  );
};

export default CompletarValoracionAuxiliaresDoc;