import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
// Asegúrate de que la ruta de importación sea correcta
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

interface InformeSintetico {
  id: number;
  descripcion: string;
}

const SeleccionarInformeSinteticoSEC: React.FC = () => {
  const [informes, setInformes] = useState<InformeSintetico[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInformesSinteticos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/informes-sinteticos/`
      );
      if (!response.ok) throw new Error("Error al obtener los informes sintéticos");
      const data: InformeSintetico[] = await response.json();
      setInformes(data);
      
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchInformesSinteticos();
  }, [fetchInformesSinteticos]);

  if (cargando) {
      return <div style={{ padding: "30px", textAlign: "center", color: "#003366" }}>Cargando informes...</div>;
  }

  if (error) {
    return (
        <ErrorCargaDatos 
            mensajeError={error}
            onReintentar={fetchInformesSinteticos}
        />
    );
  }

  return (
    <div className="uni-wrapper">
      {/* Estilos alineados con la paleta institucional */}
      <style>{`
        :root {
          --uni-primary: #003366;
          --uni-secondary: #0078D4;
          --uni-bg-main: #ffffff;
          --uni-bg-alt: #f9f9f9;
          --uni-border: #ddd;
          --uni-text: #111;
        }

        .uni-wrapper {
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 25px;
          color: var(--uni-text);
        }

        .content-title {
          font-size: 22px;
          color: var(--uni-primary);
          font-weight: bold;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--uni-primary);
          padding-bottom: 10px;
        }

        .uni-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .uni-th {
          background-color: var(--uni-primary);
          color: white;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
        }

        .uni-td {
          padding: 12px 15px;
          border-bottom: 1px solid var(--uni-border);
        }

        .uni-tr:nth-child(even) { background-color: var(--uni-bg-alt); }
        .uni-tr:hover { background-color: #eef6fc; }

        .styled-button {
          display: inline-block;
          padding: 8px 16px;
          background-color: var(--uni-secondary);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        .styled-button:hover {
          background-color: #005fa3;
        }
      `}</style>

      <h3 className="content-title">
        Seleccionar Informe Sintético
      </h3>

      {informes.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center", background: "#f9f9f9", borderRadius: "8px" }}>
          <SinDatos/>
        </div>
      ) : (
        <table className="uni-table">
          <thead>
            <tr>
              <th className="uni-th" style={{ width: '80px' }}>ID</th>
              <th className="uni-th">Descripción</th>
              <th className="uni-th" style={{ width: '150px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((inf) => (
              <tr key={inf.id} className="uni-tr">
                <td className="uni-td">{inf.id}</td>
                <td className="uni-td">{inf.descripcion}</td>
                <td className="uni-td">
                  <Link to={`/home/informe-sintetico/ver/${inf.id}`} className="styled-button">
                    Seleccionar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SeleccionarInformeSinteticoSEC;