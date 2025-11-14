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
  disabled?: boolean;
}

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
  // ESTILO 1: Modo Edición (Fondo azulado)
  fieldEditable: {
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
    boxSizing: 'border-box' as const,
  },
  // ESTILO 2: Modo Vista Previa/Impresión (Plano, parece texto)
  fieldReadOnly: {
     width: '100%',
     backgroundColor: 'transparent',
     border: 'none',
     borderBottom: '1px dashed #ccc', // Una línea sutil para que se sepa que ahí va un dato
     borderRadius: '0',
     padding: '10px 0',
     color: '#000',
     fontSize: '16px',
     fontFamily: '"Roboto", "Segoe UI", sans-serif',
     cursor: 'default',
     fontWeight: 500,
     outline: 'none',
     boxShadow: 'none',
     appearance: 'none' as const,
     MozAppearance: 'none' as const,
     WebkitAppearance: 'none' as const,
  }
};

const CompletarDatosGeneralesDoc: React.FC<Props> = ({
  materias,
  docentes,
  formData,
  handleChange,
  loading,
  disabled = false
}) => {
  const sedeOptions = [
    { value: "", label: "Seleccione" },
    { value: "Trelew", label: "Trelew" },
    { value: "Madryn", label: "Madryn" },
    { value: "Esquel", label: "Esquel" },
    { value: "Comodoro", label: "Comodoro" },
  ];

  const fieldsConfig = [ 
    { label: 'Sede', name: 'sede', type: 'select', options: sedeOptions },
    { label: 'Actividad curricular', name: 'id_materia', type: 'select', options: materias.map(m => ({ value: m.id_materia, label: m.nombre })) },
    { label: 'Código de la actividad curricular', name: 'codigoMateria', type: 'text' },
    { label: 'Ciclo Lectivo', name: 'ciclo_lectivo', type: 'number' },
    { label: 'Docente Responsable', name: 'id_docente', type: 'select', options: docentes.map(d => ({ value: d.id_docente, label: d.nombre })) },
    { label: 'Cantidad de alumnos inscriptos', name: 'cantidad_alumnos_inscriptos', type: 'number' },
    { label: 'Cantidad de comisiones teóricas', name: 'cantidad_comisiones_teoricas', type: 'number' },
    { label: 'Cantidad de comisiones prácticas', name: 'cantidad_comisiones_practicas', type: 'number' },
  ];

  if (loading) return <p style={{ textAlign: 'center', color: '#003366' }}>Cargando datos...</p>;

  return (
    <div style={styles.container}>
      {/* Estilos inline para asegurar que los selects deshabilitados se vean limpios en todos los navegadores */}
      <style>
        {`
           select:disabled::-ms-expand { display: none; }
           select:disabled {
               opacity: 1 !important;
               color: #000 !important;
               background-image: none !important;
           }
           input:disabled {
               opacity: 1 !important;
               color: #000 !important;
           }
        `}
      </style>

      {fieldsConfig.map((field, idx) => {
         // 1. Determinar si el campo debe estar funcionalmente deshabilitado
         //    Es true SI: el formulario entero está disabled O SI es un campo fijo (ej. código materia)
         const isFunctionalDisabled = disabled || ['codigoMateria', 'ciclo_lectivo', 'id_docente', 'cantidad_alumnos_inscriptos', 'id_materia'].includes(field.name);
         
         // 2. Determinar el ESTILO VISUAL
         //    Si el formulario entero está en modo 'Vista Previa' (disabled=true) -> Usamos estilo plano para TODO.
         //    Si estamos editando (disabled=false) -> Usamos el estilo azul para TODO (incluso los campos fijos, para uniformidad).
         const currentStyle = disabled ? styles.fieldReadOnly : styles.fieldEditable;

         return (
            <div key={idx} style={styles.row}>
                <label style={styles.label} htmlFor={field.name}>{field.label}</label>
                
                {field.type === 'select' ? (
                    <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        style={currentStyle}
                        disabled={isFunctionalDisabled}
                    >
                        {/* Mostrar guión si está bloqueado y vacío */}
                        {isFunctionalDisabled && !formData[field.name as keyof typeof formData] && <option value="">-</option>}
                        
                        {field.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        style={currentStyle}
                        disabled={isFunctionalDisabled}
                        placeholder={isFunctionalDisabled && !formData[field.name as keyof typeof formData] ? "-" : ""}
                    />
                )}
            </div>
         );
      })}
    </div>
  );
};

export default CompletarDatosGeneralesDoc;