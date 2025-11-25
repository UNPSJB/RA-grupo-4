import React, { useState, useEffect } from "react";
import VisualizarInformeACDep from "./VisualizarInformeACDep";

const API_BASE = "http://localhost:8000";

interface Docente { id_docente: number; nombre: string; }
interface Materia { id_materia: number; nombre: string; anio: string; }
interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
  ciclo_lectivo?: string | number;
  cuatrimestre?: "Primer Cuatrimestre" | "Segundo Cuatrimestre";
  [key: string]: any;
}

const ListadoInformesACDepREAL: React.FC = () => {
  // --- ESTADOS DE DATOS ---
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeAC | null>(null);

  // --- ESTADOS DEL FILTRO ---
  const [filtrosDraft, setFiltrosDraft] = useState({
    id_docente: "",
    id_materia: "",
    ciclo_lectivo: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    id_docente: "",
    id_materia: "",
    ciclo_lectivo: "",
  });

  // --- CARGA INICIAL ---
  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      try {
        const [docRes, matRes, infRes] = await Promise.all([
          fetch(`${API_BASE}/docentes/listar`),
          fetch(`${API_BASE}/materias/listar`),
          fetch(`${API_BASE}/informesAC/listar`)
        ]);
        if (!docRes.ok || !matRes.ok || !infRes.ok) throw new Error("Error cargando datos");
        setDocentes(await docRes.json());
        setMaterias(await matRes.json());
        setInformes(await infRes.json());
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };
    inicializar();
  }, []);

  // --- MANEJADORES DE FILTRO ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltrosDraft({ ...filtrosDraft, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => {
    setFiltrosAplicados(filtrosDraft);
  };

  const limpiarFiltros = () => {
    const filtroVacio = { id_docente: "", id_materia: "", ciclo_lectivo: "" };
    setFiltrosDraft(filtroVacio);
    setFiltrosAplicados(filtroVacio);
  };

  // --- LÓGICA DE FILTRADO ---
  const informesFiltrados = informes.filter(inf => {
    const { id_docente, id_materia, ciclo_lectivo } = filtrosAplicados;
    
    const cumpleDocente = !id_docente || (inf.docente && String(inf.docente.id_docente) === id_docente);
    const cumpleMateria = !id_materia || (inf.materia && String(inf.materia.id_materia) === id_materia);
    const cumpleCiclo = !ciclo_lectivo || String(inf.ciclo_lectivo ?? "").includes(ciclo_lectivo.trim());
    
    return cumpleDocente && cumpleMateria && cumpleCiclo;
  });

  if (informeSeleccionado) return <VisualizarInformeACDep informe={informeSeleccionado} onVolver={() => setInformeSeleccionado(null)} />;

  return (
    <div style={{ 
      maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', 
      fontFamily: 'Roboto, sans-serif', color: '#343a40', 
      backgroundColor: '#f0f2f5', minHeight: '100vh'
    }}>
      
      <div style={{ 
        background: '#ffffff', borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', 
        border: '1px solid rgba(0,0,0,0.08)' 
      }}>
        
        {/* Título ahora DENTRO del card principal, CENTRADO y SIN ÍCONO */}
        <div style={{ 
            padding: '25px', 
            borderBottom: '1px solid #e0e0e0', 
            display: 'flex', 
            justifyContent: 'center', // Centrar horizontalmente
            alignItems: 'center', 
            backgroundColor: '#fdfdfd'
        }}>
            <h2 style={{ 
                margin: 0, 
                fontSize: '20px',
                color: '#003366', 
                fontWeight: 600 
            }}>
                Historial de Informes de Actividad Curricular
            </h2>
        </div>

        {/* Sección de Filtro con apariencia más clara */}
        <div style={{ 
          padding: '25px', 
          borderBottom: '1px solid #e0e0e0',
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px',
          alignItems: 'end' 
        }}>
          
          {/* Filtro Docente */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '14px', color: '#6c757d' }}>Docente</label>
            <select name="id_docente" value={filtrosDraft.id_docente} onChange={handleInputChange} 
              style={{ 
                height: '42px', padding: '0 12px', 
                border: '1px solid #dcdcdc',
                borderRadius: '6px', fontSize: '15px', 
                backgroundColor: '#fdfdfd',
                color: '#343a40'
              }}>
              <option value="">Todos</option>
              {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>)}
            </select>
          </div>
          
          {/* Filtro Asignatura */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '14px', color: '#6c757d' }}>Asignatura</label>
            <select name="id_materia" value={filtrosDraft.id_materia} onChange={handleInputChange} 
              style={{ 
                height: '42px', padding: '0 12px', 
                border: '1px solid #dcdcdc', 
                borderRadius: '6px', fontSize: '15px', 
                backgroundColor: '#fdfdfd', 
                color: '#343a40'
              }}>
              <option value="">Todas</option>
              {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
            </select>
          </div>
          
          {/* Filtro Ciclo Lectivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '14px', color: '#6c757d' }}>Ciclo Lectivo</label>
            <input type="text" name="ciclo_lectivo" placeholder="Ej: 2025" value={filtrosDraft.ciclo_lectivo} onChange={handleInputChange} 
              style={{ 
                height: '42px', padding: '0 12px', 
                border: '1px solid #dcdcdc', 
                borderRadius: '6px', fontSize: '15px', 
                backgroundColor: '#fdfdfd', 
                color: '#343a40'
              }} />
          </div>
          
          {/* Acciones (Botones) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={aplicarFiltros} style={{ 
              flex: 1, height: '42px', background: '#e0eaf6', color: '#007bff',
              border: '1px solid #a8c8e6', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d2e2f3', e.currentTarget.style.borderColor = '#8cb4da')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0eaf6', e.currentTarget.style.borderColor = '#a8c8e6')}>
              Filtrar
            </button>
            <button onClick={limpiarFiltros} style={{ 
              flex: 1, height: '42px', background: '#f8d7da', color: '#dc3545',
              border: '1px solid #f5c6cb', borderRadius: '6px', fontWeight: 600, cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3c1c4', e.currentTarget.style.borderColor = '#eeadad')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f8d7da', e.currentTarget.style.borderColor = '#f5c6cb')}>
              Limpiar
            </button>
          </div>
        </div>

        {/* Sección de Tabla */}
        <div style={{ padding: '0' }}>
          {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d', fontSize: '18px' }}>Cargando datos...</div>}
          {error && <div style={{ color: '#dc3545', background: '#f8d7da', padding: '15px', borderRadius: '8px', margin: '20px', border: '1px solid #f5c6cb' }}>{error}</div>}
          {!loading && !error && (
            informesFiltrados.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#e0eaf6', color: '#003366', padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '15px' }}>Ref.</th>
                      <th style={{ background: '#e0eaf6', color: '#003366', padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '15px' }}>Asignatura</th>
                      <th style={{ background: '#e0eaf6', color: '#003366', padding: '16px', textAlign: 'left', fontWeight: 600, fontSize: '15px' }}>Docente Responsable</th>
                      <th style={{ background: '#e0eaf6', color: '#003366', padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>Ciclo</th>
                      <th style={{ background: '#e0eaf6', color: '#003366', padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '15px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {informesFiltrados.map(inf => (
                      <tr key={inf.id_informesAC} style={{ transition: 'background-color 0.2s', borderBottom: '1px solid #f0f0f0' }} className="uni-tr-hover">
                        <td style={{ padding: '16px', verticalAlign: 'middle' }}><span style={{ background: '#f8f9fa', padding: '4px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', color: '#6c757d' }}>#{inf.id_informesAC}</span></td>
                        <td style={{ padding: '16px', verticalAlign: 'middle', fontWeight: 600, color: '#003366' }}>{inf.materia?.nombre || 'N/A'}</td>
                        <td style={{ padding: '16px', verticalAlign: 'middle' }}>{inf.docente?.nombre || '-'}</td>
                        <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center' }}>{inf.ciclo_lectivo || inf.materia?.anio || '-'}</td>
                        <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center' }}>
                          <button onClick={() => setInformeSeleccionado(inf)} style={{ 
                            background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', 
                            borderRadius: '6px', cursor: 'pointer', fontWeight: 600, 
                            transition: 'background-color 0.2s, transform 0.2s'
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3', e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 123, 255, 0.2)')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                            Ver Informe
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d', fontSize: '18px' }}>No hay resultados para la búsqueda actual.</div>
            )
          )}
        </div>
      </div>
      {/* CSS para manejo de interacciones (hover/focus) */}
      <style>{`
          .uni-tr-hover:hover { 
              background-color: #f8f9fa !important;
          }
          /* Foco para inputs y selects */
          select:focus, input:focus {
              border-color: #007bff !important;
              outline: none;
              box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
          }
      `}</style>
    </div>
  );
};

export default ListadoInformesACDepREAL;