import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const CompletarDatosGeneralesDoc = () => {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]); 
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [informeGenerado, setInformeGenerado] = useState(null);

  const [formData, setFormData] = useState({
    sede: '',
    ciclo_lectivo: '',
    id_materia: '',
    id_docente: '',
    cantidad_alumnos_inscriptos: '',
    cantidad_comisiones_teoricas: '',
    cantidad_comisiones_practicas: ''
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        // { id_materia, nombre, anio, id_docente, cantidad_inscripciones }
        const materiasRes = await fetch(`${BASE_URL}/materias/listar`); 
        const docentesRes = await fetch(`${BASE_URL}/docentes/listar`); 

        if (!materiasRes.ok) throw new Error(`Fallo al cargar materias. Estado: ${materiasRes.status}`);
        const materiasData = await materiasRes.json();
        setMaterias(materiasData);

        if (!docentesRes.ok) throw new Error(`Fallo al cargar docentes. Estado: ${docentesRes.status}`);
        const docentesData = await docentesRes.json();
        setDocentes(docentesData);

      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newState = { ...prev, [name]: value };

      if (name === 'id_materia') {

        const selectedMateria = materias.find(m => String(m.id_materia) === String(value));

        if (selectedMateria) {
          newState.ciclo_lectivo = selectedMateria.anio;
          // Asigna el ID del docente de la materia
          newState.id_docente = selectedMateria.id_docente; 
          // Asigna la cantidad de inscriptos 
          newState.cantidad_alumnos_inscriptos = selectedMateria.cantidad_inscripciones;
        } else {
          newState.ciclo_lectivo = '';
          newState.id_docente = '';
          newState.cantidad_alumnos_inscriptos = '';
        }
      }
      return newState;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/informesAC/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Error en el envío');

      const data = await res.json();
      
      const docenteSeleccionado = docentes.find(d => String(d.id_docente) === String(data.id_docente));
      const materiaSeleccionada = materias.find(m => String(m.id_materia) === String(data.id_materia));

      setInformeGenerado({
        ...data,
        docente: docenteSeleccionado,
        materia: materiaSeleccionada
      });
      
    } catch (err) {
      alert('Error al crear el informe');
      console.error(err);
    }
  };
  
    //Falta agregar el pajarito en la esquina superior derecha
  const pageStyle = {
    backgroundColor: '#f4f7f6',
    padding: '30px',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  };
  const formContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  };
  const headerStyle = {
    textAlign: 'center',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
    marginBottom: '30px'
  };
  const formRowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px'
  };
  const labelStyle = {
    width: '40%',
    paddingRight: '15px',
    fontWeight: '600',
    color: '#444',
    boxSizing: 'border-box'
  };
  const inputContainerStyle = {
    width: '60%',
    boxSizing: 'border-box'
  };
  const baseInputStyle = {
    width: '100%',
    padding: '10px 12px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '15px'
  };
  const disabledInputStyle = {
    ...baseInputStyle,
    backgroundColor: '#f5f5f5',
    color: '#777'
  };
  const buttonContainerStyle = {
    textAlign: 'center',
    marginTop: '30px'
  };
  const submitButtonStyle = {
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };
  const generatedReportStyle = {
    marginTop: '40px',
    paddingTop: '20px',
    padding: '25px',
    backgroundColor: '#f0f9eb',
    border: '1px solid #c8e6c9',
    borderRadius: '8px',
  };
  const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0
  };
  const listItemStyle = {
    marginBottom: '10px',
    fontSize: '15px'
  };
  const backButtonStyle = {
    ...submitButtonStyle,
    backgroundColor: '#6c757d',
    marginTop: '10px',
  };


  if (loading) return <p style={{ textAlign: 'center', fontSize: '18px' }}>Cargando datos...</p>;

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h2 style={headerStyle}>Informe de Actividad Curricular</h2>
          
          <div style={formRowStyle}>
            <label style={labelStyle}>Sede</label>
            <div style={inputContainerStyle}>
              <input type="text" name="sede" value={formData.sede} onChange={handleChange} style={baseInputStyle} required />
            </div>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Actividad curricular</label>
            <div style={inputContainerStyle}>
              <select name="id_materia" value={formData.id_materia} onChange={handleChange} style={baseInputStyle} required>
                <option value="">Seleccione una materia</option>
                {materias.map(m => (
                  <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={formRowStyle}>
            <label style={labelStyle}>Código de la actividad curricular</label>
            <div style={inputContainerStyle}>
              <input type="text" value={formData.id_materia} style={disabledInputStyle} readOnly disabled />
            </div>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Ciclo Lectivo</label>
            <div style={inputContainerStyle}>
              <input type="number" name="ciclo_lectivo" value={formData.ciclo_lectivo} style={disabledInputStyle} readOnly disabled />
            </div>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Docente Responsable</label>
            <div style={inputContainerStyle}>
              <select 
                name="id_docente" 
                value={formData.id_docente} 
                onChange={handleChange} 
                style={disabledInputStyle} 
                required 
                disabled 
              >
                <option value="">Seleccione un docente</option>
                {docentes.map(d => (
                  <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={formRowStyle}>
            <label style={labelStyle}>Cantidad de alumnos inscriptos</label>
            <div style={inputContainerStyle}>
              <input 
                type="number" 
                name="cantidad_alumnos_inscriptos" 
                value={formData.cantidad_alumnos_inscriptos} 
                onChange={handleChange} 
                style={disabledInputStyle}
                required 
                disabled 
              />
            </div>
          </div>
          
          <div style={formRowStyle}>
            <label style={labelStyle}>Cantidad de comisiones teóricas</label>
            <div style={inputContainerStyle}>
              <input type="number" name="cantidad_comisiones_teoricas" value={formData.cantidad_comisiones_teoricas} onChange={handleChange} style={baseInputStyle} required />
            </div>
          </div>
          
          <div style={formRowStyle}>
            <label style={labelStyle}>Cantidad de comisiones prácticas</label>
            <div style={inputContainerStyle}>
              <input type="number" name="cantidad_comisiones_practicas" value={formData.cantidad_comisiones_practicas} onChange={handleChange} style={baseInputStyle} required />
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle}>Generar Informe</button>
          </div>
        </form>

        {informeGenerado && (
          <div style={generatedReportStyle}>
            <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Informe generado con éxito</h3>
            <ul style={listStyle}>
              <li style={listItemStyle}><strong>Sede:</strong> {informeGenerado.sede}</li>
              <li style={listItemStyle}><strong>Ciclo Lectivo:</strong> {informeGenerado.ciclo_lectivo}</li>
              <li style={listItemStyle}><strong>Materia:</strong> {informeGenerado.materia?.nombre}</li>
              <li style={listItemStyle}><strong>Código de Materia:</strong> {informeGenerado.materia?.id_materia}</li>
              <li style={listItemStyle}><strong>Docente:</strong> {informeGenerado.docente?.nombre}</li>
              <li style={listItemStyle}><strong>Alumnos inscriptos:</strong> {informeGenerado.cantidad_alumnos_inscriptos}</li>
              <li style={listItemStyle}><strong>Comisiones teóricas:</strong> {informeGenerado.cantidad_comisiones_teoricas}</li>
              <li style={listItemStyle}><strong>Comisiones prácticas:</strong> {informeGenerado.cantidad_comisiones_practicas}</li>
            </ul>
            <button onClick={() => navigate(-1)} style={backButtonStyle}>← Volver al listado</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletarDatosGeneralesDoc;