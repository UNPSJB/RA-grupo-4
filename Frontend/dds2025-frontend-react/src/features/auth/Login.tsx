import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';
import logo from '../../assets/logo_unpsjb.png';

const UserIcon = () => (
    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const LockIcon = () => (
    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { currentUser, isAuthenticated, isLoading, login, error } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ username, password });
    };

    if (isLoading)
        return <div className="loading-message">Cargando datos del usuario...</div>;

    if (isAuthenticated) {
        if (currentUser?.role_name === "alumno") return <Navigate to="/home/alumno/" replace />;
        if (currentUser?.role_name === "docente") return <Navigate to="/home/docente" replace />;
        if (currentUser?.role_name === "departamento") return <Navigate to="/home/departamento" replace />;
        if (currentUser?.role_name === "secretaria_academica") return <Navigate to="/home/secretaria" replace />;
        return <Navigate to="/home" replace />;
    }

    return (
        <section className="login-container">

            <div className="bubble-blue"></div>
            <div className="bubble-red"></div>
            <div className="bubble-green"></div>

            <div className="card">
                <div className="card2">

                    <div className="header-institucional">
                        <img src={logo} alt="UNPSJB Logo" className="logo-unpsjb" />
                    </div>

                    <form onSubmit={handleSubmit} className="form">
                        <p id="heading" className="login-title">Inicio Secion</p>

                        {error ? <p className="error-message">{error}</p> : null}

                        <div className="field">
                            <UserIcon />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Nombre de usuario"
                            />
                        </div>

                        <div className="field">
                            <LockIcon />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Contraseña"
                            />
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="submit-button button1">
                                INGRESAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;
