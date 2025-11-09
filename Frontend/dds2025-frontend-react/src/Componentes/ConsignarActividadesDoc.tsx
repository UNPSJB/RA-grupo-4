import React, { useState } from 'react';

// --- ESTILOS COMPLETOS ---
const styles: { [key: string]: React.CSSProperties } = {
  fieldset: {
    border: '2px solid #003366',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '28px',
    backgroundColor: '#fff',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  legend: {
    padding: '0 10px',
    color: '#003366',
    fontWeight: 'bold',
    fontSize: '17px',
  },
  label: {
    fontSize: '15px',
    color: '#000',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 'bold',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  input: {
    width: '100%',
    height: '40px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #222',
    backgroundColor: '#cce4f6',
    color: '#111',
    fontSize: '15px',
    boxSizing: 'border-box',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  textarea: {
    width: '100%',
    height: '60px',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #222',
    backgroundColor: '#cce4f6',
    color: '#111',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  buttonAdd: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0078D4',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    marginTop: '10px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  buttonDelete: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  accordion: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    marginBottom: '12px',
    backgroundColor: '#f9f9f9',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  accordionHeader: {
    padding: '12px',
    backgroundColor: '#e6f2ff',
    color: '#003366',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '15px',
  },
  accordionContent: {
    padding: '15px',
    borderTop: '1px solid #ccc',
    fontSize: '14px',
    color: '#000',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  formGridTable: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
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
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
};

interface Actividad {
  integranteCatedra: string;
  capacitacion: string;
  investigacion: string;
  extension: string;
  gestion: string;
  observacionComentarios: string;
}

interface Props {
  actividades: Actividad[];
  onActividadesChange: (nuevaLista: Actividad[]) => void;
  disabled?: boolean;
}

const initialFormState: Actividad = {
  integranteCatedra: '',
  capacitacion: '',
  investigacion: '',
  extension: '',
  gestion: '',
  observacionComentarios: '',
};

const ConsignarActividadesDoc: React.FC<Props> = ({ actividades, onActividadesChange, disabled = false }) => {
  const [nuevaActividad, setNuevaActividad] = useState<Actividad>(initialFormState);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaActividad(prev => ({ ...prev, [name]: value }));
  };

  const agregarActividad = () => {
    if (!nuevaActividad.integranteCatedra.trim()) {
      alert('Por favor, ingrese el nombre del integrante de la cátedra.');
      return;
    }
    onActividadesChange([...actividades, nuevaActividad]);
    setNuevaActividad(initialFormState);
  };

  const eliminarActividad = (index: number) => {
    const nuevaLista = actividades.filter((_, i) => i !== index);
    onActividadesChange(nuevaLista);
  };

  const toggleAccordion = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <div>
      <style>
         {`@media print { .no-print { display: none !important; } }`}
      </style>

      <p style={styles.instructions}>
        3.- Consigne las actividades de Capacitación, Investigación, Extensión y Gestión desarrolladas en el ámbito de la Facultad de Ingeniería por cada uno los integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo evaluado. Explicite las observaciones y comentarios que considere pertinentes.
      </p>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Actividades de Cátedra</legend>

        {/* Formulario de agregar SOLO si NO está disabled */}
        {!disabled && (
            <div className="no-print" style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ marginTop: 0, color: '#003366' }}>Agregar Nueva Actividad</h4>
                <div style={styles.formGridTable}>
                  <div>
                      <label style={styles.label}>Profesores / JTP / Auxiliares</label>
                      <input
                      type="text"
                      name="integranteCatedra"
                      value={nuevaActividad.integranteCatedra}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Nombre del integrante"
                      />
                  </div>
                  <div>
                      <label style={styles.label}>Capacitación</label>
                      <textarea name="capacitacion" value={nuevaActividad.capacitacion} onChange={handleInputChange} style={styles.textarea} />
                  </div>
                  <div>
                      <label style={styles.label}>Investigación</label>
                      <textarea name="investigacion" value={nuevaActividad.investigacion} onChange={handleInputChange} style={styles.textarea} />
                  </div>
                  <div>
                      <label style={styles.label}>Extensión</label>
                      <textarea name="extension" value={nuevaActividad.extension} onChange={handleInputChange} style={styles.textarea} />
                  </div>
                  <div>
                      <label style={styles.label}>Gestión</label>
                      <textarea name="gestion" value={nuevaActividad.gestion} onChange={handleInputChange} style={styles.textarea} />
                  </div>
                  <div>
                      <label style={styles.label}>Observaciones</label>
                      <textarea name="observacionComentarios" value={nuevaActividad.observacionComentarios} onChange={handleInputChange} style={styles.textarea} />
                  </div>
                </div>

                <button type="button" onClick={agregarActividad} style={styles.buttonAdd}>
                + Agregar Actividad
                </button>
            </div>
        )}

        <div style={{ marginTop: '20px' }}>
            {actividades.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#666' }}>No hay actividades registradas.</p>
            ) : (
                actividades.map((act, index) => (
                <div key={index} style={styles.accordion}>
                    <div style={styles.accordionHeader} onClick={() => toggleAccordion(index)}>
                    {act.integranteCatedra || `Integrante ${index + 1}`}
                    <span style={{ float: 'right' }}>{expandedIndex === index || disabled ? '▼' : '▶'}</span>
                    </div>
                    
                    {(expandedIndex === index || disabled) && (
                    <div style={styles.accordionContent}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <p><strong>Capacitación:</strong> {act.capacitacion || '-'}</p>
                            <p><strong>Investigación:</strong> {act.investigacion || '-'}</p>
                            <p><strong>Extensión:</strong> {act.extension || '-'}</p>
                            <p><strong>Gestión:</strong> {act.gestion || '-'}</p>
                        </div>
                        <p style={{ marginTop: '10px' }}><strong>Observaciones:</strong> {act.observacionComentarios || '-'}</p>
                        
                        {!disabled && (
                            <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); eliminarActividad(index); }}
                            style={styles.buttonDelete}
                            className="no-print"
                            >
                            Eliminar
                            </button>
                        )}
                    </div>
                    )}
                </div>
                ))
            )}
        </div>
      </fieldset>
    </div>
  );
};

export default ConsignarActividadesDoc;