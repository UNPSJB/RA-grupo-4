import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const FiltradoInformeACDep = () => {
  const [docentes, setDocentes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [informes, setInformes] = useState([]);

  const [filtros, setFiltros] = useState({
    id_docente: "",
    id_materia: "",
    anio: "",
    id_carrera: "",
  });

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const [docRes, matRes, carRes] = await Promise.all([
          fetch(`${API_BASE}/docentes/todos`),
          fetch(`${API_BASE}/materias/todos`),
          fetch(`${API_BASE}/carreras/todos`),
        ]);

        if (!docRes.ok || !matRes.ok || !carRes.ok) {
          throw new Error("Error al obtener las listas.");
        }

        setDocentes(await docRes.json());
        setMaterias(await matRes.json());
        setCarreras(await carRes.json());
      } catch (err) {
        console.error(" Error cargando listados:", err);
        alert("No se pudieron cargar los listados.");
      }
    };

    fetchListas();
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const filtrarInformes = async () => {
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = `${API_BASE}/informesAC/filtradoInformesAc?${params.toString()}`;
      console.log("Solicitando:", url);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los informes");

      const data = await response.json();
      setInformes(data);
    } catch (err) {
      console.error("Error filtrando informes:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🔍 Filtrar Informes AC
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select name="id_docente" value={filtros.id_docente} onChange={handleChange} className="border p-2 rounded-lg">
          <option value="">Docente</option>
          {docentes.map((d) => (
            <option key={d.id_docente} value={d.id_docente}>
              {d.nombre}
            </option>
          ))}
        </select>

        <select name="id_materia" value={filtros.id_materia} onChange={handleChange} className="border p-2 rounded-lg">
          <option value="">Materia</option>
          {materias.map((m) => (
            <option key={m.id_materia} value={m.id_materia}>
              {m.nombre}
            </option>
          ))}
        </select>

        <select name="id_carrera" value={filtros.id_carrera} onChange={handleChange} className="border p-2 rounded-lg">
          <option value="">Carrera</option>
          {carreras.map((c) => (
            <option key={c.id_carrera} value={c.id_carrera}>
              {c.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="anio"
          placeholder="Año"
          value={filtros.anio}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />
      </div>

      <button
        onClick={filtrarInformes}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
      >
        Filtrar
      </button>

      <div className="mt-6">
        {informes.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Año</th>
                <th className="p-2">Docente</th>
                <th className="p-2">Materia</th>
                <th className="p-2">Carrera</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((inf) => (
                <tr key={inf.id_informesAC} className="border-b">
                  <td className="p-2">{inf.id_informesAC}</td>
                  <td className="p-2">{inf.anio}</td>
                  <td className="p-2">{inf.id_docente}</td>
                  <td className="p-2">{inf.id_materia}</td>
                  <td className="p-2">{inf.id_carrera}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No se encontraron informes.</p>
        )}
      </div>
    </div>
  );
};

export default FiltradoInformeACDep;
