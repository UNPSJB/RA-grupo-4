import React from 'react';
import errorImg from '../../assets/error.png';

interface ErrorCargaDatosProps {
  mensajeError?: string;
  onReintentar?: () => void;
}

const ErrorCargaDatos: React.FC<ErrorCargaDatosProps> = ({ 
  mensajeError = "No pudimos cargar los datos.", 
  onReintentar 
}) => {
  return (
    <div className="error-card-wrapper">
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #0078D4;
          --uni-secondary-hover: #005fa3;
          --uni-bg-main: #ffffff;
          --uni-border-light: #ddd;
          --uni-text-secondary: #666666;
          --uni-star-yellow: #FFD700;
        }

        .error-card-wrapper {
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          max-width: 450px;
          margin: 40px auto;
          padding: 25px;
          background: var(--uni-bg-main);
          border-radius: 12px;
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
          border: 1px solid var(--uni-border-light);
          text-align: center;
          animation: fadeIn 0.6s ease-out;
        }

        .seagull-container {
          position: relative;
          /* Tamaño reducido */
          width: 130px;
          height: 130px;
          margin: 0 auto 15px;
        }

        .seagull-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          /* Animación de flotación mantenida suavemente, puedes quitarla si prefieres totalmente estática */
          animation: float 3s ease-in-out infinite alternate;
        }

        .star:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%); }
        .star:nth-child(2) { top: 30%; right: 0; }
        .star:nth-child(3) { top: 30%; left: 0; }
        
        .error-title {
          color: var(--uni-primary);
          font-size: 1.8rem;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .error-message {
          color: var(--uni-text-secondary);
          font-size: 1rem;
          margin-bottom: 25px;
        }

        .retry-button {
          padding: 12px 25px;
          background-color: var(--uni-secondary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        .retry-button:hover {
          background-color: var(--uni-secondary-hover);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-5px); }
        }
      `}</style>

      <div className="seagull-container">
        <img 
          src={errorImg}
          alt="Error" 
          className="seagull-image"
        />

      </div>

      <h2 className="error-title">¡Ups! Algo salió mal...</h2>
      <p className="error-message">{mensajeError}</p>

      {onReintentar && (
        <button className="retry-button" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorCargaDatos;