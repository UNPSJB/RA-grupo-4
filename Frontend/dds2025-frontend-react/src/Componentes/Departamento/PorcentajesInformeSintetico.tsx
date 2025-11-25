import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import SinDatos from "../Otros/SinDatos";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";

// Ajuste de API_BASE para consistencia con los otros archivos
const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:8000";

interface ResumenSeccion {
  id: number;
  sigla: string;
  nombre: string;
  porcentajes_opciones: Record<string, number>;
}

interface InformeAC {
  id_informeAC: number;
  codigoMateria: string;
  nombreMateria: string;
  porcentaje_contenido_abordado: number;
  porcentaje_teoricas: number;
  porcentaje_practicas: number;
  justificacion_porcentaje: string;
  resumenSecciones: ResumenSeccion[];
  opinionSobreResumen: string;
}

interface Props {
  departamentoId: number | null;
  periodoId: number | null;
}

// Paleta de colores para el gráfico
const colores = [
  "#1ABC9C", // Turquesa
  "#8E44AD", // Morado 
  "#E67E22", // Naranja
  "#E74C3C", // Rojo
  "#3498DB", // Azul
  "#2C3E50", // Gris oscuro
  "#F1C40F", // Amarillo
  "#27AE60", // Esmeralda
];

const SECCIONES_PERMITIDAS = ["B", "C", "D", "E-Teoria", "E-Practica"];

// Componente para mostrar las estadísticas clave
const StatBox: React.FC<{ title: string; value: number; description: string; color: string }> = ({
    title,
    value,
    description,
    color
}) => (
    <div className="stat-box" style={{ borderLeftColor: color }}>
        <p className="stat-title">{title}</p>
        <span className="stat-value" style={{ color: color }}>
            {value}%
        </span>
        <p className="stat-desc">{description}</p>
    </div>
);

// Componente para el diccionario de secciones
const SectionDictionary: React.FC<{ dictionary: Record<string, string>, isOpen: boolean, toggle: () => void }> = ({ dictionary, isOpen, toggle }) => (
    <div className="dictionary-container">
        <div className="dictionary-header" onClick={toggle}>
            <span style={{ transition: 'transform 0.3s' }} className={isOpen ? 'dict-chevron rotated' : 'dict-chevron'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#003366' }}>
                Diccionario de Secciones (Siglas)
            </h4>
        </div>
        {isOpen && (
            <ul className="dictionary-list">
                {Object.entries(dictionary).map(([sigla, nombre]) => (
                    <li key={sigla}>
                        <span className="dict-sigla">{sigla}:</span> 
                        <span className="dict-name">{nombre}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

// ÍCONO CHEVRON MODERNO
const ChevronIcon: React.FC<{ isRotated: boolean }> = ({ isRotated }) => (
    <svg 
        className={`chevron-icon ${isRotated ? "rotated" : ""}`} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);


const PorcentajesInformeSintetico: React.FC<Props> = ({ departamentoId, periodoId }) => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materiaExpandida, setMateriaExpandida] = useState<number | null>(null);
  const [isDictOpen, setIsDictOpen] = useState(false);

  const fetchInformes = useCallback(async () => {
    if (!departamentoId || !periodoId) {
        setInformes([]);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulación de espera mínima para UX
      await new Promise(resolve => setTimeout(resolve, 300)); 
      
      const response = await fetch(
        `${API_BASE}/informes-sinteticos/departamento/${departamentoId}/periodo/${periodoId}/informesAC/porcentajes`
      );
      
      if (!response.ok) throw new Error("Error al cargar los informes sintéticos");
      
      const data = await response.json();
      setInformes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setError(error.message || "Error desconocido");
      console.error("Error al cargar informes:", error);
    } finally {
      setLoading(false);
    }
  }, [departamentoId, periodoId]);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  const toggleMateria = (id: number) =>
    setMateriaExpandida((prev) => (prev === id ? null : id));
  
  const getChartData = (resumenSecciones: ResumenSeccion[]) => {
    const seccionesFiltradas = resumenSecciones.filter((s) =>
      SECCIONES_PERMITIDAS.includes(s.sigla)
    );

    const allOptions = new Set<string>();
    const sectionDictionary: Record<string, string> = {};

    seccionesFiltradas.forEach((sec) => {
      sectionDictionary[sec.sigla] = sec.nombre;
      Object.keys(sec.porcentajes_opciones).forEach((opcion) =>
        allOptions.add(opcion)
      );
    });
    
    const optionOrder = Array.from(allOptions).sort(); 

    const chartData = seccionesFiltradas.map((sec) => {
      const dataItem: any = {
        seccion: sec.sigla, 
      };
      
      Object.entries(sec.porcentajes_opciones).forEach(([opcion, valor]) => {
        dataItem[opcion] = valor;
      });
      
      dataItem._sortValue = dataItem[optionOrder[0]] || 0; 
      return dataItem;
    });

    chartData.sort((a, b) => b._sortValue - a._sortValue);

    return { chartData, optionOrder, sectionDictionary }; 
  };

  return (
    <div className="uni-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366; 
          --uni-secondary: #007bff; 
          --uni-bg: #f9f9f9;
          --uni-card-bg: #fff;
          --uni-border: #dee2e6;
          --uni-shadow: rgba(0,0,0,0.05);
          --uni-shadow-hover: rgba(0,51,102,0.15);
          
          /* COLORES PARA LAS ESTADÍSTICAS */
          --color-content: #8BC34A; /* Verde Lima */
          --color-teoricas: #FF9800; /* Naranja Ámbar */
          --color-practicas: #00BCD4; /* Turquesa */
          
          /* NUEVOS COLORES PARA EL HEADER */
          --header-start: #003366; 
          --header-end: #004588; 
          --header-hover-start: #004588;
          --header-hover-end: #005aae;
        }

        .uni-wrapper {
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
          padding: 20px 0;
          color: #333; 
          animation: fadeIn 0.5s ease-out;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Contenedor para estados vacíos y errores */
        .uni-content-container {
            padding: 20px 30px;
            background-color: #ffffff;
            border-radius: 12px;
        }

        .uni-title {
          font-size: 1.8rem;
          color: var(--uni-primary);
          font-weight: 800;
          border-bottom: 3px solid var(--uni-primary);
          padding-bottom: 12px;
          margin-bottom: 25px;
        }

        /* --- TARJETA DE MATERIA --- */
        .materia-card {
          background: var(--uni-card-bg);
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--uni-shadow);
          border: 1px solid var(--uni-border);
          transition: all 0.3s ease;
        }

        .materia-card.expanded {
          border-color: var(--uni-secondary);
          box-shadow: 0 8px 20px var(--uni-shadow-hover);
        }

        /* --- HEADER MEJORADO --- */
        .materia-header {
          padding: 18px 25px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, var(--header-start) 0%, var(--header-end) 100%); 
          color: white;
          transition: all 0.3s ease;
          box-shadow: inset 0 -3px 0 rgba(0,0,0,0.1); 
        }

        .materia-header:hover {
          background: linear-gradient(135deg, var(--header-hover-start) 0%, var(--header-hover-end) 100%); 
        }

        .materia-title {
          font-size: 1.35rem; 
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 15px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2); 
        }

        .materia-code-badge {
          background: white; 
          color: var(--uni-primary);
          padding: 5px 12px;
          border-radius: 20px; 
          font-size: 0.9rem;
          font-weight: 800; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.2); 
        }

        .chevron-icon {
            transition: transform 0.3s ease;
            color: white;
            flex-shrink: 0; 
        }

        .chevron-icon.rotated {
            transform: rotate(180deg);
        }

        /* --- CUERPO --- */
        .materia-body {
          padding: 25px;
          background: var(--uni-bg);
          border-top: 1px solid var(--uni-border);
          animation: slideDown 0.4s ease-out forwards;
        }
        
        .percentages-grid-4 {
          display: grid;
          grid-template-columns: repeat(3, 1fr); 
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .text-info-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-box {
            background-color: var(--uni-card-bg);
            border: 1px solid var(--uni-border);
            border-left: 5px solid; 
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            min-height: 120px;
        }

        .stat-title {
            font-weight: 600;
            font-size: 0.85rem;
            color: #6c757d;
            text-transform: uppercase;
        }
        
        .stat-value {
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1.2;
        }

        .stat-desc {
            font-size: 0.75rem;
            color: #6c757d;
            margin-top: 5px;
        }
        
        .text-block {
            background-color: var(--uni-card-bg);
            border: 1px solid var(--uni-border);
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            min-height: 120px;
            display: flex;
            flex-direction: column;
            text-align: center; 
        }

        .text-block-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--uni-primary);
          margin-bottom: 8px;
          text-align: center; 
        }

        .text-area-display {
          width: 95%;
          flex-grow: 1;
          resize: none;
          border-radius: 4px;
          border: 1px solid #c2d4ea;
          padding: 8px;
          font-family: inherit;
          font-size: 0.85rem;
          color: #343a40;
          background-color: #f8fbfc; 
          line-height: 1.5;
          overflow-wrap: break-word; 
          word-break: break-all;
        }
        
        .chart-block {
          background-color: var(--uni-card-bg);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin-bottom: 30px; 
        }

        .chart-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--uni-primary);
          margin-bottom: 4px;
        }

        .chart-context {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 15px;
        }
        
        .dictionary-container {
            padding: 10px 15px;
            border: 1px solid var(--uni-border);
            border-radius: 8px;
            background-color: #e9f0f8; 
            transition: all 0.3s ease;
        }

        .dictionary-header {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 5px 0;
        }
        
        .dict-chevron {
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            color: #003366; 
        }
        
        .dict-chevron.rotated {
            transform: rotate(180deg);
        }

        .dictionary-list {
            list-style: none;
            padding: 10px 0 0 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px 20px; 
            border-top: 1px solid #c2d4ea;
            margin-top: 10px;
            font-size: 0.9rem;
        }

        .dictionary-list li {
            padding: 0;
            margin: 0;
            display: inline-flex;
            gap: 5px;
        }

        .dict-sigla {
            font-weight: 700;
            color: var(--uni-primary);
        }

        /* SKELETON LOADER */
        .skeleton-header {
          height: 60px;
          background: #e9ecef;
          border-radius: 12px;
          margin-bottom: 15px;
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse { 
          0% { background-color: #e9ecef; } 
          50% { background-color: #f8f9fa; } 
          100% { background-color: #e9ecef; } 
        }

        @media (max-width: 768px) {
            .percentages-grid-4, .text-info-grid-2 {
                grid-template-columns: 1fr;
            }
            .materia-title {
                font-size: 1.15rem; 
            }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Título siempre visible (salvo que sea sin selección o error fatal) */}
      {(departamentoId && !error) && (
        <h2 className="uni-title">
          Porcentajes de los Informes de Actividad Curricular
        </h2>
      )}

      {(() => {
        // 1. Caso: No se ha seleccionado departamento
        if (!departamentoId) {
            return (
                <div className="uni-content-container">
                    <SinDatos mensaje="Seleccione un departamento para ver los porcentajes de los informes." />
                </div>
            );
        }

        // 2. Caso: Error
        if (error) {
            return (
                <div className="uni-content-container">
                    <ErrorCargaDatos error={error} />
                </div>
            );
        }

        // 3. Caso: Cargando (Skeletons)
        if (loading) {
            return (
                <div>
                   {[1, 2, 3].map(i => (
                       <div key={i} className="skeleton-header"></div>
                   ))}
                </div>
            );
        }

        // 4. Caso: Vacio
        if (!informes || informes.length === 0) {
            return (
                <div className="uni-content-container">
                    <SinDatos mensaje="Todavía no se cargaron Informes de Actividad Curricular asociados al departamento en este período." />
                </div>
            );
        }

        // 5. Caso: Datos OK
        return informes.map((info) => {
            const isExpanded = materiaExpandida === info.id_informeAC;
            const { chartData, optionOrder, sectionDictionary } = getChartData(info.resumenSecciones);

            return (
            <div
                key={info.id_informeAC}
                className={`materia-card ${isExpanded ? "expanded" : ""}`}
            >
                <div
                className="materia-header"
                onClick={() => toggleMateria(info.id_informeAC)}
                >
                <div className="materia-title">
                    <span className="materia-code-badge">{info.codigoMateria}</span>
                    {info.nombreMateria}
                </div>
                
                <ChevronIcon isRotated={isExpanded} />
                </div>

                {isExpanded && (
                <div className="materia-body">
                    
                    {/* PORCENTAJES CLAVE */}
                    <div className="percentages-grid-4">
                    <StatBox 
                        title="Contenido Abordado"
                        value={info.porcentaje_contenido_abordado}
                        description={`Se cubrió el ${info.porcentaje_contenido_abordado}% de los contenidos del plan.`}
                        color="var(--color-content)"
                    />
                    <StatBox 
                        title="Clases Teóricas"
                        value={info.porcentaje_teoricas}
                        description={`Se dictó el ${info.porcentaje_teoricas}% de las clases programadas.`}
                        color="var(--color-teoricas)"
                    />
                    <StatBox 
                        title="Clases Prácticas"
                        value={info.porcentaje_practicas}
                        description={`Se realizaron el ${info.porcentaje_practicas}% de las actividades previstas.`}
                        color="var(--color-practicas)"
                    />
                    </div>
                    
                    {/* TEXTOS */}
                    <div className="text-info-grid-2">
                    <div className="text-block">
                        <label className="text-block-title">Justificación de Clases Dictadas:</label>
                        <textarea
                        value={info.justificacion_porcentaje || "No se registró una justificación."}
                        readOnly
                        className="text-area-display"
                        />
                    </div>
                    <div className="text-block">
                        <label className="text-block-title">Opinión del Resumen General:</label>
                        <textarea
                        value={info.opinionSobreResumen || "No se registró una opinión."}
                        readOnly
                        className="text-area-display"
                        />
                    </div>
                    </div>

                    {/* GRÁFICO */}
                    <div className="chart-block">
                    <h3 className="chart-title">Distribución de Opciones por Sección</h3>
                    <p className="chart-context">
                        Porcentaje de respuestas agrupadas por Sección. Eje X muestra siglas.
                    </p>

                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap="20%" 
                        barGap={2}
                        >
                        <CartesianGrid strokeDasharray="3 3" /> 
                        <XAxis
                            dataKey="seccion" 
                            type="category"
                            tick={{ fontSize: 13, fill: '#333' }}
                            height={40} 
                            stroke="#666" 
                        />
                        <YAxis
                            type="number" 
                            domain={[0, 100]} 
                            tickFormatter={(value) => `${value}%`} 
                            stroke="#666" 
                            width={60} 
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                            labelFormatter={(label) => `Sección (Sigla): ${label}`}
                            contentStyle={{ 
                                borderRadius: '6px', 
                                border: '1px solid #ccc', 
                                backgroundColor: 'rgba(255,255,255,0.9)' 
                            }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                        {optionOrder.map((opcion, i) => (
                            <Bar
                            key={opcion}
                            dataKey={opcion}
                            fill={colores[i % colores.length]}
                            name={opcion}
                            barSize={18} 
                            radius={[8, 8, 0, 0]}
                            />
                        ))}
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                    
                    <SectionDictionary
                        dictionary={sectionDictionary}
                        isOpen={isDictOpen}
                        toggle={() => setIsDictOpen(prev => !prev)}
                    />
                </div>
                )}
            </div>
            );
        });
      })()}
    </div>
  );
};

export default PorcentajesInformeSintetico;