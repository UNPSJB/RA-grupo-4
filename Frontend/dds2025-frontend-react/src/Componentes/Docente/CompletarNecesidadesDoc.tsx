import React, { useState } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  fieldset: {
    border: '2px solid #003366',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '28px',
    animation: 'fadeIn 0.6s ease-in-out',
  },
  legend: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#003366',
    padding: '0 10px',
  },
  label: {
    fontWeight: 600,
    marginBottom: '6px',
    color: '#000',
    fontSize: '16px',
    display: 'block',
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '2px solid #222',
    fontSize: '16px',
    backgroundColor: '#cce4f6',
    color: '#111',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    alignItems: 'end',
    marginBottom: '16px',
  },
  buttonAdd: {
    padding: '10px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    height: '44px',
    fontSize: '15px',
  },
  list: {
    listStyle: 'decimal',
    paddingLeft: '20px',
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    padding: '10px 14px',
    borderRadius: '6px',
    marginBottom: '8px',
    color: '#111',
    fontSize: '15px',
    border: '2px solid #222',
    animation: 'highlight 0.4s ease-out',
  },
  buttonDelete: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.9em',
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
  onNecesidadesChange,
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
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes highlight {
            0% { background-color: #d0eaff; }
            100% { background-color: #e6f2ff; }
          }
          input:focus {
            border-color: #000;
            box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
          }
          input:hover {
            border-color: #000;
          }
        `}
      </style>

      <p style={styles.instructions}>
        1.- Indique en el caso que corresponda, las necesidades de equipamiento y actualización de bibliografía que considere prioritarias para su actuación docente. Asimismo, en caso de corresponder, indique los insumos básicos necesarios para el desarrollo de actividades prácticas, renovación o incorporación de equipamientos informáticos requeridos para el desarrollo de clases. (Por favor, verifique si lo solicitado en años anteriores ya se encuentra disponible).
      </p>

      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Necesidades de Equipamiento e Insumos</legend>
        <div style={styles.formGrid}>
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
        <div style={styles.formGrid}>
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