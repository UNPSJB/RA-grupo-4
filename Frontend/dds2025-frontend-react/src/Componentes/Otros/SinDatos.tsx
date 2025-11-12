import React from 'react';
// Asegúrate de que la ruta sea correcta según tu proyecto
import imgSinDatosDefault from '../../assets/sinDatos.png';

interface SinDatosProps {
  /** Ruta de la imagen a mostrar. Si no se provee, usa la imagen por defecto. */
  imagenSrc?: string;
  /** Título principal (ej: "No hay resultados") */
  titulo?: string;
  /** Mensaje descriptivo adicional */
  mensaje?: string;
}

const SinDatos: React.FC<SinDatosProps> = ({
  // Aquí asignamos tu imagen importada como valor por defecto
  imagenSrc = imgSinDatosDefault,
  titulo = "Ups, parece que no hay nada por aqui..",
  mensaje = "Aun no hay datos cargados"
}) => {
  return (
    <div className="no-data-wrapper">
      <style>{`
        .no-data-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background-color: #f8fafc;
          border-radius: 12px;
          border: 2px dashed #e0e0e0;
          text-align: center;
          font-family: "Segoe UI", "Roboto", sans-serif;
          animation: fadeIn 0.8s ease-out;
          color: #64748b;
          min-height: 200px;
        }

        .no-data-image-container {
          margin-bottom: 20px;
          opacity: 0.8;
          transition: transform 0.3s ease;
        }
        .no-data-wrapper:hover .no-data-image-container {
           transform: scale(1.05);
           opacity: 1;
        }

        .no-data-img {
          max-width: 150px;
          height: auto;
          display: block;
        }

        .no-data-title {
          font-size: 1.50rem;
          font-weight: 700;
          color: #003366;
          margin: 0 0 10px 0;
        }

        .no-data-text {
          font-size: 0.95rem;
          color: #666;
          max-width: 300px;
          margin: 0;
          line-height: 1.5;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="no-data-image-container">
        <img src={imagenSrc} alt="Sin datos" className="no-data-img" />
      </div>

      <h3 className="no-data-title">{titulo}</h3>
      <p className="no-data-text">{mensaje}</p> 
    </div>
  );
};

export default SinDatos;