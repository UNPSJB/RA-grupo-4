import React, { useEffect, useState } from "react";

interface Estadisticas {
    docentes: number;
    alumnos: number;
    informes_sinteticos_pendientes: number;
}

interface Props {
    departamentoId: number;
}

const API_BASE = "http://localhost:8000";

const MiniEstadisticasDep: React.FC<Props> = ({ departamentoId }) => {
    const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEstadisticas = async () => {
            try {
                const res = await fetch(`${API_BASE}/departamentos/${departamentoId}/estadisticas`);
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setEstadisticas(data);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };
        fetchEstadisticas();
    }, [departamentoId]);

    if (loading) return <p>Cargando estadísticas...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!estadisticas) return <p>No hay datos.</p>;

    return (
        <div className="mini-stats-est-container">
            <div className="mini-stats-grid">
                <div className="mini-stat-box stat-total">
                    <span className="mini-stat-number">{estadisticas.docentes}</span>
                    <span className="mini-stat-label">Docentes</span>
                </div>

                <div className="mini-stat-box stat-done">
                    <span className="mini-stat-number">{estadisticas.alumnos}</span>
                    <span className="mini-stat-label">Alumnos </span>
                </div>

                <div className="mini-stat-box stat-pending">
                    <span className="mini-stat-number">{estadisticas.informes_sinteticos_pendientes}</span>
                    <span className="mini-stat-label">Sintéticos Pendientes</span>
                </div>
            </div>
        </div>
    );
};

export default MiniEstadisticasDep;
