import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// --- Tipos ---
interface SeccionResumen {
    id: number;
    nombre: string;
    porcentajes_opciones: Record<string, number>;
}

interface Docente {
    id_docente: number;
    nombre: string;
    nroLegajo: number;
}

interface Materia {
    id_materia: number;
    nombre: string;
    anio: number;
}

interface InformeAC {
    id_informesAC: number;
    docente: Docente;
    materia: Materia;
    resumenSecciones: SeccionResumen[];
    opinionSobreResumen?: string;
}

interface Props {
    idInforme: number;
}

// --- Componente principal ---
export const ResumenSeccionesSinRecharts: React.FC<Props> = ({ idInforme }) => {
    const [informe, setInforme] = useState<InformeAC | null>(null);
    const [comentario, setComentario] = useState<string>("");

    useEffect(() => {
        fetch(`http://localhost:8000/informesAC/${idInforme}`)
            .then(res => res.json())
            .then(data => {
                setInforme(data);
                setComentario(data.opinionSobreResumen || "");
            });
    }, [idInforme]);

    const guardarComentario = async () => {
        if (!informe) return;
        await fetch(`http://localhost:8000/informesAC/${idInforme}/opinion`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ opinion: comentario }),
        });
        setInforme({ ...informe, opinionSobreResumen: comentario });
    };

    if (!informe) return null;

    return (
        <div className="space-y-6">
            {/* Información de Materia y Docente */}
            <div className="p-4 border rounded-md bg-gray-50">
                <h2 className="text-xl font-bold">{informe.materia.nombre} ({informe.materia.anio})</h2>
                <p>Docente: {informe.docente.nombre} (Legajo: {informe.docente.nroLegajo})</p>
            </div>

            {/* "Gráficos" de Secciones */}
            {informe.resumenSecciones.map(seccion => (
                <div key={seccion.id} className="p-4 border rounded-md bg-white">
                    <h3 className="font-semibold mb-2">{seccion.nombre}</h3>
                    {Object.entries(seccion.porcentajes_opciones).map(([opcion, porcentaje]) => (
                        <div key={opcion} className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span>{opcion}</span>
                                <span>{porcentaje}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded">
                                <div className="h-4 bg-blue-600 rounded" style={{ width: `${porcentaje}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* Comentario del docente */}
            <div className="p-4 border rounded-md bg-white">
                <h3 className="font-semibold mb-2">Comentario sobre los valores</h3>
                <textarea
                    className="w-full border p-2 rounded-md"
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={4}
                />
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={guardarComentario}
                >
                    Guardar Comentario
                </button>
            </div>
        </div>
    );
};

// --- Componente intermedio para usar useParams ---
export const ResumenSeccionesWrapper: React.FC = () => {
    const { idInforme } = useParams<{ idInforme: string }>();
    if (!idInforme) return <div>ID de informe no proporcionado</div>;
    return <ResumenSeccionesSinRecharts idInforme={parseInt(idInforme, 10)} />;
};
