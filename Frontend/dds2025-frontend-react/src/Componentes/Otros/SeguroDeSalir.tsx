import React from 'react';
import { useNavigate } from 'react-router-dom';
import todoBienImg from '../../assets/TodoBien.png'; 

const TodoBien: React.FC = () => {
    const navigate = useNavigate();

    const handleVolver = () => {
        navigate('/panel');
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                {/* Aquí está la imagen solicitada */}
                <img 
                    src={todoBienImg} 
                    alt="Todo salió bien" 
                    style={styles.imagen} 
                />

                <h2 style={styles.titulo}>¡Respuesta Enviada Correctamente!</h2>
                
                <p style={styles.mensaje}>
                    Se ha enviado correctamente tu respuesta a la encuesta.
                    <br />
                    Gracias por tu participación.
                </p>

                <button 
                    onClick={handleVolver}
                    style={styles.boton}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.botonHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.boton.backgroundColor}
                >
                    Volver al panel
                </button>
            </div>
        </div>
    );
};

// Estilos encapsulados
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        animation: 'fadeIn 0.5s ease-out',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '50px 40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
        maxWidth: '500px',
        width: '100%',
        borderTop: '6px solid #28a745', // Borde verde superior
    },
    imagen: {
        width: '150px', // Ajusta este tamaño según lo grande que quieras la imagen
        height: 'auto',
        marginBottom: '20px',
        display: 'inline-block', // Ayuda a que el text-align: center del padre funcione bien
    },
    titulo: {
        color: '#003366',
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '15px',
        margin: '0 0 15px 0',
    },
    mensaje: {
        color: '#555',
        fontSize: '1.1rem',
        marginBottom: '35px',
        lineHeight: '1.6',
    },
    boton: {
        backgroundColor: '#003366',
        color: 'white',
        border: 'none',
        padding: '12px 30px',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    botonHover: {
        backgroundColor: '#005bb5',
    }
};

export default TodoBien;