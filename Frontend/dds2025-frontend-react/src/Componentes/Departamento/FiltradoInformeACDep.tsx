import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Docente {
  id_docente: number;
  nombre: string;
}
interface Materia {
  id_materia: number;
  nombre: string;
  anio: string;
}
interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
}

const FiltradoInformeACDep = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState({
    id_docente: "",
    id_materia: "",
    anio: "",
  });

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const [docRes, matRes] = await Promise.all([
          fetch(`${API_BASE}/docentes/listar`),
          fetch(`${API_BASE}/materias/listar`),
        ]);

        if (!docRes.ok || !matRes.ok) throw new Error("Error obteniendo listas");

        setDocentes(await docRes.json());
        setMaterias(await matRes.json());
      } catch (err) {
        console.error("Error cargando listados:", err);
      }
    };
    fetchListas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const filtrarInformes = async () => {
    const { id_docente, id_materia, anio } = filtros;

    if (!id_docente && !id_materia && !anio) {
      setInformes([]);
      setBusquedaActiva(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      let materiasFiltradas = materias;
      if (anio) {
        materiasFiltradas = materias.filter((m) => m.anio === anio);
      }
      if (id_materia) {
        params.append("id_materia", id_materia);
      } else if (anio) {
        materiasFiltradas.forEach((m) => params.append("id_materia", m.id_materia.toString()));
      }
      if (id_docente) params.append("id_docente", id_docente);

      const url = `${API_BASE}/informesAC/filtradoInformesAc?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los informes");

      const data = await response.json();
      setInformes(data);
      setBusquedaActiva(true);
    } catch (err) {
      console.error("Error filtrando informes:", err);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uni-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #0078D4;
          --uni-secondary-hover: #005fa3;
          --uni-bg-table-header: #e6f2ff;
          --uni-bg-row-hover: #dbeeff;
          --uni-bg-row-alt: #f9f9f9;
          --uni-bg-main: #ffffff;
          --uni-border-light: #ddd;
          --uni-border-medium: #ccc;
          --uni-text-primary: #000000;
          --uni-text-secondary: #666666;
          --uni-input-bg: #cce4f6;
          --uni-input-text: #111;
        }

        .uni-wrapper {
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 25px;
          animation: fadeIn 0.5s ease-out;
          color: var(--uni-text-primary);
        }

        .uni-title-section {
          margin-bottom: 25px;
          border-bottom: 2px solid var(--uni-border-medium);
          padding-bottom: 15px;
        }
        .uni-title {
          font-size: 22px;
          color: var(--uni-primary);
          font-weight: bold;
          margin: 0;
        }

        .search-panel {
          background: var(--uni-bg-main);
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border: 1px solid var(--uni-border-light);
          margin-bottom: 30px;
        }

        /* GRID CORREGIDO: Fuerza 4 columnas iguales */
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px;
          align-items: end;
        }

        /* Ajuste responsive para pantallas más pequeñas */
        @media (max-width: 850px) {
          .filters-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 filas de 2 columnas */
          }
        }
        @media (max-width: 500px) {
          .filters-grid {
            grid-template-columns: 1fr; /* 1 sola columna en móviles */
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%; /* Asegura que ocupe toda su celda */
        }
        .input-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--uni-text-primary);
          white-space: nowrap; /* Evita que etiquetas largas rompan la línea si es posible */
        }
        
        /* ESTILOS UNIFICADOS PARA TODOS LOS INPUTS/BOTONES */
        .uni-select, .uni-input, .search-button {
          width: 100%;
          height: 44px;
          border-radius: 6px;
          font-size: 15px;
          box-sizing: border-box; /* Clave para que el padding no afecte el ancho total */
        }

        .uni-select, .uni-input {
          padding: 10px 14px;
          border: 1px solid var(--uni-border-medium);
          background-color: var(--uni-input-bg);
          color: var(--uni-input-text);
          transition: all 0.2s ease, transform 0.1s ease;
          appearance: none; /* Normaliza el aspecto entre navegadores */
        }

        /* Icono solo para selects */
        .uni-select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23003366' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px; /* Espacio para el icono */
        }

        .uni-select:focus, .uni-input:focus {
          outline: none;
          border-color: var(--uni-secondary);
          background-color: #fff;
          box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.2);
          transform: translateY(-2px);
        }

        .search-button {
          background: var(--uni-secondary);
          color: white;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease, transform 0.1s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-button:hover {
          background: var(--uni-secondary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 120, 212, 0.3);
        }
        .search-button:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .search-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* TABLA DE RESULTADOS (Sin cambios) */
        .results-container { animation: slideUp 0.4s ease-out; }
        .uni-table-wrapper { border-radius: 12px; overflow: hidden; border: 1px solid var(--uni-border-medium); }
        .uni-table { width: 100%; border-collapse: collapse; background: var(--uni-bg-main); }
        .uni-th { background: var(--uni-bg-table-header); color: var(--uni-primary); padding: 14px; text-align: left; font-weight: bold; border-bottom: 2px solid var(--uni-border-medium); font-size: 15px; }
        .uni-td { padding: 14px; border-bottom: 1px solid var(--uni-border-light); vertical-align: middle; color: var(--uni-text-primary); font-size: 14px; height: 60px; }
        .uni-tr { transition: background 0.2s; }
        .uni-tr:hover .uni-td { background-color: var(--uni-bg-row-hover); }
        .uni-tr:nth-child(even) .uni-td { background-color: var(--uni-bg-row-alt); }
        .uni-tr:last-child .uni-td { border-bottom: none; }
        .report-id-badge { background: #eee; color: #333; font-weight: 700; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem; border: 1px solid var(--uni-border-light); }
        .empty-state { text-align: center; padding: 40px; color: var(--uni-text-secondary); background: var(--uni-bg-main); border-radius: 12px; border: 2px dashed var(--uni-border-medium); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="uni-title-section">
        <h2 className="uni-title">Buscador de Informes Sintéticos</h2>
      </div>

      <div className="search-panel">
        <div className="filters-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="id_docente">Docente</label>
            <select
              id="id_docente"
              name="id_docente"
              className="uni-select"
              value={filtros.id_docente}
              onChange={handleChange}
            >
              <option value="">Todos los docentes</option>
              {docentes.map((d) => (
                <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="id_materia">Asignatura</label>
            <select
              id="id_materia"
              name="id_materia"
              className="uni-select"
              value={filtros.id_materia}
              onChange={handleChange}
            >
              <option value="">Todas las materias</option>
              {materias.map((m) => (
                <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="anio">Ciclo Lectivo</label>
            <input
              id="anio"
              type="text"
              name="anio"
              className="uni-input"
              placeholder="Ej: 2024"
              value={filtros.anio}
              onChange={handleChange}
            />
          </div>

          {/* El botón ahora es un hijo directo del grid para ocupar 1 columna entera */}
          <button 
            onClick={filtrarInformes} 
            className="search-button"
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : 'Buscar'}
          </button>
        </div>
      </div>

      {busquedaActiva && (
        <div className="results-container">
          {informes.length > 0 ? (
            <div className="uni-table-wrapper">
              <table className="uni-table">
                <thead>
                  <tr>
                    <th className="uni-th" style={{ width: '80px' }}>Ref.</th>
                    <th className="uni-th">Año</th>
                    <th className="uni-th">Materia / Actividad</th>
                    <th className="uni-th">Docente Responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {informes.map((inf) => (
                    <tr key={inf.id_informesAC} className="uni-tr">
                      <td className="uni-td">
                        <span className="report-id-badge">#{inf.id_informesAC}</span>
                      </td>
                      <td className="uni-td" style={{ fontWeight: 'bold', color: 'var(--uni-primary)' }}>
                        {inf.materia.anio}
                      </td>
                      <td className="uni-td">{inf.materia.nombre}</td>
                      <td className="uni-td">{inf.docente.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3 style={{color: 'var(--uni-text-primary)', margin: 0}}>Sin resultados</h3>
              <p style={{margin: '10px 0 0 0'}}>No se encontraron informes con los criterios seleccionados.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltradoInformeACDep;