import React, { useState } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  fieldset: { border: '1px solid #555', borderRadius: '6px', padding: '15px', marginBottom: '20px' },
  legend: { padding: '0 10px', color: '#00bfff', fontWeight: 'bold' },
  formGridFull: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'flex-end', marginBottom: '15px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #777', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' },
  label: { fontSize: '0.9em', color: '#ccc', marginBottom: '4px', display: 'block' },
  buttonAdd: { padding: '8px 15px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold', height: '35px' },
  list: { listStyle: 'decimal', paddingLeft: '20px', margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e1e', padding: '10px', borderRadius: '4px', marginBottom: '5px' },
  buttonDelete: { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', fontSize: '0.9em' },
  instructions: {
    color: '#333',
    fontSize: '0.95em',
    lineHeight: '1.5',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #ddd',
  }
};

interface Props {
  equipamiento: string[];
  bibliografia: string[];
  onNecesidadesChange: (
    tipo: 'equipamiento' | 'bibliografia', 
    nuevaLista: string[]
  ) => void;
}

const CompletarNecesidadesDoc: React.FC<Props> = ({ 
  equipamiento, 
  bibliografia, 
  onNecesidadesChange 
}) => {
  
  const [inputEquipamiento, setInputEquipamiento] = useState('');
  const [inputBibliografia, setInputBibliografia] = useState('');

  const agregarEquipamiento = () => {
    if (inputEquipamiento.trim()) {
      const nuevaLista = [...equipamiento, inputEquipamiento.trim()];
      onNecesidadesChange('equipamiento', nuevaLista);
      setInputEquipamiento('');
    }
  };

  const agregarBibliografia = () => {
    if (inputBibliografia.trim()) {
      const nuevaLista = [...bibliografia, inputBibliografia.trim()];
      onNecesidadesChange('bibliografia', nuevaLista);
      setInputBibliografia('');
    }
  };

  const eliminarEquipamiento = (index: number) => {
    const nuevaLista = equipamiento.filter((_, i) => i !== index);
    onNecesidadesChange('equipamiento', nuevaLista);
  };

  const eliminarBibliografia = (index: number) => {
    const nuevaLista = bibliografia.filter((_, i) => i !== index);
    onNecesidadesChange('bibliografia', nuevaLista);
  };

  return (
    <div>
      
      <p style={styles.instructions}>
        1.- Indique en el caso que corresponda, las necesidades de equipamiento y actualización de bibliografía que considere prioritarias para su actuación docente. Asimismo, en caso de corresponder, indique los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamientos informáticos requeridos para el desarrollo de clases. (Por favor, verifique si lo solicitado en años anteriores ya se encuentra disponible).
      </p>
      
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Necesidades de Equipamiento e Insumos</legend>
        <div style={styles.formGridFull}>
          <div>
            <label htmlFor="item" style={styles.label}>Descripción del ítem:</label>
            <input
              type="text"
              id="item"
              style={styles.input}
              value={inputEquipamiento}
              onChange={(e) => setInputEquipamiento(e.target.value)}
              placeholder="Ej: Proyector para aula 20"
            />
          </div>
          <button type="button" onClick={agregarEquipamiento} style={styles.buttonAdd}>
            + Agregar
          </button>
        </div>
        <ul style={styles.list}>
          {equipamiento.map((item, index) => (
            <li key={index} style={styles.listItem}>
              <span>{item}</span>
              <button type="button" onClick={() => eliminarEquipamiento(index)} style={styles.buttonDelete}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Necesidades de Bibliografía</legend>
        <div style={styles.formGridFull}>
          <div>
            <label htmlFor="bibliografia" style={styles.label}>Descripción (Título, Autor, etc.):</label>
            <input
              type="text"
              id="bibliografia"
              style={styles.input}
              value={inputBibliografia}
              onChange={(e) => setInputBibliografia(e.target.value)}
              placeholder="Ej: Álgebra Lineal - Rojo, Armando"
            />
          </div>
          <button type="button" onClick={agregarBibliografia} style={styles.buttonAdd}>
            + Agregar
          </button>
        </div>
        <ul style={styles.list}>
          {bibliografia.map((item, index) => (
            <li key={index} style={styles.listItem}>
              <span>{item}</span>
              <button type="button" onClick={() => eliminarBibliografia(index)} style={styles.buttonDelete}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  );
};

export default CompletarNecesidadesDoc;