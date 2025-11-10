import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../App.css'; // Usa el App.css general

const MenuDocente = () => {
    const navigate = useNavigate();
    
    // Lista de enlaces que SÍ existen en tu App.tsx
    const links = [
        { ruta: "/home/informes-doc", texto: "Informes Pendientes" },
        { ruta: "/home/historial-informes", texto: "Historial de Informes" },
        { ruta: "/home/estadisticas-docente", texto: "Ver Estadísticas Materias" },
    ];

    return (
        <div className="menu-page-container">
            <button onClick={() => navigate(-1)} className="back-button-simple">
                <ArrowLeft size={18} /> Regresar
            </button>
            <header className="menu-header" style={{ '--menu-color': 'var(--color-docente)' }}>
                <h1>Portal del Docente</h1>
                <p>Gestione sus informes y estadísticas.</p>
            </header>
            <div className="menu-link-list">
                {links.map((link, index) => (
                    <Link key={index} to={link.ruta} className="menu-link">
                        {link.texto}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MenuDocente;