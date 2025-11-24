import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";

interface PendienteSintetico {
    id: number;
    ciclo_lectivo: number;
    cuatrimestre: string;
    cantidad_informes_esperados: number;
    cantidad_informes_recibidos: number;
}

interface Props {
    departamentoId: number;
}

const InformesSinteticosPendientes: React.FC<Props> = ({ departamentoId }) => {
    const [pendientes, setPendientes] = useState<PendienteSintetico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPendientes = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/departamentos/${departamentoId}/informes-sinteticos/pendientes`
                );

                if (!res.ok) {
                    throw new Error(`Error ${res.status}`);
                }

                const data = await res.json();
                setPendientes(data);
            } catch (err) {
                console.error("Error al obtener pendientes", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendientes();
    }, [departamentoId]);

    if (loading) return <p>Cargando pendientes...</p>;

    return (
        <div className="tabla-pendientes-container">

            {pendientes.length === 0 ? (
                <div className="empty-list-message">
                    No hay tareas pendientes para el departamento.
                </div>
            ) : (
                <table className="tabla-pendientes">
                    <thead>
                        <tr>
                            <th>Informes Sintéticos</th>
                            <th><center>Inf. Actividad Curricular total</center></th>
                            <th><center>Inf. Actividad Curricular recibidos</center></th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pendientes.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <strong>Informe {p.ciclo_lectivo} – {p.cuatrimestre}</strong>
                                </td>

                                <td><center>{p.cantidad_informes_esperados}</center></td>

                                <td><center>{p.cantidad_informes_recibidos}</center></td>

                                <td>
                                    <Link
                                        to={`generar-informe-sintetico?periodoId=${p.id}`}
                                        className="btn-action-table"
                                    >
                                        Generar Informe Sintetico <Send size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
};

export default InformesSinteticosPendientes;
