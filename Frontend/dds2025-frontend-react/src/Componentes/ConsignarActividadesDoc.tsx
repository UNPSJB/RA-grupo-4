import React, { useState } from 'react';

// --- Estilos ---
// Reutilizamos los estilos del ejemplo y añadimos los necesarios para la tabla y el nuevo formulario
const styles: { [key: string]: React.CSSProperties } = {
  fieldset: { border: '1px solid #555', borderRadius: '6px', padding: '15px', marginBottom: '20px' },
  legend: { padding: '0 10px', color: '#00bfff', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #777', backgroundColor: '#333', color: 'white', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #777', backgroundColor: '#333', color: 'white', boxSizing: 'border-box', minHeight: '60px' },
  label: { fontSize: '0.9em', color: '#ccc', marginBottom: '4px', display: 'block' },
  buttonAdd: { padding: '8px 15px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold', width: '100%', height: '35px' },
  buttonDelete: { padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', fontSize: '0.9em' },
  
  // Estilo de la instrucción (copiado del ejemplo)
  instructions: {
    color: '#333',
    fontSize: '0.95em',
    lineHeight: '1.5',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },

  // --- Nuevos estilos para este componente ---
  // Grilla para el formulario de inputs
  formGridTable: {
    display: 'grid',
    // 6 columnas: 1.5fr para nombres/obs, 1fr para las 4 actividades
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1.5fr',
    gap: '10px',
    marginBottom: '15px'
  },
  // Contenedor para el botón de agregar (full width)
  formGridButton: { 
    display: 'grid', 
    gridTemplateColumns: '1fr', 
    gap: '10px' 
  },
  // Estilos de la tabla
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginTop: '15px' 
  },
  th: { 
    border: '1px solid #777', 
    padding: '10px', 
    backgroundColor: '#2a2a2a', 
    color: 'white', 
    textAlign: 'left' 
  },
  td: { 
    border: '1px solid #555', 
    padding: '10px', 
    backgroundColor: '#1e1e1e', 
    verticalAlign: 'top', 
    minWidth: '100px',
    // Para que el texto largo no desborde y salte de línea
    wordBreak: 'break-word',
  }
};

// --- Tipos ---
// Definimos la estructura de una fila de actividad
interface Actividad {
  integranteCatedra: string;
  capacitacion: string;
  investigacion: string;
  extension: string;
  gestion: string;
  observacionComentarios: string;
}

// Props que el componente recibe (la lista y la función para actualizarla)
interface Props {
  actividades: Actividad[];
  onActividadesChange: (nuevaLista: Actividad[]) => void;
}

// Estado inicial para el formulario de "nueva actividad"
const initialFormState: Actividad = {
  integranteCatedra: '',
  capacitacion: '',
  investigacion: '',
  extension: '',
  gestion: '',
  observacionComentarios: ''
};


// --- Componente ---
const ConsignarActividadesDoc: React.FC<Props> = ({ 
  actividades, 
  onActividadesChange 
}) => {
  
  // Estado para la nueva fila que se está por agregar
  const [nuevaActividad, setNuevaActividad] = useState<Actividad>(initialFormState);

  // Handler genérico para actualizar el estado de la nueva actividad
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaActividad(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para agregar la nueva actividad a la lista principal
  const agregarActividad = () => {
    // Validación simple: al menos debe tener un integrante
    if (!nuevaActividad.integranteCatedra.trim()) {
      alert('Por favor, ingrese el nombre del integrante de la cátedra.');
      return;
    }
    
    // Llama a la función del padre para actualizar la lista
    const nuevaLista = [...actividades, nuevaActividad];
    onActividadesChange(nuevaLista);
    
    // Resetea el formulario
    setNuevaActividad(initialFormState);
  };

  // Función para eliminar una actividad de la lista
  const eliminarActividad = (index: number) => {
    const nuevaLista = actividades.filter((_, i) => i !== index);
    onActividadesChange(nuevaLista);
  };

  return (
    <div>
      
      {/* 1. Instrucciones (tomadas de la imagen) */}
      <p style={styles.instructions}>
        3.- Consigne las actividades de Capacitación, Investigación, Extensión y Gestión desarrolladas en el ámbito de la Facultad de Ingeniería por cada uno los integrantes de la cátedra (Profesor Responsable, Profesores, JTP y Auxiliares) en el periodo evaluado. Explicite las observaciones y comentarios que considere pertinentes.
      </p>
      
      {/* 2. Formulario para agregar (como en el ejemplo) */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Registrar Nueva Actividad</legend>

        {/* Grilla de inputs para la nueva actividad */}
        <div style={styles.formGridTable}>
          <div>
            <label htmlFor="integranteCatedra" style={styles.label}>Profesores JTP Auxiliares</label>
            <input
              type="text"
              id="integranteCatedra"
              name="integranteCatedra"
              style={styles.input}
              value={nuevaActividad.integranteCatedra}
              onChange={handleInputChange}
              placeholder="Nombre del integrante"
            />
          </div>
          <div>
            <label htmlFor="capacitacion" style={styles.label}>Capacitación</label>
            <textarea
              id="capacitacion"
              name="capacitacion"
              style={styles.textarea}
              value={nuevaActividad.capacitacion}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="investigacion" style={styles.label}>Investigación</label>
            <textarea
              id="investigacion"
              name="investigacion"
              style={styles.textarea}
              value={nuevaActividad.investigacion}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="extension" style={styles.label}>Extensión</label>
            <textarea
              id="extension"
              name="extension"
              style={styles.textarea}
              value={nuevaActividad.extension}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="gestion" style={styles.label}>Gestión</label>
            <textarea
              id="gestion"
              name="gestion"
              style={styles.textarea}
              value={nuevaActividad.gestion}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="observacionComentarios" style={styles.label}>Observaciones</label>
            <textarea
              id="observacionComentarios"
              name="observacionComentarios"
              style={styles.textarea}
              value={nuevaActividad.observacionComentarios}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Botón de Agregar (full width) */}
        <div style={styles.formGridButton}>
          <button type="button" onClick={agregarActividad} style={styles.buttonAdd}>
            + Agregar Actividad
          </button>
        </div>
      </fieldset>

      {/* 3. Lista de actividades registradas (mostrada como tabla) */}
      <fieldset style={styles.fieldset}>
        <legend style={styles.legend}>Actividades Registradas</legend>
        
        {/* Usamos un div con overflow para que la tabla sea responsive en pantallas chicas */}
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Profesores JTP Auxiliares</th>
                <th style={styles.th}>Capacitación</th>
                <th style={styles.th}>Investigación</th>
                <th style={styles.th}>Extensión</th>
                <th style={styles.th}>Gestión</th>
                <th style={styles.th}>Observaciones y comentarios</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((act, index) => (
                <tr key={index}>
                  <td style={styles.td}>{act.integranteCatedra}</td>
                  <td style={styles.td}>{act.capacitacion}</td>
                  <td style={styles.td}>{act.investigacion}</td>
                  <td style={styles.td}>{act.extension}</td>
                  <td style={styles.td}>{act.gestion}</td>
                  <td style={styles.td}>{act.observacionComentarios}</td>
                  <td style={styles.td}>
                    <button 
                      type="button" 
                      onClick={() => eliminarActividad(index)} 
                      style={styles.buttonDelete}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </fieldset>

    </div>
  );
};

export default ConsignarActividadesDoc;