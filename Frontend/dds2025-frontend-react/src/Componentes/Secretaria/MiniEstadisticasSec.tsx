import React, { useState, useEffect } from 'react';

// Si necesitas iconos, descomenta la siguiente línea
// import { CheckCircle, AlertCircle, PieChart } from 'lucide-react';

const MiniEstadisticasEst = ({ estudianteId }) => {
    const [stats, setStats] = useState({
        total: 0,
        respondidas: 0,
        pendientes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulación de llamada a API
        // En un caso real, aquí harías fetch(`api/encuestas/stats/${estudianteId}`)
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Simulamos un delay de red
                await new Promise(resolve => setTimeout(resolve, 800));

                // DATOS DE EJEMPLO (MOCK)
                // Reemplaza esto con la respuesta real de tu backend
                const dataSimulada = {
                    total: 8,
                    respondidas: 5,
                    pendientes: 3
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
    }, [estudianteId]);

    if (loading) {
        return (
            <div className="mini-stats-est-container">
                <div className="mini-stats-grid">
                    {/* Skeletons de carga simples */}
                    <div className="mini-stat-box" style={{ background: '#f0f0f0', color: '#ccc' }}>Cargando...</div>
                    <div className="mini-stat-box" style={{ background: '#f0f0f0', color: '#ccc' }}>Cargando...</div>
                    <div className="mini-stat-box" style={{ background: '#f0f0f0', color: '#ccc' }}>Cargando...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div style={{ color: 'red', fontSize: '0.8rem' }}>Error: {error}</div>;
    }

    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                
                {/* 1. Total de Encuestas */}
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">{stats.total}</span>
                    <span className="mini-stat-label">Total Encuestas</span>
                </div>

                {/* 2. Respondidas */}
                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">{stats.respondidas}</span>
                    <span className="mini-stat-label">Respondidas</span>
                </div>

                {/* 3. Pendientes */}
                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">{stats.pendientes}</span>
                    <span className="mini-stat-label">Pendientes</span>
                </div>

            </div>
        </div>
    );
};

export default MiniEstadisticasEst;