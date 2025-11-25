import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ChevronDown } from 'lucide-react'; // Importamos ChevronDown para el botón 'Ver Más'

// --- INTERFACES ---
interface Periodo {
  id: number;
  ciclo_lectivo: number;
  cuatrimestre: string;
}
interface Materia {
  id_materia: number;
  nombre: string;
  periodo: Periodo;
  codigoMateria?: string;
  id_docente: number;
}

// Interfaz para los informes que ya existen
interface InformeRealizado {
  id_informesAC: number;
  ciclo_lectivo: number | string;
  cuatrimestre: string;
  materia: { id_materia: number };
}

const ITEMS_PER_PAGE = 3; // Constante para definir cuántos items mostrar por vez

const ListadoInformesACDoc: React.FC = () => {
  // Constantes de entorno (Idealmente, estas deberían venir de un contexto o prop)
  const ID_DOCENTE_ACTUAL = 1;
  const CICLO_LECTIVO_ACTUAL = new Date().getFullYear();
  const CUATRIMESTRE_ACTUAL = "Segundo";
  const API_BASE = "http://localhost:8000";

  // Estados
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informesHechos, setInformesHechos] = useState<InformeRealizado[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🆕 Estado para controlar cuántos elementos se muestran
  const [mostrarCantidad, setMostrarCantidad] = useState<number>(ITEMS_PER_PAGE); 
  
  const navigate = useNavigate();

  // --- EFECTO DE CARGA DE DATOS ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);

        // Lógica de fetch (tu código original)
        const [resMaterias, resInformes] = await Promise.all([
          fetch(`${API_BASE}/materias/listar`),
          fetch(`${API_BASE}/informesAC/filtradoInformesAc?id_docente=${ID_DOCENTE_ACTUAL}`)
        ]);

        if (!resMaterias.ok || !resInformes.ok) {
          throw new Error("Error al consultar los datos al servidor.");
        }

        const dataMaterias: Materia[] = await resMaterias.json();
        const dataInformes: InformeRealizado[] = await resInformes.json();

        setMaterias(dataMaterias);
        setInformesHechos(dataInformes);

      } catch (err: any) {
        setError(err.message || "Error desconocido al cargar listas.");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [CICLO_LECTIVO_ACTUAL]);

  // --- LÓGICA DE FILTRADO PRINCIPAL (USANDO useMemo para optimización) ---
  const materiasPendientes = useMemo(() => {
      return materias.filter(materia => {
          const correspondeDocente = materia.id_docente === ID_DOCENTE_ACTUAL;
          const esCicloLectivoActual = Number(materia.periodo.ciclo_lectivo) === CICLO_LECTIVO_ACTUAL
                                         && materia.periodo.cuatrimestre === CUATRIMESTRE_ACTUAL;

          if (!correspondeDocente || !esCicloLectivoActual) return false;

          const yaEstaHecho = informesHechos.some(inf => 
              inf.materia.id_materia === materia.id_materia &&
              Number(inf.ciclo_lectivo) === CICLO_LECTIVO_ACTUAL
          );

          return !yaEstaHecho;
      });
  }, [materias, informesHechos, ID_DOCENTE_ACTUAL, CICLO_LECTIVO_ACTUAL, CUATRIMESTRE_ACTUAL]);
  
  // 🆕 Materias que se van a mostrar (subconjunto de materiasPendientes)
  const materiasVisibles = materiasPendientes.slice(0, mostrarCantidad);

  // 🆕 Lógica para mostrar más elementos
  const handleVerMas = () => {
      setMostrarCantidad(prev => prev + ITEMS_PER_PAGE);
  };

  // --- NAVEGACIÓN ---
  const handleSeleccionarMateria = (id_materia: number) => {
    navigate(`/home/generar-informe/${id_materia}`);
  };

  // --- ESTILOS INLINE (Se mantiene como estaba) ---
  const BUTTON_BASE_STYLE = {
    padding: '8px 16px', fontSize: '14px', fontWeight: 'bold', color: '#ffffff',
    backgroundColor: '#00bcd4', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer',
    transition: 'all 0.2s', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    textDecoration: 'none'
  };

  // 🆕 Estilos para el botón "Ver Más" (lo hacemos similar pero con color distinto)
  const VIEW_MORE_BUTTON_STYLE = {
    ...BUTTON_BASE_STYLE,
    backgroundColor: '#4caf50', // Verde
    marginTop: '20px',
    width: '100%',
    justifyContent: 'center',
  };
  
  // 🆕 Hover para el botón "Ver Más"
  const handleViewMoreHover = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, isHovering: boolean) => {
    e.currentTarget.style.backgroundColor = isHovering ? '#388e3c' : '#4caf50'; // Verde más oscuro
    e.currentTarget.style.transform = isHovering ? 'translateY(-1px)' : 'translateY(0)';
  };

  const CARD_STYLE = {
    backgroundColor: '#ffffff', borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)', fontFamily: '"Segoe UI", "Roboto", sans-serif',
    maxWidth: '1000px', margin: '0 auto', 
  };
  
  const TITLE_STYLE = { 
    fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#003366',
    display: 'flex', alignItems: 'center', gap: '10px', padding: '28px 28px 0 28px'
  };
  
  const ITEM_CONTAINER_STYLE = {
    padding: '0 28px 28px 28px', // Ajustado el padding inferior
  }
  
  const ITEM_ROW_STYLE = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #ddd',
  };
  
  if (cargando) {
      return <div style={{padding: '28px', textAlign: 'center', color: '#00bcd4'}}>Cargando informes...</div>;
  }
  
  if (error) {
      return <div style={{padding: '28px', textAlign: 'center', color: '#e53935'}}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '28px' }}>
      <div style={CARD_STYLE}>
        
        {/* Título de la Sección */}
        <h3 style={TITLE_STYLE}>
          <span style={{color: '#00bcd4'}}>&#9203;</span> Informes Pendientes ({CUATRIMESTRE_ACTUAL} Cuatrimestre {CICLO_LECTIVO_ACTUAL})
        </h3>
        
        {/* Lista de Items */}
        <div style={ITEM_CONTAINER_STYLE}>
          {materiasPendientes.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fff8', borderRadius: '8px', border: '1px solid #c8e6c9', color: '#2e7d32', marginTop: '20px' }}>
              <h4 style={{margin: '0 0 10px 0'}}>¡Todo al día!</h4>
              <p style={{margin: 0}}>No tienes informes pendientes para el ciclo lectivo {CICLO_LECTIVO_ACTUAL}.</p>
            </div>
          ) : (
            <>
              {/* 🔄 Mapeamos el subconjunto de materias (materiasVisibles) */}
              {materiasVisibles.map((materia) => (
                <div 
                  key={materia.id_materia} 
                  style={ITEM_ROW_STYLE} 
                  className="fila-materia"
                  onClick={() => handleSeleccionarMateria(materia.id_materia)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{fontSize: '16px', fontWeight: 'bold', color: '#333'}}>
                          <span style={{color: '#00bcd4', marginRight: '10px'}}>&#x1F4DA;</span> 
                          {materia.nombre}
                      </span>
                      <span style={{fontSize: '13px', color: '#555', marginLeft: '30px'}}>
                          Código: {materia.codigoMateria ?? '—'} - Pendiente de generación.
                      </span>
                  </div>
                  
                  {/* BOTÓN "Generar Informe" */}
                  <button 
                    style={BUTTON_BASE_STYLE}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#0097a7';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#00bcd4';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    // Detenemos la propagación para que el click de la fila no navegue al hacer click en el botón
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleSeleccionarMateria(materia.id_materia);
                    }}
                  >
                    Generar Informe <Send size={16} />
                  </button>
                </div>
              ))}
              
              {/* 🆕 Botón "Ver Más" si quedan elementos por mostrar */}
              {materiasVisibles.length < materiasPendientes.length && (
                  <button
                      style={VIEW_MORE_BUTTON_STYLE}
                      onMouseOver={(e) => handleViewMoreHover(e, true)}
                      onMouseOut={(e) => handleViewMoreHover(e, false)}
                      onClick={handleVerMas}
                  >
                      Ver Más ({materiasPendientes.length - materiasVisibles.length} restantes) <ChevronDown size={20} />
                  </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* CSS para el efecto de hover en la fila y para el último elemento */}
      <style>{`
          .fila-materia:hover { background-color: #f7fbfd !important; cursor: pointer; }
          .fila-materia:nth-last-child(2) { border-bottom: none; } /* El penúltimo, si el último es el botón "Ver Más" */
          /* Si no hay botón, se aplica al último */
          ${materiasVisibles.length === materiasPendientes.length ? '.fila-materia:last-child { border-bottom: none; }' : ''}
      `}</style>
    </div>
  );
};

export default ListadoInformesACDoc;