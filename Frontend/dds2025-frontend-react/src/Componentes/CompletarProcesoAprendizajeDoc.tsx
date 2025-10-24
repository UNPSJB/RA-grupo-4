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

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', marginBottom: '15px' };
const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'center', fontWeight: 'bold', color: '#333' };
const tdInputStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '10px', verticalAlign: 'top' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '5px', fontSize: '15px', resize: 'vertical', minHeight: '80px' };
const instructionsStyle: React.CSSProperties = { color: '#333', fontSize: '0.95em', lineHeight: '1.5', marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #ddd' };

const CompletarProcesoAprendizajeDoc: React.FC<Props> = ({
  formData,
  handleChange,
}) => {
  return (
    <div>
      <p style={instructionsStyle}>
        2.C. ¿Cuáles fueron los principales aspectos positivos y los obstáculos que se manifestaron durante el desarrollo del espacio curricular? Centrándose específicamente en los procesos de enseñanza y/o aprendizaje. Complete en el siguiente cuadro.
      </p>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th colSpan={2} style={thStyle}>Aspectos positivos</th>
            <th colSpan={2} style={thStyle}>Obstáculos</th>
            <th rowSpan={2} style={{...thStyle, verticalAlign: 'middle'}}>Estrategias a implementar</th>
          </tr>
          <tr>
            <th style={thStyle}>Proceso Enseñanza</th>
            <th style={thStyle}>Proceso aprendizaje</th>
            <th style={thStyle}>Proceso Enseñanza</th>
            <th style={thStyle}>Proceso aprendizaje</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdInputStyle}>
              <textarea
                name="aspectos_positivos_enseñanza"
                value={formData.aspectos_positivos_enseñanza}
                onChange={handleChange}
                style={textareaStyle}
                rows={4}
              />
            </td>
            <td style={tdInputStyle}>
              <textarea
                name="aspectos_positivos_aprendizaje"
                value={formData.aspectos_positivos_aprendizaje}
                onChange={handleChange}
                style={textareaStyle}
                rows={4}
              />
            </td>
            <td style={tdInputStyle}>
              <textarea
                name="obstaculos_enseñanza"
                value={formData.obstaculos_enseñanza}
                onChange={handleChange}
                style={textareaStyle}
                rows={4}
              />
            </td>
            <td style={tdInputStyle}>
              <textarea
                name="obstaculos_aprendizaje"
                value={formData.obstaculos_aprendizaje}
                onChange={handleChange}
                style={textareaStyle}
                rows={4}
              />
            </td>
            <td style={tdInputStyle}>
              <textarea
                name="estrategias_a_implementar"
                value={formData.estrategias_a_implementar}
                onChange={handleChange}
                style={textareaStyle}
                rows={4}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <p style={instructionsStyle}>
        Escriba un resumen de la reflexión sobre la práctica docente que se realizó en la reunión de equipo de cátedra. En caso de corresponder, consigne nuevas estrategias a implementar (cambio de cronograma, modificación del proceso de evaluación, etc.).
      </p>
      
      <textarea
        name="resumen_reflexion"
        value={formData.resumen_reflexion}
        onChange={handleChange}
        style={{...textareaStyle, minHeight: '100px'}}
        rows={5}
        placeholder="Escriba aquí su resumen..."
      />
    </div>
  );
};

export default CompletarProcesoAprendizajeDoc;