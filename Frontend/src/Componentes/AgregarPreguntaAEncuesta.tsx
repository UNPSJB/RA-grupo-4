
import React, { useState } from "react";

interface Opcion {
  descripcion: string;
}

interface PreguntaCreate {
  enunciado: string;
  tipo: "ABIERTA" | "CERRADA";
  obligatoria: boolean;
  opciones_respuestas?: Opcion[];
}

interface AgregarPreguntaAEncuestaProps {
  idEncuesta: number;
}

const AgregarPreguntaAEncuesta: React.FC<AgregarPreguntaAEncuestaProps> = ({ idEncuesta }) => {
  const [enunciado, setEnunciado] = useState("");
  const [tipo, setTipo] = useState<"ABIERTA" | "CERRADA">("ABIERTA");
  const [obligatoria, setObligatoria] = useState(false);
  const [opciones, setOpciones] = useState<string[]>([""]);
  const [mensaje, setMensaje] = useState("");

  const handleOpcionChange = (index: number, valor: string) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = valor;
    setOpciones(nuevasOpciones);
  };

  const agregarOpcion = () => setOpciones([...opciones, ""]);
  const quitarOpcion = (index: number) =>
    setOpciones(opciones.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pregunta: PreguntaCreate = {
      enunciado,
      tipo,
      obligatoria,
      opciones_respuestas:
        tipo === "CERRADA"
          ? opciones.filter((o) => o.trim() !== "").map((o) => ({ descripcion: o }))
          : [],
    };

    try {
      const res = await fetch(
        `http://localhost:8000/encuestas/${idEncuesta}/preguntas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pregunta),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setMensaje(`Error: ${JSON.stringify(errorData.detail)}`);
        return;
      }

      setMensaje("Pregunta agregada correctamente");
      setEnunciado("");
      setTipo("ABIERTA");
      setObligatoria(false);
      setOpciones([""]);
    } catch (error) {
      setMensaje(`Error: ${error}`);
    }
  };

  return (
    <div className="agregar-pregunta">
      <h2>Agregar Pregunta a Encuesta {idEncuesta}</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enunciado:</label>
          <input
            type="text"
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as "ABIERTA" | "CERRADA")}>
            <option value="ABIERTA">Abierta</option>
            <option value="CERRADA">Cerrada</option>
          </select>
        </div>
        <div>
          <label>Obligatoria:</label>
          <input
            type="checkbox"
            checked={obligatoria}
            onChange={(e) => setObligatoria(e.target.checked)}
          />
        </div>
        {tipo === "CERRADA" && (
          <div>
            <label>Opciones:</label>
            {opciones.map((opcion, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={opcion}
                  onChange={(e) => handleOpcionChange(index, e.target.value)}
                  required
                />
                <button type="button" onClick={() => quitarOpcion(index)}>
                  Quitar
                </button>
              </div>
            ))}
            <button type="button" onClick={agregarOpcion}>
              Agregar Opción
            </button>
          </div>
        )}
        <button type="submit">Agregar Pregunta</button>
      </form>
    </div>
  );
};

export default AgregarPreguntaAEncuesta;
