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
          fetch(`${API_BASE}/docentes/listar`),
          fetch(`${API_BASE}/materias/listar`),
          fetch(`${API_BASE}/carreras/listar`),
        ]);

        if (!docRes.ok || !matRes.ok || !carRes.ok) {
          throw new Error("Error al obtener las listas.");
        }

        setDocentes(await docRes.json());
        setMaterias(await matRes.json());
        setCarreras(await carRes.json());
      } catch (err) {
        console.error("Error cargando listados:", err);
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

      // Filtrar materias por año si se ingresó
      let materiasFiltradas = materias;
      if (filtros.anio) {
        materiasFiltradas = materias.filter(
          (m) => m.anio === parseInt(filtros.anio)
        );
      }

      // Si se seleccionó una materia específica, usar solo esa
      if (filtros.id_materia) {
        params.append("id_materia", filtros.id_materia);
      } else if (filtros.anio) {
        // Si no se seleccionó materia pero sí año, usar todas las materias de ese año
        materiasFiltradas.forEach((m) => {
          params.append("id_materia", m.id_materia);
        });
      }

      if (filtros.id_docente) params.append("id_docente", filtros.id_docente);
      if (filtros.id_carrera) params.append("id_carrera", filtros.id_carrera);

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

  const listarTodosLosInformes = async () => {
    try {
      const response = await fetch(`${API_BASE}/informesAC/listar`);
      if (!response.ok) throw new Error("Error al obtener los informes");

      const data = await response.json();
      setInformes(data);
    } catch (err) {
      console.error("Error listando informes:", err);
      alert("No se pudo obtener el listado completo.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🔍 Filtrar Informes AC
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select
          name="id_docente"
          value={filtros.id_docente}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">Docente</option>
          {docentes.map((d) => (
            <option key={d.id_docente} value={d.id_docente}>
              {d.nombre}
            </option>
          ))}
        </select>

        <select
          name="id_materia"
          value={filtros.id_materia}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">Materia</option>
          {materias.map((m) => (
            <option key={m.id_materia} value={m.id_materia}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* <select
          name="id_carrera"
          value={filtros.id_carrera}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">Carrera</option>
          {carreras.map((c) => (
            <option key={c.id_carrera} value={c.id_carrera}>
              {c.nombre}
            </option>
          ))}
        </select> */}

        <input
          type="number"
          name="anio"
          placeholder="Año"
          value={filtros.anio}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={filtrarInformes}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Filtrar
        </button>

      </div>

      <div className="mt-6">
        {informes.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Docente</th>
                <th className="p-2">Materia</th>
                <th className="p-2">Año</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((inf) => (
                <tr key={inf.id_informesAC} className="border-b">
                  <td className="p-2">{inf.docente?.nombre ?? "Sin docente"}</td>
                  <td className="p-2">{inf.materia?.nombre ?? "Sin materia"}</td>
                  <td className="p-2">{inf.materia?.anio ?? "Sin año"}</td>
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
