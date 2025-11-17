import React, { useEffect, useState } from "react";
import { BarChart2 } from "lucide-react";
import SinDatos from "../Otros/SinDatos"; 
import ErrorCargaDatos from "../Otros/ErrorCargaDatos"; 

// --- INTERFACES ---
interface Estadisticas {
  total: number;
  respondidas: number;
  pendientes: number;
}


// --- ESTILOS EN LÍNEA BASE (Para evitar un archivo CSS separado) ---
const styles = {
    container: {
        padding: '15px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
    } as React.CSSProperties, 
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginTop: '15px',
    } as React.CSSProperties,
    statBox: {
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderLeft: '5px solid',
    } as React.CSSProperties,
    statNumber: {
        fontSize: '1.8em',
        fontWeight: 700,
        marginBottom: '2px',
    } as React.CSSProperties,
    statLabel: {
        fontSize: '0.8em',
        color: '#555',
        fontWeight: 500,
    } as React.CSSProperties,
    // Estilos de la barra de progreso (la de color)
    progressBarContainer: {
        display: 'flex',
        width: '100%',
        height: '35px', /* Altura de la barra */
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    barSegment: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9em',
        transition: 'width 0.5s ease-out',
        padding: '0 5px',
    } as React.CSSProperties,
};

// --- COLORES ---
const COLOR_TOTAL = '#4169e1';    // Azul
const COLOR_RESPONDIDAS = '#9acd32'; // Amarillo Verdoso
const COLOR_PENDIENTES = '#dc143c'; // Rojo Carmesí
const BG_TOTAL = '#e6e6fa';
const BG_RESPONDIDAS = '#f0fff0';
const BG_PENDIENTES = '#ffe4e1';


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
      <div style={styles.container as React.CSSProperties}>
        <p style={{ textAlign: 'center' }}>Cargando estadísticas...</p>
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
//porcentaJES
  const total = stats.total;
  
  const porcentajeRespondidas = total > 0 ? (stats.respondidas / total) * 100 : 0;
  const porcentajePendientes = total > 0 ? (stats.pendientes / total) * 100 : 0;
  const anchoBarraFija = 33.33; 
  // ------------------------------------------

  return (
    <div style={styles.container as React.CSSProperties} className={animar ? 'animated' : ''}>
      
      {/* 1. La Barra de Progreso a Color (siguiendo la imagen) */}
      <div style={styles.progressBarContainer}>
        
        {/* Total (Azul) */}
        <div 
          style={{ 
            ...styles.barSegment, 
            width: `${anchoBarraFija}%`, 
            backgroundColor: COLOR_TOTAL,
            borderRight: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          Total
        </div>

        {/* Respondidas (Verde) */}
        <div 
          style={{ 
            ...styles.barSegment, 
            width: `${anchoBarraFija}%`, 
            backgroundColor: COLOR_RESPONDIDAS,
            borderRight: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          Respondidas
        </div>

        {/* Pendientes (Rojo) */}
        <div 
          style={{ 
            ...styles.barSegment, 
            width: `${anchoBarraFija}%`, 
            backgroundColor: COLOR_PENDIENTES 
          }}
        >
          Pendientes
        </div>
      </div>
      
      {/* 2. La Malla con los Números y el Porcentaje */}
      <div style={styles.grid}>
        
        {/* Total Asignadas */}
        <div 
            style={{ 
                ...styles.statBox, 
                backgroundColor: BG_TOTAL, 
                borderLeftColor: COLOR_TOTAL 
            }}
        >
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total</div>
        </div>

        {/* Respondidas */}
        <div 
            style={{ 
                ...styles.statBox, 
                backgroundColor: BG_RESPONDIDAS, 
                borderLeftColor: COLOR_RESPONDIDAS 
            }}
        >
          <div style={styles.statNumber}>{stats.respondidas}</div>
          <div style={styles.statLabel}>Respondidas ({porcentajeRespondidas.toFixed(1)}%)</div>
        </div>

        {/* Pendientes */}
        <div 
            style={{ 
                ...styles.statBox, 
                backgroundColor: BG_PENDIENTES, 
                borderLeftColor: COLOR_PENDIENTES 
            }}
        >
          <div style={styles.statNumber}>{stats.pendientes}</div>
          <div style={styles.statLabel}>Pendientes ({porcentajePendientes.toFixed(1)}%)</div>
        </div>
      </div>
    </div>
  );
};

export default MiniEstadisticasEst;