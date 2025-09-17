import { useEffect, useState } from "react";

interface OpcionRespuesta {
  id?: number;
  descripcion: string;
}

interface Pregunta {
  id?: number;
  enunciado: string;
  tipo: "ABIERTA" | "CERRADA";
  obligatoria: boolean;
  opciones_respuestas?: OpcionRespuesta[];
}

interface AgregarPreguntaProps {
  encuestaId: number;
}

const AgregarPregunta: React.FC<AgregarPreguntaProps> = ({ encuestaId }) => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [enunciado, setEnunciado] = useState("");
  const [tipo, setTipo] = useState<"ABIERTA" | "CERRADA">("ABIERTA");
  const [obligatoria, setObligatoria] = useState(false);
  const [opciones, setOpciones] = useState<OpcionRespuesta[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar preguntas existentes
  useEffect(() => {
    async function fetchPreguntas() {
      try {
        const res = await fetch(`http://localhost:8000/encuestas/${encuestaId}`);
        const data = await res.json();
        setPreguntas(data.preguntas || []);
      } catch (err) {
        console.error("Error cargando preguntas:", err);
      }
    }
    fetchPreguntas();
  }, [encuestaId]);

  // Agregar una opción temporal
  const addOpcion = () => {
    setOpciones([...opciones, { descripcion: "" }]);
  };

  // Actualizar texto de opción
  const updateOpcion = (index: number, value: string) => {
    const newOpciones = [...opciones];
    newOpciones[index].descripcion = value;
    setOpciones(newOpciones);
  };

  // Eliminar opción
  const removeOpcion = (index: number) => {
    const newOpciones = opciones.filter((_, i) => i !== index);
    setOpciones(newOpciones);
  };

  // Agregar pregunta a la encuesta
  const handleAgregarPregunta = async () => {
    if (!enunciado.trim()) return;
    if (tipo === "CERRADA" && opciones.length === 0) {
      alert("Agregá al menos una opción para preguntas cerradas");
      return;
    }

    setLoading(true);
    try {
      const nuevaPregunta: Pregunta = {
        enunciado,
        tipo,
        obligatoria,
        opciones_respuestas: tipo === "CERRADA" ? opciones : [],
      };

      const res = await fetch(
        `http://localhost:8000/encuestas/${encuestaId}/preguntas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaPregunta),
        }
      );

      if (!res.ok) throw new Error("Error al crear pregunta");

      const data: Pregunta = await res.json();
      setPreguntas([...preguntas, data]);

      // Reset form
      setEnunciado("");
      setTipo("ABIERTA");
      setObligatoria(false);
      setOpciones([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Agregar Pregunta</h2>

      <input
        type="text"
        placeholder="Enunciado de la pregunta"
        value={enunciado}
        onChange={(e) => setEnunciado(e.target.value)}
      />

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as "ABIERTA" | "CERRADA")}
      >
        <option value="ABIERTA">Abierta</option>
        <option value="CERRADA">Cerrada</option>
      </select>

      <label>
        Obligatoria:
        <input
          type="checkbox"
          checked={obligatoria}
          onChange={(e) => setObligatoria(e.target.checked)}
        />
      </label>

      {tipo === "CERRADA" && (
        <div>
          <h4>Opciones de respuesta</h4>
          {opciones.map((opcion, i) => (
            <div key={i}>
              <input
                type="text"
                value={opcion.descripcion}
                onChange={(e) => updateOpcion(i, e.target.value)}
                placeholder={`Opción ${i + 1}`}
              />
              <button type="button" onClick={() => removeOpcion(i)}>
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addOpcion}>
            Agregar opción
          </button>
        </div>
      )}

      <button onClick={handleAgregarPregunta} disabled={loading}>
        {loading ? "Guardando..." : "Agregar Pregunta"}
      </button>

      <h3>Preguntas existentes</h3>
      <ul>
        {preguntas.map((p) => (
          <li key={p.id}>
            {p.enunciado} ({p.tipo}) {p.obligatoria ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgregarPregunta;
