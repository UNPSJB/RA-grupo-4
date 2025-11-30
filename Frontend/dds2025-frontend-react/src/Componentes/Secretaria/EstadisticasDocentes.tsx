import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechTooltip,
    ResponsiveContainer,
} from "recharts";

/* ---------- Tipos ---------- */
interface ValoracionPeriodo {
    periodo: string;
    promedio: number | null;
    totalMaterias: number;
    valores: Record<string, number>;
}

interface DocenteEstadistica {
    id_docente: number;
    nombre: string;
    nroLegajo: number;
    cantidadMateriasDictadas: number;
    primerPeriodoDictado?: string | null;
    ultimoPeriodoDictado?: string | null;
    promedioUltimoPeriodo?: number | null;
    promedioGeneral?: number | null;
    promedioPeriodos: ValoracionPeriodo[];
}

const formatPromedio = (v?: number | null) =>
    typeof v === "number" ? `${v.toFixed(2)} / 4.00` : "-";

const EstadisticasPromedioDocentes: React.FC = () => {
    const [lista, setLista] = useState<DocenteEstadistica[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [query, setQuery] = useState<string>("");

    const [sortBy, setSortBy] = useState<string>("nombre");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/docentes/estadisticas");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as DocenteEstadistica[];
            setLista(Array.isArray(data) ? data : []);
        } catch (e: any) {
            setError(e.message);
            setLista([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const processed = useMemo(() => {
        let arr = lista.slice();

        if (query.trim()) {
            const q = query.trim().toLowerCase();
            arr = arr.filter(
                (d) =>
                    d.nombre.toLowerCase().includes(q) ||
                    String(d.nroLegajo).includes(q)
            );
        }

        arr.sort((a, b) => {
            let va: any, vb: any;

            switch (sortBy) {
                case "nombre":
                    va = a.nombre.toLowerCase();
                    vb = b.nombre.toLowerCase();
                    break;
                case "legajo":
                    va = a.nroLegajo;
                    vb = b.nroLegajo;
                    break;
                case "materias":
                    va = a.cantidadMateriasDictadas;
                    vb = b.cantidadMateriasDictadas;
                    break;
                case "primer":
                    va = a.primerPeriodoDictado ?? "";
                    vb = b.primerPeriodoDictado ?? "";
                    break;
                case "ultimo":
                    va = a.ultimoPeriodoDictado ?? "";
                    vb = b.ultimoPeriodoDictado ?? "";
                    break;
                case "promUltimo":
                    va = a.promedioUltimoPeriodo ?? -Infinity;
                    vb = b.promedioUltimoPeriodo ?? -Infinity;
                    break;
                case "promGeneral":
                    va = a.promedioGeneral ?? -Infinity;
                    vb = b.promedioGeneral ?? -Infinity;
                    break;
                default:
                    va = a.nombre.toLowerCase();
                    vb = b.nombre.toLowerCase();
            }

            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return arr;
    }, [lista, query, sortBy, sortDir]);

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortDir((s) => (s === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDir("asc");
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId((curr) => (curr === id ? null : id));
    };

    return (
        <div
            style={{
                maxWidth: 1300,
                margin: "20px auto",
                background: "#fff",
                padding: 20,
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                fontFamily: '"Segoe UI", Roboto, sans-serif',
            }}
        >
            <h2 style={{ margin: 0, color: "#003366" }}>Estadísticas de Docentes</h2>

            <p style={{ marginTop: 6, color: "#555", lineHeight: 1.4 }}>
                Analiza la evolución de la valoracion promedio de cada docente a lo largo de los distintos períodos evaluados.<br />
                Los promedios se calculan en una escala de <strong>1.00 a 4.00</strong>, correspondiente a las opciones de valoración utilizadas en las encuestas:
                <br />
                1 — Malo, No Satisfactorio<br />
                2 — Regular, Poco Satisfactorio<br />
                3 — Bueno, Satisfactorio<br />
                4 — Muy Bueno, Muy Satisfactorio.
            </p>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 16,
                    marginBottom: 22,
                    background: "#f5f8ff",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #d9e6ff",
                }}
            >
                <input
                    placeholder="Buscar por nombre o legajo..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #b9cef5",
                        minWidth: 260,
                        background: "#eef4ff",
                        fontWeight: "bold",
                        color: "#003366"
                    }}
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p style={{ color: "crimson" }}>{error}</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#eaf4ff" }}>
                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("nombre")}>
                                    Docente{" "}
                                    {sortBy === "nombre" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("legajo")}>
                                    Legajo{" "}
                                    {sortBy === "legajo" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("materias")}>
                                    Materias{" "}
                                    {sortBy === "materias" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("primer")}>
                                    Primer período Dictado{" "}
                                    {sortBy === "primer" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("ultimo")}>
                                    Último período Dictado{" "}
                                    {sortBy === "ultimo" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button style={thBtn} onClick={() => toggleSort("promUltimo")}>
                                    Promedio Último Periodo Dictado{" "}
                                    {sortBy === "promUltimo"
                                        ? sortDir === "asc"
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </button>
                            </th>

                            <th style={th}>
                                <button
                                    style={thBtn}
                                    onClick={() => toggleSort("promGeneral")}
                                >
                                    Promedio General{" "}
                                    {sortBy === "promGeneral"
                                        ? sortDir === "asc"
                                            ? "▲"
                                            : "▼"
                                        : ""}
                                </button>
                            </th>

                            <th style={th}>Gráfico</th>
                        </tr>
                    </thead>

                    <tbody>
                        {processed.map((d) => (
                            <React.Fragment key={d.id_docente}>
                                <tr style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={td}>{d.nombre}</td>
                                    <td style={td}>{d.nroLegajo}</td>
                                    <td style={{ ...td, textAlign: "center" }}>
                                        {d.cantidadMateriasDictadas}
                                    </td>
                                    <td style={td}>{d.primerPeriodoDictado ?? "-"}</td>
                                    <td style={td}>{d.ultimoPeriodoDictado ?? "-"}</td>
                                    <td style={{ ...td, textAlign: "center" }}>
                                        {formatPromedio(d.promedioUltimoPeriodo)}
                                    </td>
                                    <td style={{ ...td, textAlign: "center" }}>
                                        {formatPromedio(d.promedioGeneral)}
                                    </td>
                                    <td style={{ ...td, textAlign: "center" }}>
                                        <button
                                            onClick={() => toggleExpand(d.id_docente)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: 20,
                                                color: "#003366",
                                            }}
                                        >
                                            {expandedId === d.id_docente ? "▲" : "▼"}
                                        </button>
                                    </td>
                                </tr>

                                {expandedId === d.id_docente && (
                                    <tr>
                                        <td colSpan={8} style={{ background: "#fafcff", padding: 20 }}>
                                            <h4 style={{ marginTop: 0 }}>Evolución de Promedios</h4>

                                            {/* Contenedor scrolleable */}
                                            <div
                                                style={{
                                                    width: "100%",
                                                    overflowX: "auto",
                                                    overflowY: "hidden",
                                                    paddingBottom: 10,
                                                }}
                                            >
                                                {/* Ajustar ancho del grafico  y espacio entre periodos */}
                                                <div style={{ width: Math.max(500, d.promedioPeriodos.length * 100) }}>
                                                    <ResponsiveContainer width="100%" height={300}>
                                                        <LineChart
                                                            data={d.promedioPeriodos.map((p) => ({
                                                                periodo: p.periodo,
                                                                promedio: p.promedio,
                                                                valores: p.valores,
                                                                totalMaterias: p.totalMaterias,
                                                            }))}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="periodo" />
                                                            <YAxis domain={[1, 4]} />

                                                            <RechTooltip
                                                                content={({ active, payload, label }) => {
                                                                    if (!active || !payload?.length) return null;
                                                                    const p = payload[0].payload;

                                                                    return (
                                                                        <div
                                                                            style={{
                                                                                background: "white",
                                                                                border: "1px solid #ccc",
                                                                                padding: 10,
                                                                                borderRadius: 8,
                                                                                fontSize: 13,
                                                                            }}
                                                                        >
                                                                            <strong>{label}</strong>
                                                                            <br />
                                                                            Promedio:{" "}
                                                                            {p.promedio ? `${p.promedio.toFixed(2)} / 4.00` : "-"}
                                                                            <br />
                                                                            Materias dictadas: {p.totalMaterias}
                                                                            <hr />
                                                                            {Object.entries(p.valores).map(([k, v]) => (
                                                                                <div key={k}>
                                                                                    {k}: {v}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    );
                                                                }}
                                                            />

                                                            <Line
                                                                type="monotone"
                                                                dataKey="promedio"
                                                                stroke="#0078D4"
                                                                strokeWidth={2}
                                                                dot={{ r: 4 }}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

/* ---- estilos ---- */
const th: React.CSSProperties = {
    padding: "10px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "1px solid #dfefff",
    color: "#003366",
};

const thBtn: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    color: "#003366",
};

const td: React.CSSProperties = {
    padding: "10px",
    textAlign: "center",
};

export default EstadisticasPromedioDocentes;
