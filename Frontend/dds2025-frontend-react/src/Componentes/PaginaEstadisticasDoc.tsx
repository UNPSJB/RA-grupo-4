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
      
      // --- INICIO DE LA MODIFICACIÓN (Cache-Busting) ---
      // Añadimos un parámetro único a la URL para forzar que no se use caché
      const uniqueUrl = `http://localhost:8000/materias/${materiaId}/estadisticas?timestamp=${new Date().getTime()}`;

      const response = await fetch(uniqueUrl, { cache: 'no-cache' });
      // --- FIN DE LA MODIFICACIÓN ---

      if (!response.ok) throw new Error("Error al obtener estadísticas");
      const data: EstadisticasMateria = await response.json();
      
      // <-- AÑADIDO: Debugging para ver qué datos llegan
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

  if (cargando) return <p style={{ color: "#ccc" }}>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!estadisticas) return <p>No se encontraron estadísticas.</p>;

  return (
    <div style={{ color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ marginBottom: "15px", color: "#0d0d0eff" }}>
          Estadísticas de la Materia (ID: {materiaId})
        </h3>
        <button 
          onClick={fetchEstadisticas}
          style={{ padding: '8px 12px', cursor: 'pointer' }}
        >
          Refrescar
        </button>
      </div>
      <div style={{ backgroundColor: "#222", padding: "20px", borderRadius: "6px" }}>
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
