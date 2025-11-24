import React, { useState, useEffect } from "react";

interface Departamento {
  id: number;
  nombre: string;
}
interface CabeceraData {
  periodo: string;
  sede: string;
  integrantes: string;
}
interface Props {
  onDepartamentoSeleccionado?: (id: number) => void;
  onCabeceraChange: (data: CabeceraData) => void;
}

const API_BASE = "http://localhost:8000";

const CompletarDatosCabeceraDep: React.FC<Props> = ({
  onDepartamentoSeleccionado,
  onCabeceraChange,
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
      const newData = { ...formData, [name]: value };
      setFormData(newData);
      
      onCabeceraChange(newData);
    }
  };

  return (
    <div className="header-form-wrapper">
      <style>{`
        :root {
          /* Paleta Institucional */
          --hf-primary: #003366;    /* Azul Marino Institucional */
          --hf-highlight: #0078D4;  /* Azul de Acción (Focus) */
          /* Colores para el nuevo diseño */
          --hf-header-light: #5bc0de; /* Azul/Celeste más claro (Nuevo) */
          --hf-header-accent: #9edcff; /* Azul aún más claro para el degradado (Nuevo) */
          --hf-bg-input: #cce4f6;   /* Fondo celeste suave para inputs */
          --hf-border: #ccc;        /* Borde gris neutro */
        }

        .header-form-wrapper {
          font-family: "Segoe UI", "Roboto", sans-serif;
          max-width: 1150px; /* <--- MODIFICADO: Aumentado el ancho */
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

        /* Header Visual del Formulario con AZUL CLARO y TEXTO NEGRO */
        .form-header-strip {
          /* Aplicando azul más claro con degradado */
          background: linear-gradient(135deg, var(--hf-header-light), var(--hf-header-accent));
          padding: 15px 25px;
          /* Texto en negro */
          color: #000000; 
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 2px solid var(--hf-primary);
        }
        .form-icon {
          font-size: 1.8rem;
          opacity: 0.9;
        }
        /* Icono de documento simple (ELIMINADO el emoji) */
        .form-icon::before {
            content: '📋'; /* Reemplazo por un icono simple */
            font-size: 1.8rem;
            color: var(--hf-primary); /* Icono en color principal */
            filter: none;
        }
        
        .form-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          /* Texto del título en negro */
          color: #000000; 
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
          color: var(--hf-primary); /* Texto de inputs en color principal */
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
          font-weight: 500;
        }

        /* Solucionando color de select al seleccionar */
        .form-select option {
            color: var(--hf-primary); /* Asegura que las opciones sean azules */
        }
        /* Mantiene el color del texto del select claro antes de seleccionar */
        .form-select:not([value=""]):required {
            color: var(--hf-primary);
        }
        
        /* 💡 ESTILO MODIFICADO PARA MANTENER EL FONDO CELESTE EN FOCUS */
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--hf-highlight);
          background-color: #e0f0ff; /* <-- Cambiado de #fff a un celeste muy claro */
          box-shadow: 0 0 0 4px rgba(0, 120, 212, 0.15);
        }
        /* ---------------------------------------------------------------------- */

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
        <div className="form-body">
          {/* Fila 1: Departamento */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="departamento_id">
              Departamento / Comisión Asesora <span className="required-mark">*</span>
            </label>
            <select
              id="departamento_id"
              name="departamento_id"
              className="form-select"
              value={departamentoSeleccionado}
              onChange={handleChange}
              required
              style={{ fontWeight: '600' }} 
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
              required 
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