import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../App.css'; 

const MenuDepartamento = () => {
    const navigate = useNavigate();
    
    const links = [
        { ruta: "/home/informes-dep", texto: "Filtrar Informes A.C." },
        { ruta: "/home/listado-informes-ac", texto: "Listado Informes A.C." },
        { ruta: "/home/generar-sintetico", texto: "Generar Informe Sintético" },
        { ruta: "/home/estadisticas-preguntas", texto: "Estadísticas por Pregunta" },
    ];

    return (
        <div className="menu-page-container">
            <button onClick={() => navigate(-1)} className="back-button-simple">
                <ArrowLeft size={18} /> Regresar
            </button>
            <header className="menu-header" style={{ '--menu-color': 'var(--color-departamento)' }}>
                <h1>Portal de Departamento</h1>
                <p>Gestión de informes académicos y sintéticos.</p>
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

export default MenuDepartamento;