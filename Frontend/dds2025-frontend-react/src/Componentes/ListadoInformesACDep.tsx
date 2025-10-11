import { useEffect, useState } from "react";

interface InformeAC {
  id_informesAC: number;
  anio: string;
}

const ListadoInformesACDep = () => {
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/informesAC") 
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener informes");
        return res.json();
      })
      .then((data) => {
        setInformes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando informes...</p>;

  return (
    <div>
      <h3> Listado de Informes de Actividad Curricular </h3>
      {informes.length === 0 ? (
        <p>No hay informes disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Año</th>
            </tr>
          </thead>
          <tbody>
            {informes.map((informe) => (
              <tr key={informe.id_informesAC}>
                <td>{informe.id_informesAC}</td>
                <td>{new Date(informe.anio).getFullYear()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoInformesACDep;
