import React, { useState, useEffect } from "react";

interface Departamento {
  id: number;
  nombre: string;
}

interface Props {
  onDepartamentoSeleccionado?: (id: number) => void;
}

const API_BASE = "http://localhost:8000";

const CompletarDatosCabeceraDep: React.FC<Props> = ({
  onDepartamentoSeleccionado,
}) => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<number>(0);
  const [formData, setFormData] = useState({
    periodo: "",
    sede: "",
    integrantes: "",
  });

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const res = await fetch(`${API_BASE}/departamentos/`);
        if (!res.ok) throw new Error("Error al obtener departamentos");
        const data = await res.json();
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
    if (name === "departamento_id") {
      const id = Number(value);
      setDepartamentoSeleccionado(id);
      onDepartamentoSeleccionado && onDepartamentoSeleccionado(id);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="header-form-wrapper">
      <style>{`
        :root {
          /* Aplicando la nueva paleta */
          --hf-primary: #003366;    /* Azul Marino Institucional */
          --hf-highlight: #0078D4;  /* Azul de Acción (Focus/Botones) */
          --hf-bg-input: #cce4f6;   /* Fondo celeste para inputs */
          --hf-border: #ccc;        /* Borde gris neutro */
          --hf-text: #111;          /* Texto principal casi negro */
        }

        .header-form-wrapper {
          font-family: "Segoe UI", "Roboto", sans-serif;
          max-width: 900px;
          margin: 0 auto 30px;
          animation: slideDown 0.5s ease-out;
        }

        .form-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 20px -4px rgba(0, 51, 102, 0.1);
          border: 1px solid var(--hf-border);
          overflow: hidden;
        }

        /* Header Visual del Formulario con gradiente de la paleta */
        .form-header-strip {
          background: linear-gradient(135deg, var(--hf-primary), var(--hf-highlight));
          padding: 15px 25px;
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .form-icon {
          font-size: 1.8rem;
          opacity: 0.9;
        }
        /* Icono de documento simple con CSS para no depender de emojis si no quieres */
        .form-icon::before {
            content: '📄';
            filter: brightness(0) invert(1); /* Lo vuelve blanco */
        }
        
        .form-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .form-body {
          padding: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr; 
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--hf-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--hf-border);
          background-color: var(--hf-bg-input);
          color: var(--hf-text);
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box; /* Asegura que el padding no rompa el ancho */
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--hf-highlight);
          background-color: #fff;
          box-shadow: 0 0 0 4px rgba(0, 120, 212, 0.15); /* Usando el color highlight con transparencia */
        }
        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .required-mark {
          color: #e53e3e;
          margin-left: 4px;
        }

        @keyframes slideDown { from { opacity: 0; transform: translateY(-15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="form-card">
        <div className="form-header-strip">
          <div className="form-icon"></div>
          <h2 className="form-title">Informe Sintetico</h2>
        </div>

        <div className="form-body">
          {/* Fila 1: Departamento */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="departamento_id">
              Departamento / Comision Asesora <span className="required-mark">*</span>
            </label>
            <select
              id="departamento_id"
              name="departamento_id"
              className="form-select"
              value={departamentoSeleccionado}
              onChange={handleChange}
              required
              style={{ fontWeight: '600', color: departamentoSeleccionado ? 'var(--hf-primary)' : '#555' }}
            >
              <option value={0}> Seleccione Departamento Academico </option>
              {departamentos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fila 2: Ciclo y Sede */}
          <div className="form-group">
            <label className="form-label" htmlFor="periodo">
              Ciclo Lectivo Evaluado
            </label>
            <input
              id="periodo"
              name="periodo"
              type="text"
              className="form-input"
              value={formData.periodo}
              onChange={handleChange}
              placeholder="Ej: 2025"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sede">
              Sede
            </label>
            <select
              id="sede"
              name="sede"
              className="form-select"
              value={formData.sede}
              onChange={handleChange}
            >
              <option value=""> Seleccione Sede </option>
              <option value="Trelew">Trelew</option>
              <option value="Esquel">Esquel</option>
              <option value="Puerto Madryn">Puerto Madryn</option>
              <option value="Comodoro Rivadavia">Comodoro Rivadavia</option>
            </select>
          </div>

          {/* Fila 3: Integrantes */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="integrantes">
              Integrantes de la Comisión
            </label>
            <textarea
              id="integrantes"
              name="integrantes"
              className="form-textarea"
              value={formData.integrantes}
              onChange={handleChange}
              rows={3}
              placeholder="Ingrese los nombres de los docentes participantes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletarDatosCabeceraDep;