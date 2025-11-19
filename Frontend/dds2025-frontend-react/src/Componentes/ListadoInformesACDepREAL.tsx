import React, { useState, useEffect } from "react";
import VisualizarInformeACDep from "./Departamento/VisualizarInformeACDep";
import SinDatos from "./Otros/SinDatos";

const API_BASE = "http://localhost:8000";

/* ---------------------- INTERFACES ---------------------- */
interface Periodo { 
  ciclo_lectivo: number; 
  cuatrimestre: string; 
}

interface Docente { 
  id_docente: number; 
  nombre: string; 
}

interface Materia { 
  id_materia: number; 
  nombre: string; 
  periodo: Periodo;
}

interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
}

/* ========================================================= */

const ListadoInformesACDepREAL: React.FC = () => {

  // --- ESTADOS ---
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeAC | null>(null);

  // --- FILTROS ---
  const [filtrosDraft, setFiltrosDraft] = useState({ 
    id_docente: "", 
    id_materia: "", 
    ciclo: "",
    cuatrimestre: ""
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({ 
    id_docente: "", 
    id_materia: "", 
    ciclo: "",
    cuatrimestre: ""
  });

  /* ---------------------- INICIALIZACIÓN ---------------------- */
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

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    inicializar();
  }, []);

  /* ---------------------- MANEJO DE FILTROS ---------------------- */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltrosDraft({ ...filtrosDraft, [e.target.name]: e.target.value });
  };

  const aplicarFiltros = () => setFiltrosAplicados(filtrosDraft);

  const limpiarFiltros = () => {
    const vacios = { id_docente: "", id_materia: "", ciclo: "", cuatrimestre: "" };
    setFiltrosDraft(vacios);
    setFiltrosAplicados(vacios);
  };

  /* ---------------------- FILTRADO FINAL ---------------------- */
  const informesFiltrados = informes.filter(inf => {
    const { id_docente, id_materia, ciclo, cuatrimestre } = filtrosAplicados;

    const cumpleDoc = !id_docente || String(inf.docente?.id_docente) === id_docente;
    const cumpleMat = !id_materia || String(inf.materia?.id_materia) === id_materia;

    const cicloInf = String(inf.materia?.periodo?.ciclo_lectivo ?? "");
    const cumpleCiclo = !ciclo || cicloInf.includes(ciclo);

    const cuatriInf = (inf.materia?.periodo?.cuatrimestre ?? "").toLowerCase();
    const cumpleCuatri = !cuatrimestre || cuatriInf.includes(cuatrimestre.toLowerCase());

    return cumpleDoc && cumpleMat && cumpleCiclo && cumpleCuatri;
  });

  /* ---------------------- VISTA DE INFORME ---------------------- */
  if (informeSeleccionado)
    return (
      <VisualizarInformeACDep 
        informe={informeSeleccionado} 
        onVolver={() => setInformeSeleccionado(null)} 
      />
    );

  /* ---------------------- RENDER PRINCIPAL ---------------------- */
  return (
    <div className="gestion-container">

      {/* ESTILOS INLINE */}
      <style>{`
        .gestion-container { max-width: 1200px; margin: auto; padding: 30px; }
        .page-title { text-align: center; font-size: 30px; margin-bottom: 20px; }
        .main-card { background: white; border-radius: 12px; box-shadow: 0 3px 12px rgba(0,0,0,0.1); }

        .filter-section { padding: 25px; border-bottom: 1px solid #ddd; }
        .filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }

        .uni-input { padding: 8px; height: 40px; border-radius: 6px; border: 1px solid #ccc; }
        .filter-actions { display: flex; gap: 10px; }

        .btn-filter { background: #007bff; color: white; padding: 10px; border-radius: 6px; border: none; cursor: pointer; }
        .btn-clear { background: #dc3545; color: white; padding: 10px; border-radius: 6px; border: none; cursor: pointer; }

        table { width: 100%; border-collapse: collapse; }
        th { background: #007bff; color: white; padding: 12px; }
        td { padding: 14px; border-bottom: 1px solid #eee; }

        tr:hover { background: #f8f9fa; }
        .badge { background: #eee; padding: 4px 8px; border-radius: 8px; font-size: 12px; }
      `}</style>

      <h1 className="page-title">Gestión de Informes de Actividad Curricular</h1>

      <div className="main-card">

        {/* ---------------------- FILTROS ---------------------- */}
        <div className="filter-section">
          <div className="filter-grid">

            <div>
              <label>Docente</label>
              <select name="id_docente" className="uni-input" value={filtrosDraft.id_docente} onChange={handleInputChange}>
                <option value="">Todos</option>
                {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>)}
              </select>
            </div>

            <div>
              <label>Asignatura</label>
              <select name="id_materia" className="uni-input" value={filtrosDraft.id_materia} onChange={handleInputChange}>
                <option value="">Todas</option>
                {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
              </select>
            </div>

            <div>
              <label>Ciclo Lectivo</label>
              <input type="text" name="ciclo" className="uni-input" value={filtrosDraft.ciclo} placeholder="Ej: 2024" onChange={handleInputChange} />
            </div>

            <div>
              <label>Cuatrimestre</label>
              <input type="text" name="cuatrimestre" className="uni-input" value={filtrosDraft.cuatrimestre} placeholder="1° / 2°" onChange={handleInputChange} />
            </div>

            <div className="filter-actions">
              <button className="btn-filter" onClick={aplicarFiltros}>🔍 Filtrar</button>
              <button className="btn-clear" onClick={limpiarFiltros}>✖ Limpiar</button>
            </div>

          </div>
        </div>

        {/* ---------------------- TABLA ---------------------- */}
        <div>
          {loading && <div style={{padding: 40}}>Cargando datos...</div>}
          {error && <div style={{padding: 40, color: "red"}}>{error}</div>}

          {!loading && !error && (
            informesFiltrados.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Ref.</th>
                    <th>Asignatura</th>
                    <th>Docente</th>
                    <th>Ciclo</th>
                    <th>Cuatr.</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {informesFiltrados.map(inf => (
                    <tr key={inf.id_informesAC}>
                      <td><span className="badge">#{inf.id_informesAC}</span></td>
                      <td>{inf.materia?.nombre}</td>
                      <td>{inf.docente?.nombre}</td>
                      <td style={{textAlign: "center"}}>{inf.materia?.periodo?.ciclo_lectivo}</td>
                      <td style={{textAlign: "center"}}>{inf.materia?.periodo?.cuatrimestre}</td>

                      <td style={{textAlign: "center"}}>
                        <button 
                          className="btn-filter"
                          onClick={() => setInformeSeleccionado(inf)}>
                          Ver Informe
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            ) : (
              <SinDatos />
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default ListadoInformesACDepREAL;
