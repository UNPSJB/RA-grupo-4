import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

const ResumenSecciones: React.FC<Props> = ({ idInforme }) => {
    const [informe, setInforme] = useState<InformeAC | null>(null);
    const [comentario, setComentario] = useState<string>("");

    useEffect(() => {
        fetch(`/api/informesAC/${idInforme}`)
            .then(res => res.json())
            .then(data => {
                setInforme(data);
                setComentario(data.opinionSobreResumen || "");
            });
    }, [idInforme]);

    const guardarComentario = async () => {
        if (!informe) return;

        await fetch(`/api/informesAC/${idInforme}/opinion`, {
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

            {/* Gráficos de Secciones */}
            {informe.resumenSecciones.map(seccion => (
                <div key={seccion.id} className="p-4 border rounded-md bg-white">
                    <h3 className="font-semibold mb-2">{seccion.nombre}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={Object.entries(seccion.porcentajes_opciones).map(([opcion, porcentaje]) => ({ opcion, porcentaje }))}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <XAxis dataKey="opcion" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="porcentaje" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
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

export default ResumenSecciones;
