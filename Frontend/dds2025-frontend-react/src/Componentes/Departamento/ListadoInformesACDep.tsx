import React, { useState, useEffect } from "react";
import VisualizarInformeACDep from "./VisualizarInformeACDep";
// Utilizamos los íconos de lucide-react que ya están importados en tu código reciente
import { Eye, BookOpen, User, Calendar, SlidersHorizontal, Trash2 } from "lucide-react"; 

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
// El componente ErrorCargaDatos y SinDatos no están definidos aquí, pero se asume su existencia si se usan.

const ListadoInformesACDep: React.FC = () => {
  // --- ESTADOS DE DATOS ---
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [informeSeleccionado, setInformeSeleccionado] = useState<InformeAC | null>(null);


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
  
  // Estilos de los inputs/selects
  const inputStyle: React.CSSProperties = {
    height: '42px', 
    padding: '0 12px', 
    border: '1px solid #dcdcdc',
    borderRadius: '6px', 
    fontSize: '15px', 
    backgroundColor: '#fdfdfd',
    color: '#343a40',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

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
        
        {/* Título */}
        <div style={{ 
            padding: '25px', 
            borderBottom: '1px solid #e0e0e0', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#fdfdfd'
        }}>
            <h2 style={{ 
                margin: 0, 
                fontSize: '24px', 
                color: '#003366', 
                fontWeight: 700 
            }}>
                Historial de Informes de Actividad Curricular
            </h2>
        </div>

        {/* Sección de Filtro con clases inspiradas en el diseño */}
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
              style={inputStyle}>
              <option value="">Todos</option>
              {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>)}
            </select>
          </div>
          
          {/* Filtro Asignatura */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '14px', color: '#6c757d' }}>Asignatura</label>
            <select name="id_materia" value={filtrosDraft.id_materia} onChange={handleInputChange} 
              style={inputStyle}>
              <option value="">Todas</option>
              {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
            </select>
          </div>
          
          {/* Filtro Ciclo Lectivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 600, fontSize: '14px', color: '#6c757d' }}>Ciclo Lectivo</label>
            <input type="text" name="ciclo_lectivo" placeholder="Ej: 2025" value={filtrosDraft.ciclo_lectivo} onChange={handleInputChange} 
              style={inputStyle} />
          </div>
          
          {/* Acciones (Botones) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={aplicarFiltros} className="filter-btn-apply">
                <SlidersHorizontal size={16} /> Filtrar
            </button>
            <button onClick={limpiarFiltros} className="filter-btn-clear">
                <Trash2 size={16} /> Limpiar
            </button>
          </div>
        </div>

        {/* Sección de Listado de Informes (Tarjetas) */}
        <div style={{ padding: '25px' }}>
          {loading && <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d', fontSize: '18px' }}>Cargando datos...</div>}
          {error && <div style={{ color: '#dc3545', background: '#f8d7da', padding: '15px', borderRadius: '8px', margin: '0 0 20px 0', border: '1px solid #f5c6cb' }}>{error}</div>}
          
          {!loading && !error && (
            informesFiltrados.length > 0 ? (
                <ul className="lista-encuestas"> {/* Usamos la clase de la lista */}
                    {informesFiltrados.map(inf => (
                        <li key={inf.id_informesAC} className="tarjeta-encuesta">
                            
                            <div className="encuesta-info"> {/* Usamos la clase de info */}
                                <BookOpen size={24} className="icono-materia" />
                                
                                <div style={{overflow: 'hidden', flexShrink: 1, minWidth: 0}}>
                                    <div className="materia-nombre" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        {inf.materia?.nombre || 'Materia N/A'}
                                        <span style={{ 
                                            background: '#e0eaf6', 
                                            color: '#0078D4',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.75rem', 
                                            fontWeight: '600',
                                            flexShrink: 0
                                        }}>
                                            #{inf.id_informesAC}
                                        </span>
                                    </div>
                                    
                                    <div className="encuesta-nombre" style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px'}}>
                                        <User size={16} style={{color: '#6c757d', flexShrink: 0}} /> {inf.docente?.nombre || 'Docente No Asignado'}
                                        <Calendar size={16} style={{color: '#6c757d', marginLeft: '10px', flexShrink: 0}} /> Ciclo {inf.ciclo_lectivo || inf.materia?.anio || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Botón Primario */}
                            <button 
                                onClick={() => setInformeSeleccionado(inf)} 
                                className="boton-primario"
                            >
                                Ver Informe <Eye size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#6c757d', fontSize: '18px' }}>No hay resultados para la búsqueda actual.</div>
            )
          )}
        </div>
      </div>
      
      {/* Bloque de Estilos CSS importado de SeleccionarEncuestas, modificado para filtros y adaptado a informes */}
      <style>{`
          /* Contenedor Principal (ajustado para la estructura existente) */
          .seleccionar-encuestas-container {
            padding: 10px 0;
          }

          .lista-encuestas {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          /* Estilo de Tarjeta (Requisito) */
          .tarjeta-encuesta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff; /* Fondo blanco (#ffffff) */
            border: 1px solid #e8f4ff; /* Borde suave (#e8f4ff) */
            border-radius: 12px; /* Bordes redondeados (12px) */
            padding: 18px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra ligera */
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          /* Hover de Tarjeta */
          .tarjeta-encuesta:hover {
            transform: translateY(-2px); /* Levanta la tarjeta */
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Aumenta la sombra */
          }

          /* Info de la Tarjeta */
          .encuesta-info {
            display: flex;
            align-items: center;
            gap: 15px; /* Ajustado */
            flex-grow: 1;
            overflow: hidden;
          }

          /* Ícono a la izquierda */
          .icono-materia {
            color: #0078D4; /* Color #0078D4 */
            flex-shrink: 0;
            font-size: 24px; /* Ajustado al tamaño de lucide-react */
          }

          /* Texto principal (Título) */
          .materia-nombre {
            font-weight: 700;
            color: #003366; /* Color #003366 */
            font-size: 1.05rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          /* Texto secundario (Subtítulo) */
          .encuesta-nombre {
            color: #555; /* Color #555 */
            font-size: 0.95rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-grow: 1;
          }

          /* Botón Primario */
          .boton-primario {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background-color: #0078D4; /* Fondo azul (#0078D4) */
            color: white; 
            padding: 10px 18px; /* Ajustado el padding */
            border-radius: 8px; /* Bordes redondeados (8px) */
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
            flex-shrink: 0;
            margin-left: 20px;
          }

          /* Hover de Botón */
          .boton-primario:hover {
            background-color: #005bb5; /* Fondo más oscuro (#005bb5) */
            transform: translateY(-1px);
            color: white;
          }
          
          /* Estilos de Botones de Filtro (Tomados del diseño anterior para consistencia) */
          .filter-btn-apply { 
            flex: 1; height: 42px; background: #e0eaf6; color: #007bff;
            border: 1px solid #a8c8e6; border-radius: 6px; font-weight: 600; cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
          }
          .filter-btn-apply:hover { 
            background-color: #d2e2f3 !important; border-color: #8cb4da !important;
          }
          .filter-btn-clear { 
            flex: 1; height: 42px; background: #f8d7da; color: #dc3545;
            border: 1px solid #f5c6cb; border-radius: 6px; font-weight: 600; cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
            display: flex; align-items: center; justify-content: center; gap: 8px;
          }
          .filter-btn-clear:hover { 
            background-color: #f3c1c4 !important; border-color: #eeadad !important;
          }

          /* Diseño Responsive */
          @media (max-width: 768px) {
            /* Tarjeta se apila en columna */
            .tarjeta-encuesta {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            /* Info de la Tarjeta */
            .encuesta-info {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
              width: 100%; /* Asegura que la info tome todo el ancho */
            }

            /* Botón ocupa todo el ancho */
            .boton-primario {
              width: 100%;
              justify-content: center;
              margin-left: 0;
            }
            
            /* Ajuste para que los textos fluyan en el modo columna */
            .materia-nombre, .encuesta-nombre {
              white-space: normal !important;
              text-overflow: clip !important;
              max-width: 100%;
            }
          }
      `}</style>
    </div>
  );
};

export default ListadoInformesACDep;