import React, { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import SinDatos from "../Otros/SinDatos"; 
import ErrorCargaDatos from "../Otros/ErrorCargaDatos"; 

interface Estadisticas {
  total: number;
  respondidas: number;
  pendientes: number;
}

const MiniEstadisticasEst: React.FC<{ estudianteId: number }> = ({ estudianteId }) => {
  const [stats, setStats] = useState<Estadisticas>({ total: 0, respondidas: 0, pendientes: 0 });
  const [animar, setAnimar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = `http://localhost:8000/estudiantes/${estudianteId}/encuestas/resumen`;
        const res = await fetch(url);
        
        if (!res.ok) {
          const errorDetail = await res.json().catch(() => ({ detail: 'Error desconocido' }));

          throw new Error(errorDetail.detail || 'Fallo en la carga de datos');
        }
        
        const data: Estadisticas = await res.json();
        
        setStats(data);
        setAnimar(true);
        
      } catch (err: any) {
        console.error("Error al cargar estadísticas:", err.message);
        setError(err.message || "No se pudieron cargar las estadísticas.");
        setStats({ total: 0, respondidas: 0, pendientes: 0 }); 
      } finally {
        setLoading(false);
      }
    };
    
    if (estudianteId > 0) {
        fetchStats();
    }
    
  }, [estudianteId]);


  if (loading) {
    return (
      <div className="mini-stats-est-container loading-state">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }
  
  if (error) {
    return <ErrorCargaDatos mensaje={error} />;
  }
  

  if (stats.total === 0) {
    return (
      <SinDatos 
        mensaje="No hay encuestas asignadas a tu cuenta en este momento."
        titulo="Estadísticas de Encuestas"
      />
    );
  }

  return (
    <div className={`mini-stats-est-container ${animar ? 'animated' : ''}`}>
      <div className="mini-stats-grid">
        
        {/* Total Asignadas */}
        <div className="mini-stat-box stat-total">
          <div className="mini-stat-number">{stats.total}</div>
          <div className="mini-stat-label">Total</div>
        </div>

        {/* Respondidas */}
        <div className="mini-stat-box stat-done">
          <div className="mini-stat-number">{stats.respondidas}</div>
          <div className="mini-stat-label">Respondidas</div>
        </div>

        {/* Pendientes */}
        <div className="mini-stat-box stat-pending">
          <div className="mini-stat-number">{stats.pendientes}</div>
          <div className="mini-stat-label">Pendientes</div>
        </div>
      </div>
    </div>
  );
};

export default MiniEstadisticasEst;