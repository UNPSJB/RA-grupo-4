import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

interface EstadisticasMateria {
  total_inscriptos: number;
  total_encuestas_procesadas: number;
}

const PaginaEstadisticasDoc: React.FC = () => {
  const { materiaId } = useParams<{ materiaId: string }>();

  const [estadisticas, setEstadisticas] = useState<EstadisticasMateria | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticas = useCallback(async () => {
    if (!materiaId) return;
    try {
      setCargando(true);
      setError(null);
      
      // Añadimos un parámetro único a la URL para forzar que no se use caché
      const uniqueUrl = `http://localhost:8000/materias/${materiaId}/estadisticas?timestamp=${new Date().getTime()}`;

      const response = await fetch(uniqueUrl, { cache: 'no-cache' });

      if (!response.ok) throw new Error("Error al obtener estadísticas");
      const data: EstadisticasMateria = await response.json();
      
      console.log("Datos recibidos del backend:", data); 
      
      setEstadisticas(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, [materiaId]);

  useEffect(() => {
    fetchEstadisticas();
  }, [fetchEstadisticas]);

  if (cargando) return <p style={{ color: "#333" }}>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!estadisticas) return <p>No se encontraron estadísticas.</p>;

  return (
    <div className="content-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #444", paddingBottom: "15px", marginBottom: "20px" }}>
        <h3 className="content-title" style={{ border: "none", margin: 0, padding: 0 }}>
          Estadísticas de la Materia (ID: {materiaId})
        </h3>
        <button 
          onClick={fetchEstadisticas}
          className="styled-button"
        >
          Refrescar
        </button>
      </div>
      <div>
        <p style={{ fontSize: "1.2rem", margin: "10px 0" }}>
          <strong>Total de Inscriptos:</strong> {estadisticas.total_inscriptos}
        </p>
        <p style={{ fontSize: "1.2rem", margin: "10px 0" }}>
          <strong>Encuestas Procesadas:</strong> {estadisticas.total_encuestas_procesadas}
        </p>
      </div>
    </div>
  );
};

export default PaginaEstadisticasDoc;