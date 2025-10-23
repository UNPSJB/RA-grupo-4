import React from 'react';

// Estilos locales (sin cambios)
const sectionStyle: React.CSSProperties = { marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid #eee' };
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#555' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
// --- AÑADIDO: Estilo para el párrafo descriptivo ---
const descriptionStyle: React.CSSProperties = { color: '#666', fontSize: '0.9rem', marginBottom: '15px' };

interface Props {
  formData: {
    porcentaje_contenido_abordado: string | number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompletarContenidoAbordadoDoc: React.FC<Props> = ({ formData, handleChange }) => {
  return (
    <div style={sectionStyle}>
      {/* --- CAMBIO: Título ajustado --- */}
      <h4 style={{ marginTop: 0, marginBottom: '5px', color: '#333' }}>
        2.A Desarrollo de Contenidos Planificados
      </h4>
      {/* --- AÑADIDO: Párrafo descriptivo --- */}
      <p style={descriptionStyle}>
        ¿Se logró desarrollar la totalidad de los contenidos planificados?
        Consigne el porcentaje de contenidos planificados alcanzados. En caso de ser
        necesario mencione las estrategias que planificará para el próximo dictado a
        fin de ajustar el cronograma.
      </p>
      {/* --- FIN AÑADIDO --- */}
      <div>
        {/* --- CAMBIO: Label ajustado --- */}
        <label htmlFor="porcentaje_contenido_abordado" style={labelStyle}>
          Porcentaje de Contenidos Planificados Alcanzados (%):
        </label>
        <input
          type="number"
          id="porcentaje_contenido_abordado"
          name="porcentaje_contenido_abordado"
          value={formData.porcentaje_contenido_abordado}
          onChange={handleChange}
          min="0"
          max="100"
          style={inputStyle}
          placeholder="Ingrese un valor entre 0 y 100"
        />
      </div>
    </div>
  );
};

export default CompletarContenidoAbordadoDoc;

