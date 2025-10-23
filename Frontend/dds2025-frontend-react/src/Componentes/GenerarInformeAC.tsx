import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import CompletarDatosGeneralesDoc from './CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from './CompletarNecesidadesDoc';

const BASE_URL = 'http://localhost:8000';

// --- (Estilos del contenedor) ---
const pageStyle: React.CSSProperties = { backgroundColor: '#f4f7f6', padding: '30px', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const formContainerStyle: React.CSSProperties = { maxWidth: '850px', margin: '0 auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const headerStyle: React.CSSProperties = { textAlign: 'center', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '30px' };
const buttonContainerStyle: React.CSSProperties = { textAlign: 'center', marginTop: '30px' };
const submitButtonStyle: React.CSSProperties = { padding: '12px 25px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s, transform 0.1s' };


const GenerarInformeACDoc: React.FC = () => {
  const navigate = useNavigate();

  // Estado para los <select>
  const [materias, setMaterias] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de Datos Generales
  const [formData, setFormData] = useState({
    sede: '',
    ciclo_lectivo: '',
    id_materia: '',
    id_docente: '',
    cantidad_alumnos_inscriptos: '',
    cantidad_comisiones_teoricas: '',
    cantidad_comisiones_practicas: ''
  });

  // Estado para las listas de Necesidades
  const [equipamiento, setEquipamiento] = useState<string[]>([]);
  const [bibliografia, setBibliografia] = useState<string[]>([]);

  // Estado para el resultado del submit
  const [error, setError] = useState<string | null>(null);
  const [informeGenerado, setInformeGenerado] = useState(null);


  // Cargar datos para los <select>
  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasRes = await fetch(`${BASE_URL}/materias/listar`); 
        const docentesRes = await fetch(`${BASE_URL}/docentes/listar`); 
        if (!materiasRes.ok) throw new Error('Fallo al cargar materias');
        const materiasData = await materiasRes.json();
        setMaterias(materiasData);

        if (!docentesRes.ok) throw new Error('Fallo al cargar docentes');
        const docentesData = await docentesRes.json();
        setDocentes(docentesData);

      } catch (err: any) {
        setError(err.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Función para el hijo 1 (Datos Generales)
  const handleDatosGeneralesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newState: any = { ...prev, [name]: value };

      if (name === 'id_materia') {
        const selectedMateria = materias.find(m => String(m.id_materia) === String(value));
        if (selectedMateria) {
          newState.ciclo_lectivo = selectedMateria.anio || '';
          newState.id_docente = selectedMateria.id_docente || ''; 
          newState.cantidad_alumnos_inscriptos = selectedMateria.cantidad_inscripciones || '';
        } else {
          newState.ciclo_lectivo = '';
          newState.id_docente = '';
          newState.cantidad_alumnos_inscriptos = '';
        }
      }
      return newState;
    });
  };

  // Función para el hijo 2 (Necesidades)
  const handleNecesidadesChange = (
    tipo: 'equipamiento' | 'bibliografia', 
    nuevaLista: string[]
  ) => {
    if (tipo === 'equipamiento') {
      setEquipamiento(nuevaLista);
    } else {
      setBibliografia(nuevaLista);
    }
  };

  // Función de guardado final
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...formData,
      id_docente: Number(formData.id_docente),
      id_materia: Number(formData.id_materia),
      ciclo_lectivo: Number(formData.ciclo_lectivo),
      cantidad_alumnos_inscriptos: Number(formData.cantidad_alumnos_inscriptos) || null,
      cantidad_comisiones_teoricas: Number(formData.cantidad_comisiones_teoricas) || null,
      cantidad_comisiones_practicas: Number(formData.cantidad_comisiones_practicas) || null,
      necesidades_equipamiento: equipamiento,
      necesidades_bibliografia: bibliografia,
    };

    console.log("Enviando payload al backend:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(`${BASE_URL}/informesAC/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Error en el envío');
      }

      const data = await res.json();
      setInformeGenerado(data); // Guarda el resultado
      alert('¡Informe creado exitosamente!');
      navigate(-1); // Opcional: vuelve a la página anterior

    } catch (err: any) {
      setError(err.message);
      alert(`Error al crear el informe: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', fontSize: '18px' }}>Cargando...</p>;
  

  if (informeGenerado) {
    return (
      <div style={pageStyle}>
        <div style={formContainerStyle}>
          <h2>Informe Generado con Éxito</h2>
          <p>El informe ha sido guardado correctamente.</p>
          <button onClick={() => navigate(-1)} style={submitButtonStyle}>Volver</button>
        </div>
      </div>
    );
  }


  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h2 style={headerStyle}>Generar Informe de Actividad Curricular</h2>
          
          {/* 1. Renderiza el Hijo 1 */}
          <CompletarDatosGeneralesDoc
            materias={materias}
            docentes={docentes}
            formData={formData}
            handleChange={handleDatosGeneralesChange}
            loading={loading}
          />

          <hr style={{borderColor: '#eee', margin: '30px 0'}} />
          
          {/* 2. Renderiza el Hijo 2 */}
          <CompletarNecesidadesDoc
            equipamiento={equipamiento}
            bibliografia={bibliografia}
            onNecesidadesChange={handleNecesidadesChange}
          />

          {/* 3. El botón de Submit está en el padre */}
          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle} disabled={loading}>
              {loading ? 'Generando...' : 'Generar Informe'}
            </button>
          </div>
          
          {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

        </form>
      </div>
    </div>
  );
};

export default GenerarInformeACDoc;