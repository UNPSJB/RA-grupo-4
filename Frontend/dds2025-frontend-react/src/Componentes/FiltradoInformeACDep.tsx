import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Docente {
  id_docente: number;
  nombre: string;
}
interface Materia {
  id_materia: number;
  nombre: string;
  anio: string;
}
interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
}

const FiltradoInformeACDep = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [informes, setInformes] = useState<InformeAC[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busquedaActiva, setBusquedaActiva] = useState(false);

  const [filtros, setFiltros] = useState({
    id_docente: "",
    id_materia: "",
    anio: "",
  });

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const [docRes, matRes] = await Promise.all([
          fetch(`${API_BASE}/docentes/listar`),
          fetch(`${API_BASE}/materias/listar`),
        ]);

        if (!docRes.ok || !matRes.ok) {
          throw new Error("Error al obtener las listas.");
        }

        setDocentes(await docRes.json());
        setMaterias(await matRes.json());
      } catch (err) {
        console.error("Error cargando listados:", err);
        alert("No se pudieron cargar los listados.");
      }
    };

    fetchListas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const filtrarInformes = async () => {
    const { id_docente, id_materia, anio } = filtros;

    if (!id_docente && !id_materia && !anio) {
      setInformes([]);
      setBusquedaActiva(false);
      return;
    }

    try {
      const params = new URLSearchParams();

      let materiasFiltradas = materias;
      if (anio) {
        materiasFiltradas = materias.filter((m) => m.anio === anio);
      }

      if (id_materia) {
        params.append("id_materia", id_materia);
      } else if (anio) {
        materiasFiltradas.forEach((m) => {
          params.append("id_materia", m.id_materia);
        });
      }

      if (id_docente) params.append("id_docente", id_docente);

      const url = `${API_BASE}/informesAC/filtradoInformesAc?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los informes");

      const data = await response.json();
      setInformes(data);
      setBusquedaActiva(true);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error filtrando informes:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '28px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
      animation: 'fadeIn 0.6s ease-in-out',
    },
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#003366',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    field: {
      height: '60px',
      padding: '10px 14px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '15px',
      backgroundColor: '#cce4f6',
      color: '#111',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
      boxSizing: 'border-box',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0078D4',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '32px',
      fontFamily: '"Segoe UI", "Roboto", sans-serif',
    },
    th: {
      backgroundColor: '#e6f2ff',
      color: '#003366',
      padding: '12px',
      textAlign: 'left' as const,
      fontWeight: 'bold',
      borderBottom: '2px solid #ccc',
      fontSize: '15px',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '14px',
      color: '#000',
      height: '60px',
      verticalAlign: 'middle' as const,
    },
    rowAlt: {
      backgroundColor: '#f9f9f9',
    },
    rowBase: {
      backgroundColor: '#ffffff',
    },
    noResults: {
      fontSize: '15px',
      color: '#666',
      marginTop: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <h2 style={styles.title}>Filtrar Informes AC</h2>

      <div style={styles.grid}>
        <select name="id_docente" value={filtros.id_docente} onChange={handleChange} style={styles.field}>
          <option value="">Docente</option>
          {docentes.map((d) => (
            <option key={d.id_docente} value={d.id_docente}>{d.nombre}</option>
          ))}
        </select>

        <select name="id_materia" value={filtros.id_materia} onChange={handleChange} style={styles.field}>
          <option value="">Materia</option>
          {materias.map((m) => (
            <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          name="anio"
          placeholder="Año"
          value={filtros.anio}
          onChange={handleChange}
          style={styles.field}
        />
      </div>

      <button onClick={filtrarInformes} style={styles.button}>Filtrar</button>

      {busquedaActiva && (
        informes.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Año</th>
                <th style={styles.th}>Materia</th>
                <th style={styles.th}>Docente</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((inf, index) => (
                <tr key={inf.id_informesAC} style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}>
                  <td style={styles.td}>{inf.id_informesAC}</td>
                  <td style={styles.td}>{inf.materia.anio}</td>
                  <td style={styles.td}>{inf.materia.nombre}</td>
                  <td style={styles.td}>{inf.docente.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noResults}>No se encontraron informes.</p>
        )
      )}
    </div>
  );
};

export default FiltradoInformeACDep;
