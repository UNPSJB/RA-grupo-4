import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
import MisRespuestas from '../Estudiante/MisRespuestas'; 
import HeaderInstitucional from '../Otros/HeaderInstitucional';

const MostrarEncuestasAlumno = () => {
    const { materiaId } = useParams();
    const id = materiaId ? parseInt(materiaId) : 0;
    
    const botonVolverStyle = {
        position: 'absolute',
        top: '20px', 
        right: '20px', 
        backgroundColor: '#f0f4f8',
        color: '#0078D4',
        border: 'none',
        padding: '6px 10px', 
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        zIndex: 10,
    };
    const contenedorWrapperStyle = {
        maxWidth: '1000px', 
        margin: '20px auto', 
        position: 'relative',
    };

    const tarjetaStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '20px', 
    };

    const contenidoStyle = {
        paddingTop: '30px', 
    };

    if (!id) return (
        <div style={{ ...contenedorWrapperStyle, textAlign: 'center', padding: '40px', ...tarjetaStyle }}>
            <p>Error: No se pudo identificar la materia.</p>
            <NavLink to="/home/alumno/historial-encuestas" style={{...botonVolverStyle, right: '40px'}}>
                Volver al historial
            </NavLink>
        </div>
    );

    return (
        <div style={contenedorWrapperStyle}>
            <div style={tarjetaStyle}>
                <NavLink to="/home/alumno/historial-encuestas" style={botonVolverStyle}>
                    <ArrowLeft size={16} /> 
                    Volver al Historial
                </NavLink>
                <div style={contenidoStyle}>
                    <HeaderInstitucional/>
                    <MisRespuestas materiaId={id} />
                </div>
            </div>
        </div>
    );
};

export default MostrarEncuestasAlumno;