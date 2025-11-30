import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react'; // Importamos el ícono de lista

const MiniEstadisticasEst = () => {
    const [stats, setStats] = useState({
        total: 0,
        respondidas: 0,
        pendientes: 0,
        totalDepartamentos: 0,
        isRecibidos: 0,
        isPendientes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Simulamos un delay de red
                await new Promise(resolve => setTimeout(resolve, 500)); 

                // DATOS DE EJEMPLO (MOCK): 5 en todos los campos
                const dataSimulada = {
                    total: 5, 
                    respondidas: 5, 
                    pendientes: 5, 
                    totalDepartamentos: 5, // Izquierda: Total Departamentos (BASE/DENOMINADOR)
                    isRecibidos: 0,         // Centro: I.S. Recibidos
                    isPendientes: 5         // Derecha: I.S. Pendientes
                };

                setStats(dataSimulada);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar estadísticas:", err);
                setError("No se pudieron cargar los datos.");
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // LÓGICA DE CÁLCULO DE PORCENTAJES
    const totalBase = stats.totalDepartamentos > 0 ? stats.totalDepartamentos : 1; 
    const porcentajeRecibidos = ((stats.isRecibidos / totalBase) * 100).toFixed(0);
    const porcentajePendientes = ((stats.isPendientes / totalBase) * 100).toFixed(0);

    // --- RENDERIZADO CONDICIONAL ---

    if (loading) {
        return (
            <div className="mini-stats-est-container" style={{ padding: '20px', borderRadius: '12px', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', color: '#003366' }}>Cargando Resumen...</div>
            </div>
        );
    }

    if (error) {
        return <div style={{ color: 'red', fontSize: '0.8rem', padding: '15px' }}>Error: {error}</div>;
    }

    return (
        <div style={{ 
            background: '#ffffff', // Fondo blanco del card
            borderRadius: '12px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
            padding: '20px', 
            fontFamily: 'Roboto, sans-serif'
        }}>
            
            {/* --- TÍTULO AGREGADO: Resumen General --- */}
            <h3 style={{ 
                fontSize: '18px', 
                color: '#003366', 
                marginBottom: '20px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <List size={20} color="#0056b3" /> Resumen General
            </h3>
            {/* --- FIN TÍTULO --- */}

            {/* ESTILOS PARA LA FORMA Y COLORES UNIFICADOS */}
            <style>{`
                .mini-stats-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 10px;
                    width: 100%;
                }
                .mini-stat-box {
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 85px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                /* Colores solicitados */
                .mini-stat-box.stat-total { 
                    background-color: #003366; /* Azul Oscuro */
                    color: white; 
                }
                .mini-stat-box.stat-done { 
                    background-color: #e0f7ff; /* Azul Claro */
                    color: #003366; 
                }
                .mini-stat-box.stat-pending { 
                    background-color: #ffe0b2; /* Naranja Claro */
                    color: #e65100; /* Texto naranja oscuro */
                }

                .mini-stat-number { 
                    font-size: 2rem; 
                    font-weight: 700; 
                    line-height: 1.1;
                }
                .mini-stat-label { 
                    font-size: 0.75rem; 
                    font-weight: 500; 
                    text-transform: uppercase;
                }
                .mini-stat-percentage {
                    font-size: 0.65rem; 
                    font-weight: 400; 
                    opacity: 0.8;
                }
            `}</style>
            <div className="mini-stats-grid">
                
                {/* 1. Izquierda: Total Departamentos (BASE) */}
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">{stats.totalDepartamentos}</span>
                    <span className="mini-stat-label">Total Departamentos</span>
                </div>

                {/* 2. Centro: I.S Recibidos (CON PORCENTAJE) */}
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">{stats.isRecibidos}</span>
                    <span className="mini-stat-label">I.S Recibidos</span>
                    <span className="mini-stat-percentage">({porcentajeRecibidos}%)</span>
                </div>

                {/* 3. Derecha: I.S Pendientes (CON PORCENTAJE) */}
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">{stats.isPendientes}</span>
                    <span className="mini-stat-label">I.S Pendientes</span>
                    <span className="mini-stat-percentage">({porcentajePendientes}%)</span>
                </div>

            </div>
        </div>
    );
};

export default MiniEstadisticasSec;