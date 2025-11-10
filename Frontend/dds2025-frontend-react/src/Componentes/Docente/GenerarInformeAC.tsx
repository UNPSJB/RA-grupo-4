import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HeaderInstitucional from './HeaderInstitucional';
import CompletarDatosGeneralesDoc from './CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from './CompletarNecesidadesDoc';
import CompletarPorcentajesDoc from './CompletarPorcentajesDoc';
import CompletarContenidoAbordadoDoc from './CompletarContenidoAbordadoDoc';
import CompletarProcesoAprendizajeDoc from './CompletarProcesoAprendizajeDoc';
import ConsignarActividadesDoc from './ConsignarActividadesDoc';
import CompletarValoracionAuxiliaresDoc, { ValoracionAuxiliarData } from './CompletarValoracionAuxiliaresDoc';
import ResumenSecciones from './Departamento/ConsignarResumenValoresEncuesta';

const BASE_URL = 'http://localhost:8000';

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f4f7f6',
    padding: '0px',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  container: {
    maxWidth: '950px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    color: '#000',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '40px',
  },
  submitButton: {
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0078D4',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: '20px',
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap',
  },
};

interface MateriaParaAutocompletar {
  id_materia: number;
  nombre: string;
  codigoMateria: string;
  anio: number;
  id_docente: number;
  cantidad_inscripciones: number;
}
interface Docente {
  id_docente: number;
  nombre: string;
}
interface SeccionResumen {
  id: number;
  sigla: string;
  nombre: string;
  porcentajes_opciones: Record<string, number>;
}
interface Actividad {
  integranteCatedra: string;
  capacitacion: string;
  investigacion: string;
  extension: string;
  gestion: string;
  observacionComentarios: string;
}


const GenerarInformeACDoc: React.FC = () => {
  const navigate = useNavigate();
  const { id_materia } = useParams<{ id_materia: string }>();
  const [materias, setMaterias] = useState<MateriaParaAutocompletar[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true); 

  const [formData, setFormData] = useState({
    sede: '',
    ciclo_lectivo: '',
    id_materia: '',
    codigoMateria: '',
    id_docente: '', // Se seteará a '1' automáticamente
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

  // (Estados para componentes hijos, sin cambios)
  const [equipamiento, setEquipamiento] = useState<string[]>([]);
  const [bibliografia, setBibliografia] = useState<string[]>([]);
  const [valoracionesAuxiliares, setValoracionesAuxiliares] = useState<ValoracionAuxiliarData[]>([
    { nombre_auxiliar: '', calificacion: '', justificacion: '' },
  ]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [resumenSecciones, setResumenSecciones] = useState<SeccionResumen[]>([]);
  const [opinionSobreResumen, setOpinionSobreResumen] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [informeGenerado, setInformeGenerado] = useState(null);

  // ---(useEffect de carga) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const materiasRes = await fetch(`${BASE_URL}/materias/listar`);
        const docentesRes = await fetch(`${BASE_URL}/docentes/listar`); 
        if (!materiasRes.ok || !docentesRes.ok) throw new Error('Error al cargar datos');
        
        const materiasData: MateriaParaAutocompletar[] = await materiasRes.json();
        setMaterias(materiasData);
        setDocentes(await docentesRes.json());

        const selectedMateria = materiasData.find((m: MateriaParaAutocompletar) => String(m.id_materia) === id_materia);
        if (selectedMateria) {
          // Precargamos el formulario
          setFormData(prev => ({
            ...prev,
            id_materia: String(selectedMateria.id_materia),
            codigoMateria: selectedMateria.codigoMateria || '',
            ciclo_lectivo: String(selectedMateria.anio || ''), 
            id_docente: '1', // <-- HARDCODEADO
            cantidad_alumnos_inscriptos: String(selectedMateria.cantidad_inscripciones || ''), 
          }));
        }

      } catch (err: any) {
        setError(err.message || 'Error cargando datos iniciales');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id_materia]); 


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNecesidadesChange = (tipo: 'equipamiento' | 'bibliografia', nuevaLista: string[]) => {
    tipo === 'equipamiento' ? setEquipamiento(nuevaLista) : setBibliografia(nuevaLista);
  };
  const handleActividadesChange = (nuevaLista: Actividad[]) => setActividades(nuevaLista);
  const handleResumenChange = (nuevoResumen: SeccionResumen[], nuevoComentario: string) => {
    setResumenSecciones(nuevoResumen);
    setOpinionSobreResumen(nuevoComentario);
  };
  const handleValoracionesChange = (nuevas: ValoracionAuxiliarData[]) => setValoracionesAuxiliares(nuevas);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // (Tu validación de valoraciones)
    const valoracionesValidas = valoracionesAuxiliares.filter(
      v => v.nombre_auxiliar.trim() || v.calificacion || v.justificacion.trim()
    );
    for (let i = 0; i < valoracionesValidas.length; i++) {
      const v = valoracionesValidas[i];
      if (!v.nombre_auxiliar.trim() || !v.calificacion || !v.justificacion.trim()) {
        setError(`Error en Fila ${i + 1} de Valoración Auxiliar: todos los campos son obligatorios.`);
        return;
      }
    }

    const payload = {
      ...formData,
      ciclo_lectivo: Number(formData.ciclo_lectivo) || null,
      id_materia: Number(formData.id_materia) || null,
      id_docente: Number(formData.id_docente) || null, // Se tomará el '1' del state
      cantidad_alumnos_inscriptos: Number(formData.cantidad_alumnos_inscriptos) || null,
      cantidad_comisiones_teoricas: Number(formData.cantidad_comisiones_teoricas) || null,
      cantidad_comisiones_practicas: Number(formData.cantidad_comisiones_practicas) || null,
      porcentaje_teoricas: Number(formData.porcentaje_teoricas) || null,
      porcentaje_practicas: Number(formData.porcentaje_practicas) || null,
      porcentaje_contenido_abordado: Number(formData.porcentaje_contenido_abordado) || null,
      
      // Opcionales
      justificacion_porcentaje: formData.justificacion_porcentaje || null,
      necesidades_equipamiento: equipamiento.length > 0 ? equipamiento : null,
      necesidades_bibliografia: bibliografia.length > 0 ? bibliografia : null,
      
      // Obligatorios
      resumenSecciones: resumenSecciones.length > 0 ? resumenSecciones : null,
      opinionSobreResumen: opinionSobreResumen || null,
      valoracion_auxiliares: valoracionesValidas.length > 0 ? valoracionesValidas : null,
      actividades: actividades.length > 0 ? actividades : null,
      codigoMateria: undefined, 
    };

    if (!payload.id_docente || !payload.id_materia) {
      setError('Debe seleccionar una materia.'); 
      return;
    }

    try {
      setLoading(true);
      
      const res = await fetch(`${BASE_URL}/informesAC/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 422) {
            const camposFaltantes = errData.detail.map((err: any) => `- ${err.loc[1]}`).join('\n');
            throw new Error(`Faltan campos obligatorios o hay errores:\n${camposFaltantes}`);
        }
        throw new Error(errData.detail || `Error en el envío (${res.status})`);
      }
      
      const data = await res.json();
      setInformeGenerado(data);
      alert('¡Informe creado exitosamente!');
      navigate('/home/informes-doc'); 
      
    } catch (err: any) {
      console.error("Error en handleSubmit:", err.message);
      setError(err.message);
      alert(`Error al crear el informe:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && materias.length === 0) {
    return (
      <div style={styles.page}>
        <HeaderInstitucional />
        <div style={styles.container}>
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>Cargando datos iniciales...</p>
        </div>
      </div>
    );
  }

  if (error && materias.length === 0) {
    return (
      <div style={styles.page}>
        <HeaderInstitucional />
        <div style={styles.container}>
          <p style={styles.errorText}>Error cargando datos: {error}</p>
        </div>
      </div>
    );
  }

  if (informeGenerado) {
    return (
      <div style={styles.page}>
        <HeaderInstitucional />
        <div style={styles.container}>
          <h2 style={styles.title}>Informe Generado con Éxito</h2>
          <p>El informe ha sido guardado correctamente.</p>
          <div style={styles.buttonContainer}>
            <button onClick={() => navigate(-1)} style={styles.submitButton}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <form onSubmit={handleSubmit}>
          <HeaderInstitucional />
          <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>
            Anexo 1
          </h2>
          <h2 style={styles.title}>Informe de Actividad Curricular</h2>

          <CompletarDatosGeneralesDoc
            materias={materias}
            docentes={docentes} 
            formData={formData}
            handleChange={handleFormChange}
            loading={loading}
            disabled={true} 
          />

          <CompletarNecesidadesDoc
            equipamiento={equipamiento}
            bibliografia={bibliografia}
            onNecesidadesChange={handleNecesidadesChange}
          />

          <CompletarPorcentajesDoc
            formData={formData}
            handleChange={handleFormChange}
          />

          <CompletarContenidoAbordadoDoc
            formData={formData}
            handleChange={handleFormChange}
          />

          <ResumenSecciones
            idMateria={Number(formData.id_materia)}
            handleChange={handleResumenChange}
          />

          <CompletarProcesoAprendizajeDoc
            formData={formData}
            handleChange={handleFormChange}
          />

          <ConsignarActividadesDoc
            actividades={actividades}
            onActividadesChange={handleActividadesChange}
          />

          <CompletarValoracionAuxiliaresDoc
            valoraciones={valoracionesAuxiliares}
            onValoracionesChange={handleValoracionesChange}
          />

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.submitButton} disabled={loading || !formData.id_materia}>
              {loading ? 'Procesando...' : 'Generar Informe'}
            </button>
          </div>

          {error && <p style={styles.errorText}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default GenerarInformeACDoc;