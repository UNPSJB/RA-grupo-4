import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

interface MateriaResumen {
    id: number;
    nombre: string;
    ciclo_lectivo: number;
    cuatrimestre: string;
    cant_inscriptos: number;
}

const SeleccionarMateriaEstadisticasDep = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState<MateriaResumen[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/encuestas/listado-materias-general') 
            .then(res => {
                if (!res.ok) throw new Error("No se pudo conectar con el servidor.");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setMaterias(data);
                } else {
                    setMaterias([]);
                    console.error("Formato de datos incorrecto:", data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setMaterias([]); 
                setLoading(false);
            });
    }, []);

    const irAlDetalle = (materiaId: number) => {
        navigate(`materia/${materiaId}`);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '12px' }}>
                    <BarChart3 size={32} color="#0056b3" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.8rem', color: '#1f2937', margin: 0 }}>Estadísticas Globales</h1>
                    <p style={{ fontSize: '1rem', color: '#6b7280', margin: '5px 0 0 0' }}>
                        Seleccione una materia para analizar sus métricas detalladas.
                    </p>
                </div>
            </div>

            {loading && <p>Cargando listado...</p>}
            
            {error && (
                <div style={{ padding: 20, backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <AlertCircle />
                    <p><strong>Error:</strong> {error}. Revisa que el Backend esté corriendo (uvicorn).</p>
                </div>
            )}

            {!loading && !error && materias.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: 12 }}>
                    No se encontraron materias con encuestas configuradas.
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {Array.isArray(materias) && materias.map((materia) => (
                    <div 
                        key={materia.id}
                        onClick={() => irAlDetalle(materia.id)}
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '8px', 
                                backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                            }}>
                                <BookOpen size={20} color="#4b5563" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>{materia.nombre}</h3>
                                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{materia.ciclo_lectivo} {materia.cuatrimestre}</span>
                            </div>
                        </div>
                        <ChevronRight size={20} color="#9ca3af" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeleccionarMateriaEstadisticasDep;