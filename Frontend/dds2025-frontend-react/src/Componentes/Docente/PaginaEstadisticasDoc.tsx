import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, BookOpen, ArrowRight, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks';

const API_BASE = "http://localhost:8000";

interface Periodo {
    id: number;
}
interface Materia {
    id_materia: number;
    nombre: string;
    codigoMateria?: string;
    id_docente: number;
    id_periodo: number;
    inscriptos?: number; 
    procesadas?: number;
}

interface StatsSimulados {
    inscriptos: number;
    procesadas: number;
}

const PaginaEstadisticasDoc: React.FC = () => {

    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [periodoActual, setPeriodoActual] = useState<Periodo | null>(null);
    
    const { currentUser } = useAuth();
    const docenteId = currentUser?.docente_id;


    useEffect(() => {
        const cargarMaterias = async () => {
            try {
                setLoading(true);

                const resPeriodo = await fetch(`${API_BASE}/periodos/actual/informesAC`);
                if (!resPeriodo.ok) throw new Error("No se pudo obtener el periodo actual.");
                
                const dataPeriodo = await resPeriodo.json();
                setPeriodoActual(dataPeriodo);

                const res = await fetch(`${API_BASE}/materias/listarInscriptos`);
                if (!res.ok) throw new Error("Error al cargar las materias.");
                
                const data: Materia[] = await res.json();
                
                // Filtramos las materias del docente actual y periodo actual
                const misMaterias = data.filter(m => 
                    m.id_docente === docenteId && 
                    m.id_periodo === dataPeriodo.id
                );

                setMaterias(misMaterias);
            } catch (err: any) {
                setError(err.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        cargarMaterias();
    }, []);

    // Función auxiliar para simular datos si el backend no los trae aún en el endpoint de listar
    const getDatosSimulados = (materia: Materia): StatsSimulados => ({
        inscriptos: materia.inscriptos || Math.floor(Math.random() * 50) + 20,
        procesadas: materia.procesadas || Math.floor(Math.random() * 20) + 10,
    });

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Cargando listado de materias...
        </div>
    );

    return (
        <div className="dashboard-main-view" style={{ animation: 'fadeIn 0.5s ease' }}>
            
            {/* Encabezado Principal */}
            <div className="dashboard-header-container" style={{ marginBottom: '30px' }}>
                <div className="bienvenida-box" style={{ width: '100%' }}>
                    <h1 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <TrendingUp size={36} color="#003366" />
                        Estadísticas de Cátedra
                    </h1>
                    <p className="panel-subtitle">
                        Selecciona una materia para visualizar el análisis detallado de las encuestas estudiantiles.
                    </p>
                </div>
            </div>

            {/* Contenedor de Listado */}
            <div className="seccion-box">
                <h2 className="seccion-title">
                    <BookOpen size={24} />
                    Materias Disponibles
                </h2>

                {error && (
                    <div style={{ padding: '20px', color: '#dc3545', backgroundColor: '#fde8e8', borderRadius: '8px' }}>
                        {error}
                    </div>
                )}

                {!loading && !error && materias.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                        No tienes materias asignadas para este periodo.
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {materias.map((materia) => {
                        const stats = getDatosSimulados(materia);
                        const porcentaje = stats.inscriptos > 0 
                            ? Math.round((stats.procesadas / stats.inscriptos) * 100) 
                            : 0;

                        return (
                            <div 
                                key={materia.id_materia} 
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div>
                                    <h3 style={{ 
                                        color: '#111827', 
                                        fontSize: '18px', 
                                        fontWeight: '700', 
                                        marginBottom: '4px' 
                                    }}>
                                        {materia.nombre}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                                        Código: {materia.codigoMateria || 'N/A'}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
                                            <Users size={18} />
                                            <span style={{ fontSize: '14px' }}>Inscriptos: <strong>{stats.inscriptos}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
                                            <CheckCircle size={18} />
                                            <span style={{ fontSize: '14px' }}>Procesadas: <strong>{stats.procesadas}</strong></span>
                                        </div>
                                    </div>
                                    
                                    {/* Barra de progreso visual */}
                                    <div style={{ width: '100%', backgroundColor: '#f3f4f6', borderRadius: '9999px', height: '8px', marginBottom: '8px' }}>
                                        <div style={{ 
                                            width: `${porcentaje}%`, 
                                            backgroundColor: '#3b82f6', 
                                            height: '100%', 
                                            borderRadius: '9999px' 
                                        }}></div>
                                    </div>
                                    <p style={{ textAlign: 'right', fontSize: '12px', color: '#6b7280', marginBottom: '24px' }}>
                                        {porcentaje}% de participación
                                    </p>
                                </div>

                                {/* Botón que navega a la ruta dinámica */}
                                <Link 
                                    to={`materia/${materia.id_materia}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: '#003366', 
                                        color: 'white',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#002244'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#003366'}
                                >
                                    <BarChart2 size={18} />
                                    Ver Estadísticas
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PaginaEstadisticasDoc;