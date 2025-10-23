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
        <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gray-50 rounded-2xl shadow">
            {/* Información de Materia y Docente */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                    {informe.materia.nombre} ({informe.materia.anio})
                </h2>
                <p className="text-gray-600">
                    <strong>Docente:</strong> {informe.docente.nombre}
                    {informe.docente.nroLegajo
                        ? ` (Legajo: ${informe.docente.nroLegajo})`
                        : ""}
                </p>
            </div>

            {/* Secciones */}
            <div className="space-y-6">
                {informe.resumenSecciones.map((seccion) => (
                    <div key={seccion.id} className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            {seccion.nombre}
                        </h3>
                        <div className="space-y-3">
                            {Object.entries(seccion.porcentajes_opciones).map(
                                ([opcion, porcentaje]) => (
                                    <div key={opcion}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700">
                                                {opcion}
                                            </span>
                                            <span className="text-gray-600">
                                                {porcentaje.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-700 ${
                                                    porcentaje > 60
                                                        ? "bg-green-500"
                                                        : porcentaje > 30
                                                        ? "bg-yellow-400"
                                                        : "bg-red-400"
                                                }`}
                                                style={{ width: `${porcentaje}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Comentario del docente */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Comentario sobre los valores
                </h3>
                <textarea
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows={4}
                />
                <button
                    onClick={guardarComentario}
                    className="mt-3 px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                    Guardar Comentario
                </button>
            </div>
        </div>
    );
};

// --- Componente intermedio (para uso con useParams) ---
export const ResumenSeccionesWrapper: React.FC = () => {
    const { idInforme } = useParams<{ idInforme: string }>();
    if (!idInforme) return <div className="text-center mt-6 text-gray-600">ID de informe no proporcionado</div>;
    return <ResumenSeccionesSinRecharts idInforme={parseInt(idInforme, 10)} />;
};
