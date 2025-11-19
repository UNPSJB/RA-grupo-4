import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HeaderInstitucional from '../Otros/HeaderInstitucional';
import CompletarDatosGeneralesDoc from './CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from './CompletarNecesidadesDoc';
import CompletarPorcentajesDoc from './CompletarPorcentajesDoc';
import CompletarContenidoAbordadoDoc from './CompletarContenidoAbordadoDoc';
import CompletarProcesoAprendizajeDoc from './CompletarProcesoAprendizajeDoc';
import ConsignarActividadesDoc from './ConsignarActividadesDoc';
import CompletarValoracionAuxiliaresDoc, { ValoracionAuxiliarData } from './CompletarValoracionAuxiliaresDoc';
import ResumenSecciones from '../Departamento/ConsignarResumenValoresEncuesta';

const BASE_URL = 'http://localhost:8000';

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#f4f7f6',
    padding: '0px',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    position: 'relative',
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
  // --- CARTEL CENTRADO ---
  floatingSuccess: {
    position: 'fixed',
    top: '20px', 
    left: '50%', 
    transform: 'translateX(-50%)', 
    backgroundColor: 'white',
    padding: '20px 25px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)', 
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: '450px', 
    width: '90%', 
    animation: 'slideDownFade 0.5s ease-out forwards',
    borderTop: '6px solid #4CAF50', 
    borderLeft: '1px solid #eee',
    borderRight: '1px solid #eee',
    borderBottom: '1px solid #eee',
  },
  successHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '15px',
  },
  successTitle: {
    color: '#2e7d32',
    margin: '0 0 0 15px',
    fontSize: '20px',
    fontWeight: '700',
    flexGrow: 1,
  },
  successText: {
    color: '#555',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '10px',
    width: '100%',
  },
  redirectText: {
    color: '#999',
    fontSize: '13px',
    fontStyle: 'italic',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 5px',
    lineHeight: '1',
  },
  volverButtonSmall: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0078D4',
    backgroundColor: '#f0f8ff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    transition: '0.2s',
  }
};

interface MateriaParaAutocompletar {
  id_materia: number;
  nombre: string;
  codigoMateria: string;
  ciclo_lectivo: number;
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
    { nombre_auxiliar: '', calificacion: '', justificacion: '' },
  ]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [resumenSecciones, setResumenSecciones] = useState<SeccionResumen[]>([]);
  const [opinionSobreResumen, setOpinionSobreResumen] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [informeGenerado, setInformeGenerado] = useState<any>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(5);

  // --- EFECTO PARA REDIRECCIÓN Y CUENTA REGRESIVA ---
  useEffect(() => {
    let timerRedirect: NodeJS.Timeout;
    let timerCount: NodeJS.Timeout;

    if (informeGenerado) {
      setSegundosRestantes(5); // Reiniciamos a 5 segundos
      
      // Temporizador para la redirección final
      timerRedirect = setTimeout(() => {
        navigate(-1);
      }, 5000);

      // Temporizador para actualizar el contador visual cada segundo
      timerCount = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timerRedirect);
      clearInterval(timerCount);
    };
  }, [informeGenerado, navigate]);

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
          setFormData(prev => ({
            ...prev,
            id_materia: String(selectedMateria.id_materia),
            codigoMateria: selectedMateria.codigoMateria || '',
            ciclo_lectivo: String(selectedMateria.ciclo_lectivo || ''),
            id_docente: '1',
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
      id_docente: Number(formData.id_docente) || null,
      cantidad_alumnos_inscriptos: Number(formData.cantidad_alumnos_inscriptos) || null,
      cantidad_comisiones_teoricas: Number(formData.cantidad_comisiones_teoricas) || null,
      cantidad_comisiones_practicas: Number(formData.cantidad_comisiones_practicas) || null,
      porcentaje_teoricas: Number(formData.porcentaje_teoricas) || null,
      porcentaje_practicas: Number(formData.porcentaje_practicas) || null,
      porcentaje_contenido_abordado: Number(formData.porcentaje_contenido_abordado) || null,
      justificacion_porcentaje: formData.justificacion_porcentaje || null,
      necesidades_equipamiento: equipamiento.length > 0 ? equipamiento : null,
      necesidades_bibliografia: bibliografia.length > 0 ? bibliografia : null,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#333' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && materias.length === 0) {
    return (
      <div style={styles.page}>
        <HeaderInstitucional />
        <div style={styles.container}>
          <p style={styles.errorText}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      
      {/* === NOTIFICACIÓN FLOTANTE === */}
      {informeGenerado && (
        <div style={styles.floatingSuccess}>
           <style>{`
             /* Animación de caída desde arriba */
             @keyframes slideDownFade { 
               from { opacity: 0; transform: translate(-50%, -20px); } 
               to { opacity: 1; transform: translate(-50%, 0); } 
             }
             @keyframes checkmark { 0% { stroke-dashoffset: 50; } 100% { stroke-dashoffset: 0; } }
             /* Pequeña animación de pulso para el contador */
             @keyframes pulseGray { 0% { color: #999; } 50% { color: #555; } 100% { color: #999; } }
           `}</style>
           
           <div style={styles.successHeader}>
              <div style={{ width: '35px', height: '35px', backgroundColor: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 52 52" width="25" height="25">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#4CAF50" strokeWidth="2" />
                  <path fill="none" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="50" strokeDashoffset="0" d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        style={{ animation: 'checkmark 0.8s ease-in-out forwards' }} />
                </svg>
              </div>
              <h3 style={styles.successTitle}>¡Informe Creado!</h3>
              <button onClick={() => navigate(-1)} style={styles.closeButton} title="Cerrar y volver ya">×</button>
           </div>

           <p style={styles.successText}>
             El informe se ha guardado correctamente en el sistema.
           </p>
           
           <div style={styles.redirectText}>
             <span>⏳</span> 
             <span style={{ animation: 'pulseGray 2s infinite' }}>
               Volviendo automáticamente en <b>{segundosRestantes}s</b>...
             </span>
           </div>

           <button onClick={() => navigate(-1)} style={styles.volverButtonSmall}>
             Volver ahora
           </button>
        </div>
      )}

      {/* === FORMULARIO === */}
      <div style={{...styles.container, opacity: informeGenerado ? 0.4 : 1, filter: informeGenerado ? 'blur(2px)' : 'none', transition: 'all 0.5s' }}>
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
          />
          <CompletarNecesidadesDoc equipamiento={equipamiento} bibliografia={bibliografia} onNecesidadesChange={handleNecesidadesChange} />
          <CompletarPorcentajesDoc formData={formData} handleChange={handleFormChange} />
          <CompletarContenidoAbordadoDoc formData={formData} handleChange={handleFormChange} />
          <ResumenSecciones idMateria={Number(formData.id_materia)} handleChange={handleResumenChange} />
          <CompletarProcesoAprendizajeDoc formData={formData} handleChange={handleFormChange} />
          <ConsignarActividadesDoc actividades={actividades} onActividadesChange={handleActividadesChange} />
          <CompletarValoracionAuxiliaresDoc valoraciones={valoracionesAuxiliares} onValoracionesChange={handleValoracionesChange} />

          <div style={styles.buttonContainer}>
            <button type="submit" style={{...styles.submitButton, opacity: informeGenerado ? 0.5 : 1, cursor: informeGenerado ? 'not-allowed' : 'pointer'}} disabled={loading || !formData.id_materia || !!informeGenerado}>
              {loading ? 'Procesando...' : (informeGenerado ? '¡Enviado!' : 'Generar Informe')}
            </button>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default GenerarInformeACDoc;