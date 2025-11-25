import React, { useState } from "react";

interface CabeceraData {
  periodo: string;
  sede: string;
  integrantes: string;
}
interface Props {
  onCabeceraChange: (data: CabeceraData) => void;
  nombreDepartamento: string;
  textoPeriodo: string;
}

const CompletarDatosCabeceraDep: React.FC<Props> = ({
  onCabeceraChange,
  nombreDepartamento,
  textoPeriodo
}) => {

  const [formData, setFormData] = useState({
    periodo: textoPeriodo,   // ⬅ se inicializa con textoPeriodo
    sede: "",
    integrantes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onCabeceraChange(newData);
  };

  return (
    <div className="header-form-wrapper">
      <style>{`
        :root {
          --hf-primary: #003366;
          --hf-highlight: #0078D4;
          --hf-header-light: #5bc0de;
          --hf-header-accent: #9edcff;
          --hf-bg-input: #cce4f6;
          --hf-border: #ccc;
        }

        .header-form-wrapper {
          font-family: "Segoe UI", "Roboto", sans-serif;
          max-width: 1150px;
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
          color: var(--hf-primary);
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
          font-weight: 500;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--hf-highlight);
          background-color: #e0f0ff;
          box-shadow: 0 0 0 4px rgba(0, 120, 212, 0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="form-card">
        <div className="form-body">

          {/* --------------- Departamento (Solo lectura) --------------- */}
          <div className="form-group full-width">
            <label className="form-label">
              Departamento / Comisión Asesora
            </label>
            <input
              type="text"
              className="form-input"
              value={nombreDepartamento}
              readOnly
              style={{ fontWeight: "600", backgroundColor: "#e0f0ff" }}
            />
          </div>

          {/* ------------------ Ciclo lectivo (Solo lectura) ------------------ */}
          <div className="form-group">
            <label className="form-label" htmlFor="periodo">
              Ciclo Lectivo Evaluado
            </label>
            <input
              id="periodo"
              name="periodo"
              type="text"
              className="form-input"
              value={textoPeriodo}
              readOnly
              style={{ fontWeight: "600", backgroundColor: "#e0f0ff" }}
            />
          </div>

          {/* ----------------------------- Sede ----------------------------- */}
          <div className="form-group">
            <label className="form-label" htmlFor="sede">Sede</label>
            <select
              id="sede"
              name="sede"
              className="form-select"
              value={formData.sede}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione Sede</option>
              <option value="Trelew">Trelew</option>
              <option value="Esquel">Esquel</option>
              <option value="Puerto Madryn">Puerto Madryn</option>
              <option value="Comodoro Rivadavia">Comodoro Rivadavia</option>
            </select>
          </div>

          {/* ------------------------- Integrantes ------------------------- */}
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
