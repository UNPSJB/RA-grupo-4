import React, { useEffect } from "react";
import { Code, Server, PenTool } from "lucide-react";


const stylesCSS = `
/* CONTENEDOR GENERAL */
.nosotros-container {
    padding: 60px 20px;
    background: linear-gradient(to bottom right, #f7f9fc, #eef2f6);
    min-height: 100vh;
}

/* HEADER */
.nosotros-header {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 60px auto;
}

.nosotros-header h1 {
    font-size: 42px;
    font-weight: 800;
    color: #222;
}

.nosotros-header .text-blue {
    color: #0056b3;
}

.nosotros-header p {
    font-size: 18px;
    margin-top: 15px;
    color: #555;
    line-height: 1.6;
}

/* GRID DE TARJETAS */
.nosotros-grid {
    max-width: 1100px;
    margin: auto;
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* TARJETA */
.nosotros-card {
    background: white;
    padding: 30px;
    border-radius: 18px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 30, 60, 0.1);
    transition: all 0.35s ease;
    position: relative;
    overflow: hidden;
}

/* Hover */
.nosotros-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 10px 26px rgba(0, 40, 90, 0.18);
    border-color: #0077ff;
}

/* LUZ DEGRADADA EN HOVER */
.nosotros-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 119, 255, 0.15), transparent);
    opacity: 0;
    transition: opacity 0.35s ease;
}

.nosotros-card:hover::after {
    opacity: 1;
}

/* ICONO */
.icon-wrapper {
    margin-bottom: 15px;
}

.icon {
    color: #0077ff;
}

/* TITULOS */
.nosotros-card h2 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #222;
}

.nosotros-card h3 {
    font-size: 14px;
    font-weight: 600;
    color: #0077ff;
    margin-bottom: 15px;
    text-transform: uppercase;
}

/* DESCRIPCIÓN */
.nosotros-card .description {
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
}

/* FOOTER */
.nosotros-card .footer {
    font-size: 13px;
    color: #888;
    border-top: 1px solid #eaeaea;
    padding-top: 10px;
}
`;
// ---

interface Member {
  name: string;
  role: string;
  description: string;
}

const hpTeamMembers: Member[] = [
  {
    name: "Santiago Javier Corvalan",
    role: "No usa nombres significativos",
    description:
      "Es de boca",
  },
  {
    name: "Denis JM La Maquina james",
    role: "Un crack",
    description:
      "No Tiene suerte con las cajas de clash royale",
  },
  {
    name: "Mauro Agustin Cual",
    role: "Crackk, mete cantidad de boludeces",
    description:
      "Un capo, maneja",
  },
];

const Nosotros = () => {
  useEffect(() => {
    // Busca si ya existe una etiqueta style con este ID para evitar duplicados.
    let styleElement = document.getElementById("nosotros-styles");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "nosotros-styles";
      styleElement.textContent = stylesCSS;
      document.head.appendChild(styleElement);
    }

    // Opcional: limpiar el estilo al desmontar el componente (aunque en este caso es un estilo global)
    // return () => {
    //   if (styleElement && styleElement.parentNode) {
    //     styleElement.parentNode.removeChild(styleElement);
    //   }
    // };
  }, []);

  const teamDescription =
    "Somos el HP Team, un equipo dedicado a la innovación y al desarrollo de soluciones tecnológicas de alto impacto.";

  const iconForRole = (role: string) => {
    if (role.includes("Frontend")) return <Code size={38} className="icon" />;
    if (role.includes("Backend")) return <Server size={38} className="icon" />;
    if (role.includes("UX")) return <PenTool size={38} className="icon" />;
    return null;
  };

  return (
    <div className="nosotros-container">
      <div className="nosotros-header">
        <h1>
          Conoce a nuestro <span className="text-blue"> Equipo Innovador</span>
        </h1>
        <p>{teamDescription}</p>
      </div>

      <div className="nosotros-grid">
        {hpTeamMembers.map((member, i) => (
          <div key={i} className="nosotros-card">
            <div className="icon-wrapper">{iconForRole(member.role)}</div>

            <h2>{member.name}</h2>
            <h3>{member.role}</h3>

            <p className="description">{member.description}</p>

            <div className="footer">HP Team · UNPSJB</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros;