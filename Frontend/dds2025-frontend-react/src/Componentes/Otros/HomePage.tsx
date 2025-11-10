import React from "react";
import logoUnpsjb from "../../assets/logo_unpsjb.png"; 
import sedeTrelew from "../../assets/sede_trelew.jpg"; 

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <img
        src={logoUnpsjb} 
        alt="Logo UNPSJB"
        className="home-logo"
      />
      <h1 className="home-title">
        Bienvenido al Sistema de Encuestas
      </h1>
      <h2 className="home-subtitle">
        Universidad Nacional de la Patagonia San Juan Bosco
      </h2>

      <div className="home-image-container">
        <img
          src={sedeTrelew} 
          alt="Sede Trelew de la UNPSJB"
          className="home-building-image"
        />
        <p className="home-image-caption">Sede Trelew</p>
      </div>

      <p className="home-description">
        Utilice los menús de navegación en la parte superior para acceder a las
        diferentes funcionalidades del sistema.
      </p>
    </div>
  );
};

export default HomePage;