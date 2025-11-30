import React, { useState, useEffect, memo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type MateriaEstadisticasData = { 
    materia_id: number; 
    nombre_materia: string; 
    total_inscriptos: number; 
    total_encuestas_procesadas: number; 
};

const EstadisticasAlumno: React.FC<{ materiaId?: number }> = ({ materiaId }) => {
    const [data, setData] = useState<MateriaEstadisticasData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!materiaId) return;
        setLoading(true);
        fetch(`http://localhost:8000/encuestas/estadisticas/materia/${materiaId}/publica`)
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [materiaId]);

    if (loading) return <div style={{color: '#666', fontSize:'0.8rem', textAlign:'center'}}>Cargando...</div>;
    if (!data) return <div style={{color: '#666', fontSize:'0.8rem'}}>Sin datos.</div>;

    const respondieron = data.total_encuestas_procesadas;
    const noRespondieron = Math.max(0, data.total_inscriptos - respondieron);
    const chartData = [{ name: 'Si', value: respondieron }, { name: 'No', value: noRespondieron }];
    const COLORS = ['#3856d8ff', '#e9ecef'];

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#555', marginTop: 5 }}>
                <strong>{respondieron}</strong> de <strong>{data.total_inscriptos}</strong> respondieron.
            </p>
        </div>
    );
};
export default EstadisticasAlumno;