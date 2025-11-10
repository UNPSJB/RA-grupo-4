import React, { useState, useEffect } from "react";
import VisualizarInformeACDep from "./Departamento/VisualizarInformeACDep";

const API_BASE = "http://localhost:8000";

interface Docente { id_docente: number; nombre: string; }
interface Materia { id_materia: number; nombre: string; anio: string; }
interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
  ciclo_lectivo?: string | number;
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

  // --- ESTADOS DEL FILTRO (SEPARADOS) ---
  const [filtrosDraft, setFiltrosDraft] = useState({ id_docente: "", id_materia: "", anio: "" });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ id_docente: "", id_materia: "", anio: "" });

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
    const filtroVacio = { id_docente: "", id_materia: "", anio: "" };
    setFiltrosDraft(filtroVacio);
    setFiltrosAplicados(filtroVacio);
  };

  // --- LÓGICA DE FILTRADO  ---
  const informesFiltrados = informes.filter(inf => {
      const { id_docente, id_materia, anio } = filtrosAplicados;
      const cumpleDocente = !id_docente || (inf.docente && String(inf.docente.id_docente) === id_docente);
      const cumpleMateria = !id_materia || (inf.materia && String(inf.materia.id_materia) === id_materia);
      const anioInforme = String(inf.ciclo_lectivo ?? inf.materia?.anio ?? "").toLowerCase();
      const cumpleAnio = !anio || anioInforme.includes(anio.trim().toLowerCase());

      return cumpleDocente && cumpleMateria && cumpleAnio;
  });

  if (informeSeleccionado) return <VisualizarInformeACDep informe={informeSeleccionado} onVolver={() => setInformeSeleccionado(null)} />;

  return (
    <div className="gestion-container">
      <style>{`
        /* Paleta de colores ajustada */
        :root {
            --primary-blue: #007bff;
            --dark-blue-text: #003366;
            --light-gray-bg: #f0f2f5;
            --white-bg: #ffffff;
            --border-light: #ced4da;
            --text-dark: #343a40;
            --text-secondary: #6c757d;
            --hover-light: #f8f9fa;
            --error-red: #dc3545;
            --error-red-hover: #c82333;
        }

        .gestion-container { 
          max-width: 1200px; margin: 0 auto; padding: 30px 20px; 
          font-family: 'Segoe UI', Roboto, sans-serif; 
          color: var(--text-dark); 
          background-color: var(--light-gray-bg); 
        }
        .page-title { 
          text-align: center; font-size: 28px; 
          color: var(--dark-blue-text); 
          margin-bottom: 40px; font-weight: 700; 
        }
        .main-card { 
          background: var(--white-bg); 
          border-radius: 12px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
          overflow: hidden; 
          border: 1px solid rgba(0,0,0,0.08); 
        }
        .filter-section { 
          background-color: var(--white-bg); 
          padding: 25px; 
          border-bottom: 1px solid var(--border-light); 
        }
        .filter-grid { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
          gap: 15px; align-items: end; 
        }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-label { 
          font-weight: 600; font-size: 14px; 
          color: var(--text-secondary); 
        }
        .uni-input { 
          height: 42px; padding: 0 12px; 
          border: 1px solid var(--border-light); 
          border-radius: 6px; font-size: 15px; 
          color: var(--text-dark); 
          background-color: var(--white-bg); 
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .uni-input:focus { 
          border-color: var(--primary-blue); 
          outline: none; 
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); 
        }
        .filter-actions { display: flex; gap: 10px; }
        .btn-filter { 
            flex: 1; height: 42px; background: var(--primary-blue); color: white; border: none; border-radius: 6px; 
            font-weight: 600; cursor: pointer; transition: background-color 0.2s; 
        }
        .btn-filter:hover { background: #0056b3; }
        .btn-clear { 
            flex: 1; height: 42px; background: var(--error-red); color: white; border: none; border-radius: 6px; 
            font-weight: 600; cursor: pointer; transition: background-color 0.2s; 
        }
        .btn-clear:hover { background: var(--error-red-hover); }

        .table-section { padding: 0; }
        .uni-table { width: 100%; border-collapse: collapse; }
        .uni-th { 
          background: var(--primary-blue); color: white; padding: 16px; text-align: left; 
          font-weight: 600; position: sticky; top: 0; font-size: 15px;
        }
        .uni-td { 
          padding: 16px; border-bottom: 1px solid rgba(0,0,0,0.05); vertical-align: middle; color: var(--text-dark);
        }
        .uni-tr:hover { background-color: var(--hover-light); }
        .badge { 
          background: var(--hover-light); padding: 4px 8px; border-radius: 10px; 
          font-size: 12px; font-weight: bold; color: var(--text-secondary); 
        }
        .btn-action { 
           background: var(--primary-blue); color: white; border: none; padding: 8px 16px; 
           border-radius: 6px; cursor: pointer; font-weight: 600; 
           display: inline-flex; align-items: center; gap: 6px; 
           transition: background-color 0.2s, transform 0.2s;
        }
        .btn-action:hover { background: #0056b3; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2); }
        .status-message { text-align: center; padding: 60px; color: var(--text-secondary); font-size: 18px; }
        .error-message { color: var(--error-red); background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px; border: 1px solid #f5c6cb; }
      `}</style>

      <h1 className="page-title">Gestión de Informes de Actividad Curricular</h1>

      <div className="main-card">
        <div className="filter-section">
          <div className="filter-grid">
            <div className="input-group">
              <label className="input-label">Docente</label>
              <select name="id_docente" className="uni-input" value={filtrosDraft.id_docente} onChange={handleInputChange}>
                <option value="">Todos</option>
                {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Asignatura</label>
              <select name="id_materia" className="uni-input" value={filtrosDraft.id_materia} onChange={handleInputChange}>
                <option value="">Todas</option>
                {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Ciclo Lectivo</label>
              <input type="text" name="anio" className="uni-input" placeholder="Ej: 2025" value={filtrosDraft.anio} onChange={handleInputChange} />
            </div>
            <div className="filter-actions">
                <button className="btn-filter" onClick={aplicarFiltros}>🔍 Filtrar</button>
                <button className="btn-clear" onClick={limpiarFiltros}>✖ Limpiar</button>
            </div>
          </div>
        </div>

        <div className="table-section">
          {loading && <div className="status-message">Cargando datos...</div>}
          {error && <div className="error-message">{error}</div>}
          {!loading && !error && (
            informesFiltrados.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="uni-table">
                  <thead>
                    <tr>
                      <th className="uni-th">Ref.</th>
                      <th className="uni-th">Asignatura</th>
                      <th className="uni-th">Docente Responsable</th>
                      <th className="uni-th" style={{textAlign: 'center'}}>Ciclo</th>
                      <th className="uni-th" style={{textAlign: 'center'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {informesFiltrados.map(inf => (
                      <tr key={inf.id_informesAC} className="uni-tr">
                        <td className="uni-td"><span className="badge">#{inf.id_informesAC}</span></td>
                        <td className="uni-td" style={{fontWeight: '600', color: 'var(--dark-blue-text)'}}>
                            {inf.materia?.nombre || 'N/A'}
                        </td>
                        <td className="uni-td">{inf.docente?.nombre || '-'}</td>
                        <td className="uni-td" style={{textAlign: 'center'}}>{inf.ciclo_lectivo || inf.materia?.anio || '-'}</td>
                        <td className="uni-td" style={{textAlign: 'center'}}>
                          <button className="btn-action" onClick={() => setInformeSeleccionado(inf)}>Ver Informe</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="status-message">No hay resultados para la búsqueda actual.</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ListadoInformesACDepREAL;