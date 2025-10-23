import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CompletarDatosGeneralesDoc from './CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from './CompletarNecesidadesDoc';
import CompletarPorcentajesDoc from './CompletarPorcentajesDoc';
import CompletarContenidoAbordadoDoc from './CompletarContenidoAbordadoDoc';
import CompletarProcesoAprendizajeDoc from './CompletarProcesoAprendizajeDoc';
import CompletarValoracionAuxiliaresDoc, { ValoracionAuxiliarData } from './CompletarValoracionAuxiliaresDoc'; // Importación de la HDU 4


const BASE_URL = 'http://localhost:8000';

// Estilos (sin cambios)
const pageStyle: React.CSSProperties = { backgroundColor: '#f4f7f6', padding: '30px', minHeight: '100vh', fontFamily: 'Arial, sans-serif' };
const formContainerStyle: React.CSSProperties = { maxWidth: '850px', margin: '0 auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
const headerStyle: React.CSSProperties = { textAlign: 'center', color: '#333', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '30px' };
const buttonContainerStyle: React.CSSProperties = { textAlign: 'center', marginTop: '30px' };
const submitButtonStyle: React.CSSProperties = { padding: '12px 25px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#007bff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s, transform 0.1s' };

interface MateriaParaAutocompletar {
  id_materia: number;
  nombre: string;
  anio: number;
  id_docente: number;
  cantidad_inscripciones: number;
}

interface Docente {
    id_docente: number;
    nombre: string;
}


const GenerarInformeACDoc: React.FC = () => {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState<MateriaParaAutocompletar[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    sede: '',
    ciclo_lectivo: '',
    id_materia: '',
    id_docente: '',
    cantidad_alumnos_inscriptos: '',
    cantidad_comisiones_teoricas: '',
    cantidad_comisiones_practicas: '',
    porcentaje_teoricas: '',
    porcentaje_practicas: '',
    justificacion_porcentaje: '',
    porcentaje_contenido_abordado: '',
    aspectos_positivos_enseñanza: '',
    aspectos_positivos_aprendizaje: '',
    obstaculos_enseñanza: '',
    obstaculos_aprendizaje: '',
    estrategias_a_implementar: '',
    resumen_reflexion: '',
  });

  const [equipamiento, setEquipamiento] = useState<string[]>([]);
  const [bibliografia, setBibliografia] = useState<string[]>([]);
  const [valoracionesAuxiliares, setValoracionesAuxiliares] = useState<ValoracionAuxiliarData[]>([
      { nombre_auxiliar: '', calificacion: '', justificacion: '' }
  ]);

  const [error, setError] = useState<string | null>(null);
  const [informeGenerado, setInformeGenerado] = useState(null);

  // useEffect para cargar datos (sin cambios)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const materiasRes = await fetch(`${BASE_URL}/materias/listar`);
        const docentesRes = await fetch(`${BASE_URL}/docentes/listar`);
        if (!materiasRes.ok) throw new Error(`Fallo al cargar materias (${materiasRes.status})`);
        if (!docentesRes.ok) throw new Error(`Fallo al cargar docentes (${docentesRes.status})`);
        const materiasData: MateriaParaAutocompletar[] = await materiasRes.json();
        setMaterias(materiasData);
        const docentesData: Docente[] = await docentesRes.json();
        setDocentes(docentesData);
      } catch (err: any) {
        console.error("Error en fetchData:", err);
        setError(err.message || 'Error cargando datos iniciales');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // handleFormChange (sin cambios)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      let newState: any = { ...prev, [name]: value };
      if (name === 'id_materia') {
        const selectedMateria = materias.find(m => String(m.id_materia) === String(value));
        newState.ciclo_lectivo = selectedMateria?.anio || '';
        newState.id_docente = selectedMateria?.id_docente || '';
        newState.cantidad_alumnos_inscriptos = selectedMateria?.cantidad_inscripciones || '';
      }
      return newState;
    });
  };

  // handleNecesidadesChange (sin cambios)
  const handleNecesidadesChange = ( tipo: 'equipamiento' | 'bibliografia', nuevaLista: string[]) => {
    if (tipo === 'equipamiento') {
      setEquipamiento(nuevaLista);
    } else {
      setBibliografia(nuevaLista);
    }
  };

  // handleValoracionesChange (sin cambios)
  const handleValoracionesChange = (nuevasValoraciones: ValoracionAuxiliarData[]) => {
      setValoracionesAuxiliares(nuevasValoraciones);
  };

  // handleSubmit (VALIDACIÓN DE VALORACIONES MOVIDA ARRIBA DEL PAYLOAD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- Validación de valoraciones auxiliares ---
    const valoracionesValidas = valoracionesAuxiliares.filter(
        v => v.nombre_auxiliar.trim() !== '' || v.calificacion !== '' || v.justificacion.trim() !== ''
    ); // Filtramos filas completamente vacías (opcional)

    for (let i = 0; i < valoracionesValidas.length; i++) {
        const v = valoracionesValidas[i];
        if (!v.nombre_auxiliar.trim()) {
            setError(`Error en Fila ${i + 1} de Valoración: El campo 'JTP/Auxiliares' es obligatorio.`);
            setLoading(false); // Detener carga si hay error
            return;
        }
        if (v.calificacion === '') {
             setError(`Error en Fila ${i + 1} de Valoración: Debe seleccionar una calificación.`);
             setLoading(false); // Detener carga si hay error
             return;
        }
        if (!v.justificacion.trim()) {
            setError(`Error en Fila ${i + 1} de Valoración: El campo 'Justificación' es obligatorio.`);
            setLoading(false); // Detener carga si hay error
            return;
        }
    }
    // --- FIN VALIDACIÓN ---

    setLoading(true); // Solo se activa si las validaciones pasaron

    const payload = {
      sede: formData.sede,
      ciclo_lectivo: Number(formData.ciclo_lectivo) || null,
      id_materia: Number(formData.id_materia) || null,
      id_docente: Number(formData.id_docente) || null,
      cantidad_alumnos_inscriptos: Number(formData.cantidad_alumnos_inscriptos) || null,
      cantidad_comisiones_teoricas: Number(formData.cantidad_comisiones_teoricas) || null,
      cantidad_comisiones_practicas: Number(formData.cantidad_comisiones_practicas) || null,
      porcentaje_teoricas: Number(formData.porcentaje_teoricas) || null,
      porcentaje_practicas: Number(formData.porcentaje_practicas) || null,
      justificacion_porcentaje: formData.justificacion_porcentaje || null,
      porcentaje_contenido_abordado: Number(formData.porcentaje_contenido_abordado) || null,
      aspectos_positivos_enseñanza: formData.aspectos_positivos_enseñanza || null,
      aspectos_positivos_aprendizaje: formData.aspectos_positivos_aprendizaje || null,
      obstaculos_enseñanza: formData.obstaculos_enseñanza || null,
      obstaculos_aprendizaje: formData.obstaculos_aprendizaje || null,
      estrategias_a_implementar: formData.estrategias_a_implementar || null,
      resumen_reflexion: formData.resumen_reflexion || null,
      necesidades_equipamiento: equipamiento,
      necesidades_bibliografia: bibliografia,
      valoracion_auxiliares: valoracionesValidas.length > 0 ? valoracionesValidas : null,
    };

    if (!payload.id_docente || !payload.id_materia) {
        setError("Debe seleccionar un Docente y una Materia.");
        setLoading(false);
        return;
    }

    console.log("Enviando payload al backend:", JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(`${BASE_URL}/informesAC/crear`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error en el envío (${res.status})`);
      }
      const data = await res.json();
      setInformeGenerado(data);
      alert('¡Informe creado exitosamente!');
      navigate(-1);
    } catch (err: any) {
        console.error("Error en handleSubmit:", err);
        setError(err.message);
        alert(`Error al crear el informe: ${err.message}`);
    } finally { setLoading(false); }
  };

  // Renderizado condicional inicial
  if (loading && materias.length === 0 && docentes.length === 0) {
      return <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>Cargando datos iniciales...</p>;
  }

   // Renderizado de error de carga inicial
  if (error && materias.length === 0 && docentes.length === 0) {
      return <p style={{ color: 'red', textAlign: 'center' }}>Error cargando datos: {error}</p>;
  }

  // Renderizado de éxito
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

  // Renderizado del formulario (Ubicación del componente corregida)
  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h2 style={headerStyle}>Generar Informe de Actividad Curricular</h2>

          <CompletarDatosGeneralesDoc
            materias={materias}
            docentes={docentes}
            formData={formData}
            handleChange={handleFormChange}
            loading={loading}
          />

          <hr style={{borderColor: '#eee', margin: '30px 0'}} />

          <CompletarNecesidadesDoc
            equipamiento={equipamiento}
            bibliografia={bibliografia}
            onNecesidadesChange={handleNecesidadesChange}
          />

          <div style={{marginTop: '30px'}}>
            <CompletarPorcentajesDoc
              formData={formData}
              handleChange={handleFormChange}
            />
          </div>

          <div style={{marginTop: '30px'}}>
            <CompletarContenidoAbordadoDoc
              formData={formData}
              handleChange={handleFormChange}
            />
          </div>

          <div style={{marginTop: '30px'}}>
            <CompletarProcesoAprendizajeDoc
              formData={formData}
              handleChange={handleFormChange}
            />
          </div>

          {/* --- AÑADIDO: Renderizar el nuevo componente de Valoración (AHORA AL FINAL) --- */}
          <div style={{marginTop: '30px'}}>
              <CompletarValoracionAuxiliaresDoc
                  valoraciones={valoracionesAuxiliares}
                  onValoracionesChange={handleValoracionesChange}
              />
          </div>
          {/* --- FIN AÑADIDO --- */}

          <div style={buttonContainerStyle}>
            <button type="submit" style={submitButtonStyle} disabled={loading}>
              {loading ? 'Procesando...' : 'Generar Informe'}
            </button>
          </div>

          {/* Mostrar error de envío/validación */}
          {error && <p style={{color: 'red', textAlign: 'center', marginTop: '15px'}}>{error}</p>}

        </form>
      </div>
    </div>
  );
};

export default GenerarInformeACDoc;
