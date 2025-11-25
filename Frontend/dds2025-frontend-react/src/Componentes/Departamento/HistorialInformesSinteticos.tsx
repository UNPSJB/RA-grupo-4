import React, { useEffect, useState } from "react";
import { History, Calendar, AlertCircle } from 'lucide-react'; 

const API_BASE = "http://localhost:8000";

interface HistorialItem {
  id: number;
  fecha_generacion: string;
  anio_lectivo: number;
  cuatrimestre: string;
  nombre_departamento: string;
  usuario_generador: string;
}

const HistorialInformesSinteticos: React.FC = () => {
  const [lista, setLista] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Colores corporativos
  const colors = {
    primaryOrange: "#e56849",
    bgLight: "#f4f6f9",
    tableHeaderBg: "#ebf8ff", 
    headerText: "#1e3a56",    
    textDark: "#2d3748",
    textMuted: "#718096"
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/informes-sinteticos/historial/listar`)
      .then((res) => res.json())
      .then((data) => {
        if(Array.isArray(data)) setLista(data);
        else setLista([]);
      })
      .catch((err) => {
          console.error("Error cargando historial", err);
          setLista([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      
      <style>{`
        .historial-container {
            max-width: 1100px;
            margin: 40px auto;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            padding: 30px;
            border: 1px solid #eaeaea;
        }
        .page-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-left: 15px;
            border-left: 5px solid ${colors.primaryOrange};
        }
        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${colors.textDark};
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .custom-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        .custom-table th {
            background-color: ${colors.tableHeaderBg};
            color: ${colors.headerText};
            font-weight: 700;
            padding: 16px;
            font-size: 0.9rem;
            letter-spacing: 0.02em;
            border-bottom: 2px solid #e2e8f0;
        }
        .custom-table td {
            padding: 18px 16px;
            border-bottom: 1px solid #edf2f7;
            color: ${colors.textDark};
            font-size: 0.95rem;
            vertical-align: middle;
        }
        .custom-table tr:last-child td {
            border-bottom: none;
        }
        .custom-table tr:hover {
            background-color: #fbfdfd;
        }
        .date-cell {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .date-main {
            font-weight: 600;
            color: #4a5568;
        }
        .date-time {
            font-size: 0.8em;
            color: #a0aec0;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: ${colors.textMuted};
        }
        .report-title {
            font-weight: 700;
            color: #2d3748;
            font-size: 1rem;
        }
        .report-subtitle {
            font-size: 0.85rem;
            color: #718096;
            margin-top: 4px;
        }
      `}</style>

      <div className="historial-container">
          
          {/* TARJETA PRINCIPAL */}
          <div className="card">
              
              {/* HEADER DE LA SECCIÓN */}
              <div className="page-header">
                  <h1 className="page-title">
                      <AlertCircle size={28} color={colors.primaryOrange} />
                      Historial de Informes Sintéticos
                  </h1>
              </div>

              {/* LOADING */}
              {loading && (
                  <div className="empty-state">Cargando registros...</div>
              )}

              {/* ESTADO VACÍO */}
              {!loading && lista.length === 0 && (
                  <div className="empty-state">
                      <History size={48} style={{ margin: "0 auto 15px", opacity: 0.3 }} />
                      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No se encontraron informes históricos generados.</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                          Los informes se guardan automáticamente al finalizar su creación.
                      </p>
                  </div>
              )}

              {/* TABLA DE LISTADO */}
              {!loading && lista.length > 0 && (
                  <div className="table-wrapper">
                      <table className="custom-table">
                          <thead>
                              <tr>
                                  <th style={{ width: "60%" }}>Informe</th>
                                  <th style={{ width: "40%" }}>Fecha Generación</th>
                              </tr>
                          </thead>
                          <tbody>
                              {lista.map((item) => (
                                  <tr key={item.id}>
                                      <td>
                                          <div className="report-title">
                                              Informe Sintético (ID: {item.id})
                                          </div>
                                          <div className="report-subtitle">
                                              {item.nombre_departamento}
                                          </div>
                                      </td>
                                      
                                      <td>
                                          <div className="date-cell">
                                              <div className="date-main flex items-center gap-2">
                                                  <Calendar size={14} color="#718096" />
                                                  {new Date(item.fecha_generacion).toLocaleDateString()}
                                              </div>
                                              <div className="date-time">
                                                  {new Date(item.fecha_generacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} hs
                                              </div>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default HistorialInformesSinteticos;