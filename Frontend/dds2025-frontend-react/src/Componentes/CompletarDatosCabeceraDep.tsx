import React, { useState, useEffect } from "react";

interface Departamento {
  id: number;
  nombre: string;
}

interface InformeSinteticoCreate {
  periodo: string;
  sede: string;
  integrantes: string;
  departamento_id: number;
}

interface Props {
  onSubmitSuccess?: () => void;
}

const API_BASE = "http://localhost:8000";

const fadeIn = {
  animation: "fadeIn 0.6s ease-in-out",
};

const sharedFieldStyle: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
  fontFamily: '"Roboto", "Segoe UI", sans-serif',
  backgroundColor: "#cce4f6",
  color: "#111",
  transition: "all 0.3s ease",
  outline: "none",
  boxSizing: "border-box",
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "28px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontFamily: '"Roboto", "Segoe UI", sans-serif',
  },
  row: {
    display: "flex",
    flexDirection: "column" as const,
    marginBottom: "14px",
  },
  label: {
    fontWeight: 600,
    marginBottom: "6px",
    color: "#000000",
    fontSize: "16px",
  },
  mensaje: {
    fontSize: "15px",
    color: "#666",
    textAlign: "center" as const,
    marginTop: "20px",
  },
};

const CompletarDatosCabeceraDep: React.FC<Props> = ({ onSubmitSuccess }) => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [formData, setFormData] = useState<InformeSinteticoCreate>({
    periodo: "",
    sede: "",
    integrantes: "",
    departamento_id: 0,
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const res = await fetch(`${API_BASE}/departamentos/`);
        if (!res.ok) throw new Error("Error al obtener departamentos");
        const data = await res.json();
        console.log("Departamentos cargados:", data); 
        setDepartamentos(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);
      }
    };
    cargarDepartamentos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const res = await fetch(`${API_BASE}/informes-sinteticos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar el informe sintético");

      setMensaje("Datos de cabecera guardados correctamente");
      setFormData({
        periodo: "",
        sede: "",
        integrantes: "",
        departamento_id: 0,
      });
      onSubmitSuccess && onSubmitSuccess();
    } catch (error) {
      console.error(error);
      setMensaje("Error al guardar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          select:focus, input:focus, textarea:focus {
            border-color: #0078D4;
            box-shadow: 0 0 0 2px rgba(0,120,212,0.2);
          }
          select:hover, input:hover, textarea:hover {
            border-color: #0078D4;
          }
        `}
      </style>

      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "24px", color: "#333" }}>
        Completar Datos de Cabecera del Informe Sintético
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ ...styles.row, ...fadeIn }}>
          <label style={styles.label} htmlFor="periodo">
            Ciclo Lectivo y/o cuatrimestre evaluado:
          </label>
          <input
            id="periodo"
            name="periodo"
            type="text"
            value={formData.periodo}
            onChange={handleChange}
            required
            style={sharedFieldStyle}
          />
        </div>

        <div style={{ ...styles.row, ...fadeIn }}>
          <label style={styles.label} htmlFor="departamento_id">
            Comisión Asesora de Carrera o Departamental correspondiente a:
          </label>
          <select
            id="departamento_id"
            name="departamento_id"
            value={formData.departamento_id}
            onChange={handleChange}
            required
            style={sharedFieldStyle}
          >
            <option value={0}>Seleccione una opción</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.row, ...fadeIn }}>
          <label style={styles.label} htmlFor="sede">Sede:</label>
          <select
            id="sede"
            name="sede"
            value={formData.sede}
            onChange={handleChange}
            required
            style={sharedFieldStyle}
          >
            <option value="">Seleccione una sede</option>
            <option value="Trelew">Trelew</option>
            <option value="Esquel">Esquel</option>
            <option value="Puerto Madryn">Puerto Madryn</option>
            <option value="Comodoro Rivadavia">Comodoro Rivadavia</option>
          </select>
        </div>

        <div style={{ ...styles.row, ...fadeIn }}>
          <label style={styles.label} htmlFor="integrantes">Integrantes:</label>
          <textarea
            id="integrantes"
            name="integrantes"
            value={formData.integrantes}
            onChange={handleChange}
            rows={3}
            required
            style={{ ...sharedFieldStyle, resize: "none", height: "80px" }}
            placeholder="Ej: Carlos Buckle, Leonardo Ordinez, Francisco Páez..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#0078D4",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "none",
            padding: "14px 24px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          {loading ? "Guardando..." : "Guardar Cabecera"}
        </button>
      </form>

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
    </div>
  );
};

export default CompletarDatosCabeceraDep;
