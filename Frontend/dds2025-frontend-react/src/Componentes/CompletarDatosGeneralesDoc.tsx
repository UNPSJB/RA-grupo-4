import React from 'react';

interface Props {
  materias: any[];
  docentes: any[];
  formData: {
    sede: string;
    ciclo_lectivo: string;
    id_materia: string;
    codigoMateria: string;
    id_docente: string;
    cantidad_alumnos_inscriptos: string;
    cantidad_comisiones_teoricas: string;
    cantidad_comisiones_practicas: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  loading: boolean;
  disabled: boolean; // --- MODIFICADO (Ya no es opcional) ---
}

const fadeIn = {
  animation: 'fadeIn 0.6s ease-in-out',
};

const sharedFieldStyle: React.CSSProperties = {
  width: '100%',
  height: '44px',
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px',
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  backgroundColor: '#cce4f6',
  color: '#111',
  transition: 'all 0.3s ease',
  outline: 'none',
  boxSizing: 'border-box',
};

const sharedDisabledStyle: React.CSSProperties = {
  ...sharedFieldStyle,
  backgroundColor: '#d0dff0',
  color: '#555',
  cursor: 'not-allowed',
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '28px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  row: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginBottom: '14px',
  },
  label: {
    fontWeight: 600,
    marginBottom: '6px',
    color: '#000000',
    fontSize: '16px',
  },
  optionPlaceholder: {
    fontFamily: 'Georgia, serif',
    color: '#666',
  },
};

const CompletarDatosGeneralesDoc: React.FC<Props> = ({
  materias,
  docentes,
  formData,
  handleChange,
  loading,
  disabled // --- MODIFICADO (Valor por defecto eliminado) ---
}) => {
  const sedeOptions = [
    { value: "", label: "Seleccione" },
    { value: "Trelew", label: "Trelew" },
    { value: "Madryn", label: "Madryn" },
    { value: "Esquel", label: "Esquel" },
    { value: "Comodoro", label: "Comodoro" },
  ];

  // --- MODIFICADO (Configuración de campos) ---
  const fieldsConfig = [ 
    { label: 'Sede', name: 'sede', type: 'select', options: sedeOptions, disabled: false },
    // --- MODIFICADO (Eliminada la opción "Seleccione" de materias) ---
    { label: 'Actividad curricular', name: 'id_materia', type: 'select', options: materias.map(m => ({ value: m.id_materia, label: m.nombre })), disabled: disabled },
    { label: 'Código de la actividad curricular', name: 'codigoMateria', type: 'text', disabled: true },
    { label: 'Ciclo Lectivo', name: 'ciclo_lectivo', type: 'number', disabled: true },
    { label: 'Docente Responsable', name: 'id_docente', type: 'select', options: docentes.map(d => ({ value: d.id_docente, label: d.nombre })), disabled: true },
    { label: 'Cantidad de alumnos inscriptos', name: 'cantidad_alumnos_inscriptos', type: 'number', disabled: true },
    { label: 'Cantidad de comisiones teóricas', name: 'cantidad_comisiones_teoricas', type: 'number', disabled: false },
    { label: 'Cantidad de comisiones prácticas', name: 'cantidad_comisiones_practicas', type: 'number', disabled: false },
  ];
  // --- FIN MODIFICADO ---

  if (loading) return <p style={{ textAlign: 'center', color: '#003366' }}>Cargando datos de materias y docentes...</p>;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          select:focus, input:focus {
            border-color: #0078D4;
            box-shadow: 0 0 0 2px rgba(0,120,212,0.2);
          }
          select:hover, input:hover {
            border-color: #0078D4;
          }
          select option[value=""] {
            font-family: Georgia, serif;
            color: #666;
          }
        `}
      </style>

      {fieldsConfig.map((field, idx) => (
        <div key={idx} style={{ ...styles.row, ...fadeIn }}>
          <label style={styles.label} htmlFor={field.name}>{field.label}</label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              // --- CORRECCIÓN (Binding directo a formData) ---
              value={formData[field.name as keyof typeof formData]}
              // --- FIN CORRECCIÓN ---
              onChange={handleChange}
              style={field.disabled ? sharedDisabledStyle : sharedFieldStyle}
              disabled={field.disabled}
              required
            >
              {field.options?.map((opt: any) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={opt.value === "" ? styles.optionPlaceholder : {}}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              // --- CORRECCIÓN (Binding directo a formData) ---
              value={formData[field.name as keyof typeof formData]}
              // --- FIN CORRECCIÓN ---
              onChange={handleChange}
              style={field.disabled ? sharedDisabledStyle : sharedFieldStyle}
              disabled={field.disabled}
              required
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CompletarDatosGeneralesDoc;