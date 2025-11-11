import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../App.css'; 

const MenuSecretaria = () => {
    const navigate = useNavigate();

    const links = [
        { ruta: "/home/informes-sinteticos", texto: "Consultar Informes Sintéticos" },
    ];

    return (
        <div className="menu-page-container">
            <button onClick={() => navigate(-1)} className="back-button-simple">
                <ArrowLeft size={18} /> Regresar
            </button>
            <header className="menu-header" style={{ '--menu-color': 'var(--color-secretaria)' }}>
                <h1>Portal de Secretaría</h1>
                <p>Acceso a los informes finales.</p>
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

export default MenuSecretaria;