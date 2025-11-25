import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ErrorCargaDatos from '../Otros/ErrorCargaDatos';
import SinDatos from '../Otros/SinDatos';

interface InformeSintetico {
  id: number;
  descripcion: string;
  departamento_id: number;
}

const ListarInformesSinteticos: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInformes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/informes-sinteticos");

      if (!response.ok) {
        throw new Error('Hubo un error al cargar los informes.');
      }

      const data: InformeSintetico[] = await response.json();
      setInformes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInformes();
  }, [fetchInformes]);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#003366' }}>Cargando informes...</div>;
  }

  if (error) {
    return (
      <ErrorCargaDatos 
        mensajeError={error} 
        onReintentar={fetchInformes} 
      />
    );
  }

  if (informes.length === 0) {
    return <SinDatos mensaje="No se encontraron informes sintéticos registrados." />;
  }

  return (
    <div style={{ 
      maxWidth: '900px',
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Roboto, sans-serif',
      backgroundColor: '#f8fafd'
    }}>

      {/* Título principal estilizado */}
      <h1 style={{ 
        fontSize: '32px', 
        color: '#003366', 
        marginBottom: '30px', 
        fontWeight: 600,
        paddingBottom: '8px',
        borderBottom: '2px solid #a7d9f7'
      }}>
        Informes Sintéticos
      </h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {informes.map((informe) => (
          <li 
            key={informe.id} 
            // Estilos de card sutiles y profesionales
            style={{ 
              background: '#ffffff', 
              borderRadius: '10px',
              boxShadow: '0 3px 12px rgba(0,0,0,0.04)',
              padding: '25px',
              marginBottom: '20px',
              border: '1px solid #eef2f7',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {/* Contenido principal del card */}
            <div>
                <p style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: '#003366' }}>
                {informe.descripcion}
                </p>
                <p style={{ margin: '7px 0 0 0', fontSize: '14px', color: '#7b8a9b' }}>
                Accede para ver todos los detalles de este informe.
                </p>
            </div>

            {/* BOTÓN DE NAVEGACIÓN A DETALLE - RUTA CORREGIDA Y COLOR SUAVE */}
            <Link 
                // RUTA CORREGIDA: Usa el path exacto definido en MenuSecretaria
                to={`/home/secretaria/informe-sintetico/ver/${informe.id}`} 
                style={{
                    background: '#e0eaf6', // Fondo muy claro
                    color: '#0056b3', // Color de texto azul institucional
                    border: '1px solid #a8c8e6', // Borde sutil
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 600, 
                    textDecoration: 'none',
                    marginLeft: '30px',
                    minWidth: '120px',
                    textAlign: 'center'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d2e2f3')} // Gris azulado en hover
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#e0eaf6')}
            >
                Ver Informe
            </Link>
          </li>
        ))}
      </ul>
      {/* Estilos para el efecto de hover en el li */}
      <style>{`
        li:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
        }
        li:active {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ListarInformesSinteticos;