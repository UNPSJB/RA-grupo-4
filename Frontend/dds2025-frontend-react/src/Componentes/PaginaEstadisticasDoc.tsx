import React, { useEffect, useState, useCallback } from "react";

interface MateriaEstadisticaItem {
  id_materia: number;
  nombre_materia: string;
  total_inscriptos: number;
  total_encuestas_procesadas: number;
}

const ID_DOCENTE_ACTUAL = 1;

const PaginaEstadisticasDoc: React.FC = () => {
  const [listaEstadisticas, setListaEstadisticas] = useState<MateriaEstadisticaItem[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstadisticasDocente = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await fetch(
        `http://localhost:8000/materias/docente/${ID_DOCENTE_ACTUAL}/estadisticas`,
        { cache: 'no-cache' }
      );
      if (!response.ok) throw new Error("Error al obtener estadísticas del docente");
      const data: { estadisticas: MateriaEstadisticaItem[] } = await response.json();
      console.log("Datos recibidos del backend:", data);
      setListaEstadisticas(data.estadisticas || []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadisticasDocente();
  }, [fetchEstadisticasDocente]);

  if (cargando) return <p style={{ color: "#333" }}>Cargando estadísticas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="content-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #444", paddingBottom: "15px", marginBottom: "25px" }}>
        <h3 className="content-title" style={{ border: "none", margin: 0, padding: 0 }}>
          Estadísticas de Materias a Cargo
        </h3>
        <button
          onClick={fetchEstadisticasDocente}
          className="styled-button"
        >
          Refrescar
        </button>
      </div>

      {listaEstadisticas.length === 0 ? (
        <p>No se encontraron materias o estadísticas para este docente.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
            <table className="styled-table">
            <thead>
                <tr>
                    {/* --- CAMBIO: Borde a la derecha para separación y padding --- */}
                    <th style={{ borderRight: '1px solid #555', padding: '12px 18px' }}>ID Materia</th>
                    <th style={{ borderRight: '1px solid #555', padding: '12px 18px' }}>Nombre Materia</th>
                    <th style={{ borderRight: '1px solid #555', padding: '12px 18px', textAlign: 'center' }}>Total Inscriptos</th> {/* Centrado */}
                    <th style={{ padding: '12px 18px', textAlign: 'center' }}>Encuestas Procesadas</th> {/* Centrado, sin borde derecho en la última */}
                </tr>
            </thead>
            <tbody>
                {listaEstadisticas.map((item, index) => (
                <tr key={item.id_materia}>
                    {/* --- CAMBIO: Borde a la derecha para separación, padding y tamaño de fuente --- */}
                    <td style={{ borderRight: '1px solid #555', padding: '15px 18px', fontSize: '1.05rem' }}>{item.id_materia}</td>
                    <td style={{ borderRight: '1px solid #555', padding: '15px 18px', fontSize: '1.05rem' }}>{item.nombre_materia}</td>
                    <td style={{ borderRight: '1px solid #555', padding: '15px 18px', fontSize: '1.05rem', textAlign: 'center' }}>{item.total_inscriptos}</td>
                    <td style={{ padding: '15px 18px', fontSize: '1.05rem', textAlign: 'center' }}>{item.total_encuestas_procesadas}</td>
                    {/* --- FIN CAMBIO --- */}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default PaginaEstadisticasDoc;

