import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { currentUser, isAuthenticated, isLoading, login, error } = useAuth(); 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({username, password});
    };

    // if (isLoading)
    //     return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando datos del usuario...</div>

    // Redirecciones al home del rol correspondiente
    if (isAuthenticated){
        if (currentUser?.role_name == "alumno"){
            return (<Navigate to="/home/alumno/" replace />)
        }
        if (currentUser?.role_name == "docente"){
            return (<Navigate to="/home/docente" replace />)
        }
        if (currentUser?.role_name == "departamento"){
            return (<Navigate to="/home/departamento" replace />)
        }
        if (currentUser?.role_name == "secretaria_academica"){
            return (<Navigate to="/home/secretaria" replace />)
        }

        return (<Navigate to="/home" replace />) 
    }

    return (
        <section style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
        }}>
            <div style={{ 
                border: '1px solid #ccc', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión</h3>
                
                {/* Muestra el error si existe */}
                {error ? <p style={{ color: 'red', fontSize: '.9em', textAlign: 'center' }}>{error}</p> : null}

                <form onSubmit={handleSubmit} style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: '15px'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    
                    <button type="submit" style={{ 
                        marginTop: 15, 
                        padding: '10px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                    }}>
                        Iniciar Sesión
                    </button>

                    <p className="auth-links" style={{ textAlign: 'center', fontSize: '.9em', marginTop: '10px' }}>
                        <Link to="/crear-cuenta">Crear una cuenta nueva</Link> | <Link to="/recuperar-contraseña">Olvidé mi contraseña</Link>
                    </p>
                </form>
            </div>
        </section>
    );
};

export default Login; 