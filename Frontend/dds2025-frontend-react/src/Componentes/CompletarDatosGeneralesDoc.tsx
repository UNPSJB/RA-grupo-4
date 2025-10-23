// Archivo: src/Componentes/CompletarDatosGeneralesDoc.tsx
// ROL: Componente "Hijo" (Controlado)

import React from 'react';

// --- Definición de Props ---
// Recibe todo del padre
interface Props {
  materias: any[];
  docentes: any[];
  formData: {
    sede: string;
    ciclo_lectivo: string;
    id_materia: string;
    id_docente: string;
    cantidad_alumnos_inscriptos: string;
    cantidad_comisiones_teoricas: string;
    cantidad_comisiones_practicas: string;
  };
  // Recibe la función para manejar cambios
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  loading: boolean;
}

// --- (Estilos restaurados de tu versión original) ---
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
const disabledInputStyle: React.CSSProperties = {
  ...baseInputStyle,
  backgroundColor: '#f5f5ff',
  color: '#777',
  cursor: 'not-allowed',
  border: '1px solid #ddd',
};

const CompletarDatosGeneralesDoc: React.FC<Props> = ({
  materias,
  docentes,
  formData,
  handleChange,
  loading
}) => {

  if (loading) return <p>Cargando datos de materias y docentes...</p>;

  // Este componente AHORA SOLO DEVUELVE LA TABLA
  // No tiene useEffect, no tiene handleSubmit
  return (
    <table style={tableStyle}>
      <tbody>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="sede">Sede</label>
          </td>
          <td style={tdInputStyle}>
            <input id="sede" type="text" name="sede" value={formData.sede} onChange={handleChange} style={baseInputStyle} required />
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="id_materia">Actividad curricular</label>
          </td>
          <td style={tdInputStyle}>
            <select id="id_materia" name="id_materia" value={formData.id_materia} onChange={handleChange} style={baseInputStyle} required>
              <option value="">Seleccione una materia</option>
              {materias.map((m: any) => (
                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label>Código de la actividad curricular</label>
          </td>
          <td style={tdInputStyle}>
            <input type="text" value={formData.id_materia} style={disabledInputStyle} readOnly disabled />
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="ciclo_lectivo">Ciclo Lectivo</label>
          </td>
          <td style={tdInputStyle}>
            <input id="ciclo_lectivo" type="number" name="ciclo_lectivo" value={formData.ciclo_lectivo} style={disabledInputStyle} readOnly disabled />
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="id_docente">Docente Responsable</label>
          </td>
          <td style={tdInputStyle}>
            <select
              id="id_docente"
              name="id_docente"
              value={formData.id_docente}
              onChange={handleChange}
              style={disabledInputStyle}
              required
              disabled
            >
              <option value="">Docente</option>
              {docentes.map((d: any) => (
                <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>
              ))}
            </select>
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="cantidad_alumnos_inscriptos">Cantidad de alumnos inscriptos</label>
          </td>
          <td style={tdInputStyle}>
            <input
              id="cantidad_alumnos_inscriptos"
              type="number"
              name="cantidad_alumnos_inscriptos"
              value={formData.cantidad_alumnos_inscriptos}
              onChange={handleChange}
              style={disabledInputStyle}
              required
              disabled
            />
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="cantidad_comisiones_teoricas">Cantidad de comisiones teóricas</label>
          </td>
          <td style={tdInputStyle}>
            <input id="cantidad_comisiones_teoricas" type="number" name="cantidad_comisiones_teoricas" value={formData.cantidad_comisiones_teoricas} onChange={handleChange} style={baseInputStyle} required />
          </td>
        </tr>
        <tr>
          <td style={tdLabelStyle}>
            <label htmlFor="cantidad_comisiones_practicas">Cantidad de comisiones prácticas</label>
          </td>
          <td style={tdInputStyle}>
            <input id="cantidad_comisiones_practicas" type="number" name="cantidad_comisiones_practicas" value={formData.cantidad_comisiones_practicas} onChange={handleChange} style={baseInputStyle} required />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default CompletarDatosGeneralesDoc;