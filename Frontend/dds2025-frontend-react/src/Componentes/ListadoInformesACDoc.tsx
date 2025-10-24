import React, { useEffect, useState } from "react";

interface Docente {
  id_docente: number;
  nombre: string;
}

interface Materia {
  id_materia: number;
  nombre: string;
  anio: number;
}

interface InformeAC {
  id_informesAC: number;
  sede: string;
  ciclo_lectivo: number;
  cantidad_alumnos_inscriptos?: number; 
  cantidad_comisiones_teoricas?: number;
  cantidad_comisiones_practicas?: number;
  docente: Docente;
  materia: Materia;
}



const ListadoInformesACDoc: React.FC = () => {

  const idDocenteActual = 1;
  
  
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        setCargando(true);
        setError(null);
    
        const response = await fetch(
          `http://localhost:8000/informesAC/docente/${idDocenteActual}`
        );
        
        if (!response.ok) {
      
          const errorData = await response.json();
          throw new Error(errorData.detail || "Error al obtener informes");
        }
        
        const data: InformeAC[] = await response.json();
        setInformes(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    fetchInformes();
  }, [idDocenteActual]); 

  if (cargando) return <p style={{ color: "#333" }}>Cargando informes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ color: "#fff" }}>
      <h3 style={{ marginBottom: "15px", color: "#0d0d0eff" }}>
        Informes de Actividad Curricular
      </h3>

      {informes.length === 0 ? (
        <p>No hay informes disponibles para este docente.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <thead>

            <tr style={{ backgroundColor: "#444", color: "#fff" }}>
              <th style={{ border: "1px solid #555", padding: "10px", textAlign: "left" }}>
                ID Informe
              </th>
              <th style={{ border: "1px solid #555", padding: "10px", textAlign: "left" }}>
                Materia
              </th>
              <th style={{ border: "1px solid #555", padding: "10px", textAlign: "left" }}>
                Sede
              </th>
              <th style={{ border: "1px solid #555", padding: "10px", textAlign: "left" }}>
                Ciclo Lectivo
              </th>
            </tr>
          </thead>
          <tbody>
    
            {informes.map((inf, index) => (
              <tr
                key={inf.id_informesAC}
                style={{
                  backgroundColor: index % 2 === 0 ? "#2b2b2b" : "#1e1e1e",
                }}
              >
              
                <td style={{ border: "1px solid #444", padding: "10px" }}>
                  {inf.id_informesAC}
                </td>
                
             
                <td style={{ border: "1px solid #444", padding: "10px" }}>
                  {inf.materia.nombre}
                </td>
                
                
                <td style={{ border: "1px solid #444", padding: "10px" }}>
                  {inf.sede}
                </td>

                <td style={{ border: "1px solid #444", padding: "10px" }}>
                  {inf.ciclo_lectivo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDoc;