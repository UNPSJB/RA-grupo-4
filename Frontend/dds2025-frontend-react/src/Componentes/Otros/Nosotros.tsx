import React from "react";
import { Brain, Server, PenTool } from "lucide-react"; 
const stylesCSS = `
/* CONTENEDOR GENERAL */
.nosotros-container-v2 {
    padding: 80px 20px;
    /* Fondo limpio y moderno con un degradado sutil */
    background-color: #f0f4f9; 
    background-image: radial-gradient(circle at center, #ffffff 1%, #f0f4f9 100%);
    min-height: 100vh;
}

/* HEADER */
.nosotros-header-v2 {
    text-align: center;
    max-width: 900px;
    margin: 0 auto 70px auto;
}

.nosotros-header-v2 h1 {
    font-size: 48px;
    font-weight: 900;
    color: #1a202c; /* Negro más profundo */
    letter-spacing: -1px;
}

.nosotros-header-v2 .text-primary {
    color: #4a90e2; /* Color primario azul brillante */
}

.nosotros-header-v2 p {
    font-size: 19px;
    margin-top: 20px;
    color: #4a5568; /* Gris oscuro para el cuerpo de texto */
    line-height: 1.6;
}

/* GRID DE TARJETAS */
.nosotros-grid-v2 {
    max-width: 1200px;
    margin: auto;
    display: grid;
    gap: 40px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* TARJETA */
.nosotros-card-v2 {
    background: #ffffff;
    padding: 35px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    /* Sombra más marcada pero suave */
    box-shadow: 0 10px 30px rgba(0, 50, 100, 0.08); 
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
    text-align: center;
}

/* Efecto de patrón geométrico de fondo */
.nosotros-card-v2::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, #f7f9fc 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
    z-index: 1;
}

/* Hover */
.nosotros-card-v2:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 50, 100, 0.15);
    border-color: #4a90e2;
}


/* ICONO */
.icon-wrapper-v2 {
    position: relative;
    z-index: 2; /* Asegurar que el icono esté sobre el patrón */
    margin-bottom: 25px;
    display: inline-flex;
    padding: 15px;
    border-radius: 50%;
    background-color: #e6f0fa; /* Fondo suave para el icono */
}

.icon-v2 {
    color: #4a90e2;
    stroke-width: 2.5;
}

/* TITULOS */
.nosotros-card-v2 h2 {
    position: relative;
    z-index: 2;
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 5px;
    color: #1a202c;
}

/* SUB-TITULO / ROL DETALLADO */
.nosotros-card-v2 h3 {
    position: relative;
    z-index: 2;
    font-size: 15px;
    font-weight: 600;
    color: #4a90e2;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* DESCRIPCIÓN */
.nosotros-card-v2 .description-v2 {
    position: relative;
    z-index: 2;
    color: #555;
    line-height: 1.7;
    margin-bottom: 30px;
    font-size: 15px;
    min-height: 90px; /* Altura mínima para alinear las tarjetas */
    display: flex;
    align-items: center;
    justify-content: center;
}

/* FOOTER */
.nosotros-card-v2 .footer-v2 {
    position: relative;
    z-index: 2;
    font-size: 12px;
    font-weight: 600;
    color: #718096;
    border-top: 1px dashed #e2e8f0;
    padding-top: 15px;
    text-transform: uppercase;
}
`;

interface Member {
    name: string;
    role: string;
    description: string;
}

const hpTeamMembers: Member[] = [
    {
        name: "Santiago Javier Corvalan",
        role: "Desarrollador de Producto (Enfoque Funcional y Negocio)",
        description:
            "Traducción de requisitos de negocio complejos en historias de usuario técnicas, validación funcional de las implementaciones, y actuar como enlace clave con el Product Owner y los stakeholders para clarificar los requisitos funcionales.",
    },
    {
        name: "Dennis James",
        role: "Desarrollador de Soluciones (Enfoque Backend y Datos)",
        description:
            "Desarrollo de servicios del lado del servidor (backend), diseño de arquitectura de la aplicación, optimización de rendimiento y gestión de la persistencia de datos (bases de datos).",
    },
    {
        name: "Mauro Agustin Cual",
        role: "Desarrollador de Experiencia (Enfoque Frontend y UI/UX)",
        description:
            "Desarrollo de la interfaz de usuario (UI), implementación de la lógica del lado del cliente (frontend), y garantizar una experiencia de usuario (UX) fluida y responsiva.",
    },
];

const Nosotros = () => {
    const iconForSpecialization = (role: string) => {
        if (role.includes("Frontend") || role.includes("Experiencia")) {
            return <PenTool size={32} className="icon-v2" />; 
        }
        if (role.includes("Backend") || role.includes("Datos") || role.includes("Soluciones")) {
            return <Server size={32} className="icon-v2" />;
        }
        if (role.includes("Producto") || role.includes("Negocio") || role.includes("Funcional")) {
            return <Brain size={32} className="icon-v2" />;
        }
        return null;
    };

    const teamDescription =
        "Somos el HP Team, un equipo dedicado a la innovación y al desarrollo de soluciones tecnológicas de alto impacto. Si bien todos trabajamos de igual manera en todo el proyecto hubieron cosas en las que cada integrante se desempeñó mejor.";

    return (
        <>
            <style id="nosotros-styles-v2">{stylesCSS}</style>
            
            <div className="nosotros-container-v2">
                <div className="nosotros-header-v2">
                    <h1>
                        Conoce al <span className="text-primary">HP Team</span>
                    </h1>
                    <p>{teamDescription}</p>
                </div>

                <div className="nosotros-grid-v2">
                    {hpTeamMembers.map((member, i) => (
                        <div key={i} className="nosotros-card-v2">
                            
                            <div className="icon-wrapper-v2">
                                {iconForSpecialization(member.role)}
                            </div>

                            <h2>{member.name}</h2>
                            {/* <h3>{member.role}</h3> */}

                            <p className="description-v2">{member.description}</p>

                            <div className="footer-v2">HP Team · UNPSJB</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Nosotros;