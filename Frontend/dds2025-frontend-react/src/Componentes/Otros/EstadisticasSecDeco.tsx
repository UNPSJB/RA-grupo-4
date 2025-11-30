import React, { useEffect, useState } from "react";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import SinDatos from "../Otros/SinDatos";

//instalen esto
//npm install chart.js y react-chartjs-2
// npm install chart.js react-chartjs-2
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

import { Users, GraduationCap, FileText, Percent, UserSwitch } from "lucide-react";

import "./EstadisticasSecDeco.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface KpiData {
  titulo: string;
  valor: string | number;
  icon: React.ElementType; 
  color: string;
}

const commonDoughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        font: {
          size: 11,
          family: '"Segoe UI", "Roboto", sans-serif',
        },
      },
    },
  },
};

const EstadisticasSecDeco: React.FC = () => {
  const [kpiDatos, setKpiDatos] = useState<KpiData[]>([]);
  const [informesData, setInformesData] = useState<any>(null);
  const [tasaEgresoData, setTasaEgresoData] = useState<any>(null);
  const [alumnosPorFacultadData, setAlumnosPorFacultadData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colorPrimario = "#0D47A1"; // --color-secretaria
  const colorSecundario = "#1976D2";
  const colorAcento = "#42A5F5";
  const colorClaro = "#BBDEFB";
  const colorGris = "#B0BEC5";

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        //simulacion para ver front
        const simulacionKpi: KpiData[] = [
          {
            titulo: "Alumnos Activos",
            valor: "12,450",
            icon: Users,
            color: colorPrimario,
          },
          {
            titulo: "Docentes Registrados",
            valor: "820",
            icon: GraduationCap,
            color: colorSecundario,
          },
        ];
        setKpiDatos(simulacionKpi);

        setInformesData({
          labels: ["Procesados", "Pendientes"],
          datasets: [
            {
              label: "Informes",
              data: [3120, 450],
              backgroundColor: [colorSecundario, colorGris],
              borderColor: ["#fff", "#fff"],
              borderWidth: 2,
            },
          ],
        });

        setTasaEgresoData({
          labels: ["Egreso", "Permanencia"],
          datasets: [
            {
              data: [62, 38], // 62%
              backgroundColor: [colorAcento, colorClaro],
              borderColor: ["#fff", "#fff"],
              borderWidth: 2,
            },
          ],
        });

        // --- DATOS GRÁFICO 3: Alumnos por Facultad (Bar Chart) ---
        setAlumnosPorFacultadData({
            labels: ["Ingeniería", "Humanidades", "Económicas", "Naturales", "Jurídicas"],
            datasets: [
                {
                    label: "N° de Alumnos",
                    data: [3200, 2800, 2500, 2100, 1850],
                    backgroundColor: [colorPrimario, colorSecundario, colorAcento, colorClaro, colorGris],
                    borderRadius: 4,
                }
            ]
        });

      } catch (err: any) {
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    // Simulamos una pequeña demora para ver la animación de carga
    setTimeout(obtenerDatos, 500); 
  }, []);

  if (loading) return <p style={{ color: "#333", textAlign: "center", fontSize: "1.2rem", marginTop: "2rem" }}>Cargando estadísticas...</p>;
  if (error) return <ErrorCargaDatos mensaje={error} />;
  if (kpiDatos.length === 0) return <SinDatos mensaje="No hay estadísticas disponibles." />;

  return (
    <div className="stats-container">
      {/* --- Título del Dashboard --- */}
      <h2 className="stats-main-title"> Estadisticas Secretaria academica decoracion</h2>
      
      {/* --- Fila de KPIs (Tarjetas de número grande) --- */}
      {kpiDatos.map((item, index) => (
        <div 
          key={item.titulo} 
          className="stat-card kpi-card" 
          // Animación de entrada escalonada
          style={{ animationDelay: `${index * 100}ms` }} 
        >
          <div className="kpi-icon" style={{ backgroundColor: item.color }}>
            <item.icon size={28} color="white" />
          </div>
          <div className="kpi-content">
            <div className="kpi-value">{item.valor}</div>
            <div className="kpi-title">{item.titulo}</div>
          </div>
        </div>
      ))}

      {/* --- Fila de Gráficos (Donas) --- */}
      {informesData && (
        <div className="stat-card chart-card" style={{ animationDelay: "200ms" }}>
          <h3 className="chart-title">Informes Procesados</h3>
          <div className="chart-wrapper">
            <Doughnut data={informesData} options={commonDoughnutOptions} />
          </div>
        </div>
      )}

      {tasaEgresoData && (
        <div className="stat-card chart-card" style={{ animationDelay: "300ms" }}>
          <h3 className="chart-title">Tasa de Egreso (Anual)</h3>
          <div className="chart-wrapper">
            <Doughnut data={tasaEgresoData} options={commonDoughnutOptions} />
          </div>
        </div>
      )}

      {/* --- Fila de Gráfico de Barras (Ancho) --- */}
      {alumnosPorFacultadData && (
        <div className="stat-card bar-chart-card" style={{ animationDelay: "400ms" }}>
             <h3 className="chart-title">Alumnos por Unidad Académica</h3>
             <div className="chart-wrapper-bar">
                <Bar 
                    data={alumnosPorFacultadData} 
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }, // Ocultamos la leyenda (es obvia)
                            title: {
                                display: true,
                                text: "Distribución de alumnos activos",
                                font: { size: 14 }
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }}
                />
             </div>
        </div>
      )}
    </div>
  );
};

export default EstadisticasSecDeco;