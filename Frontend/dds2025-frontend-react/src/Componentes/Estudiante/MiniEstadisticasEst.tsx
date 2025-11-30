import React, { useEffect, useState } from "react";
import SinDatos from "../Otros/SinDatos"; 
import ErrorCargaDatos from "../Otros/ErrorCargaDatos"; 
import { List } from 'lucide-react'; // Importamos el icono para el título

// --- INTERFACES ---
interface Estadisticas {
  total: number;
  respondidas: number;
  pendientes: number;
}

const MiniEstadisticasEst: React.FC<{ estudianteId: number }> = ({ estudianteId }) => {
  const [stats, setStats] = useState<Estadisticas>({ total: 0, respondidas: 0, pendientes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:8000/estudiantes/${estudianteId}/encuestas/resumen`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Fallo en la carga de datos');
        const data: Estadisticas = await res.json();
        setStats(data);
      } catch (err: any) {
        console.error(err);
        setError("No se pudieron cargar las estadísticas.");
        setStats({ total: 0, respondidas: 0, pendientes: 0 }); 
      } finally {
        setLoading(false);
      }
    };
    
    if (estudianteId > 0) fetchStats();
  }, [estudianteId]);

  if (loading) return <p style={{textAlign: 'center', color: '#666'}}>Cargando...</p>;
  if (error) return <ErrorCargaDatos mensaje={error} />;
  
  // Si no hay datos, mostramos el componente de SinDatos
  if (stats.total === 0) return <SinDatos mensaje="No hay datos." />;

  // --- CÁLCULO DE PORCENTAJES ---
  const pctRespondidas = stats.total > 0 ? ((stats.respondidas / stats.total) * 100).toFixed(1) : "0.0";
  const pctPendientes = stats.total > 0 ? ((stats.pendientes / stats.total) * 100).toFixed(1) : "0.0";

  return (
    <div className="mini-stats-est-container">
        
        {/* TÍTULO AGREGADO */}
        <h2 className="stats-title" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '1.1rem', 
            color: '#333', 
            marginBottom: '15px',
            marginTop: 0
        }}>
            <List size={20} />
            Resumen General
        </h2>

        <div className="mini-stats-grid">
            
            {/* Total (Azul Oscuro) */}
            <div className="mini-stat-box stat-total">
                <span className="mini-stat-number">{stats.total}</span>
                <span className="mini-stat-label">Inscripciones Totales</span>
            </div>
            
            {/* Respondidas (Celeste / Completados) */}
            <div className="mini-stat-box stat-done">
                <span className="mini-stat-number">{stats.respondidas}</span>
                <span className="mini-stat-label">
                    Encuestas Respondidas ({pctRespondidas}%)
                </span>
            </div>
            
            {/* Pendientes (Naranja / Pendientes) */}
            <div className="mini-stat-box stat-pending">
                <span className="mini-stat-number">{stats.pendientes}</span>
                <span className="mini-stat-label">
                    Encuestas Pendientes ({pctPendientes}%)
                </span>
            </div>

        </div>
    </div>
  );
};

export default MiniEstadisticasEst;