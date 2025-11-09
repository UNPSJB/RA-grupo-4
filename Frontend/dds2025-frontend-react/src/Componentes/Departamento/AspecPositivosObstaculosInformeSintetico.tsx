import React, { useEffect, useState } from "react";

// --- Interfaces ---
interface InformeACParaInformeSintetico {
    id_informeAC: number;
    codigoMateria: string;
    nombreMateria: string;
    aspectosPositivosEnsenianza: string;
    aspectosPositivosAprendizaje: string;
    ObstaculosEnsenianza: string;
    obstaculosAprendizaje: string;
    estrategiasAImplementar: string;
}

interface Props {
    departamentoId: number;
    anio: number;
}

// --- Paleta Institucional ---
const COLOR_PRIMARIO = "#003366";
const COLOR_ACCION = "#007bff";
const COLOR_FONDO_CLARO = "#f9f9f9";
const COLOR_FONDO_BLANCO = "#ffffff";
const COLOR_EXITO_TEXTO = "#1e7e34";
const COLOR_EXITO_FONDO = "#d4edda";
const COLOR_PELIGRO_TEXTO = "#c82333";
const COLOR_PELIGRO_FONDO = "#f8d7da";

// --- Info Box ---
interface TextBoxProps {
    content: string;
    borderColor: string;
}

const InfoTextBox: React.FC<TextBoxProps> = ({ content, borderColor }) => (
    <div style={{ ...customStyles.infoBox, borderColor }}>
        <p style={customStyles.infoContent}>
            {content || "No se ha proporcionado información en este campo del informe."}
        </p>
    </div>
);

// --- Skeleton ---
const skeletonKeyframes = `
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
`;

const SkeletonCard = () => (
    <>
        <style>{skeletonKeyframes}</style>
        <div style={skeletonStyles.card}>
            <div style={skeletonStyles.header}></div>
            <div style={skeletonStyles.body}></div>
            <div style={skeletonStyles.footer}></div>
        </div>
    </>
);

// --- Empty State ---
const EmptyState: React.FC<{ anio: number }> = ({ anio }) => (
    <div style={customStyles.emptyStateContainer}>
        <span style={customStyles.emptyStateIcon}>📘</span>
        <h3 style={customStyles.emptyStateTitle}>
            No hay informes disponibles para el año {anio}.
        </h3>
        <p style={customStyles.emptyStateText}>
            Asegúrate de que existan registros para el departamento y periodo seleccionados.
        </p>
    </div>
);

// --- Componente Principal ---
const AspecPosObstaculosInformeSintetico: React.FC<Props> = ({ departamentoId, anio }) => {
    const [informes, setInformes] = useState<InformeACParaInformeSintetico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInformes = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8000/informes-sinteticos/departamento/${departamentoId}/periodo/${anio}/informesAC/aspectosPositivosObstaculos`
                );
                if (!response.ok) throw new Error("Error al obtener los informes.");
                const data: InformeACParaInformeSintetico[] = await response.json();
                setInformes(data);
            } catch (error) {
                console.error("Error al cargar informes:", error);
                setInformes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInformes();
    }, [departamentoId, anio]);

    return (
        <div style={customStyles.container}>
            <h2 style={customStyles.heading}>
                Aspectos Positivos y Obstáculos
            </h2>

            {loading ? (
                <div style={customStyles.grid}>
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : informes.length === 0 ? (
                <EmptyState anio={anio} />
            ) : (
                <div style={customStyles.grid}>
                    {informes.map((info) => (
                        <div key={info.id_informeAC} style={customStyles.card}>
                            {/* Cabecera */}
                            <div style={customStyles.legendBox}>
                                <h3 style={customStyles.legendTitle}>
                                    {info.codigoMateria} — {info.nombreMateria}
                                </h3>
                                <p style={customStyles.legendSub}>
                                    Informe Analítico de Cátedra
                                </p>
                            </div>

                            {/* Cuerpo */}
                            <div style={customStyles.contentSection}>
                                <div style={customStyles.twoLevelHeaderContainer}>
                                    <div style={customStyles.mainHeaderRow}>
                                        <h4 style={customStyles.mainHeaderAspects}>
                                            Aspectos Positivos
                                        </h4>
                                        <h4 style={customStyles.mainHeaderObstacles}>
                                            Obstáculos
                                        </h4>
                                    </div>

                                    <div style={customStyles.subHeaderRow}>
                                        <p style={customStyles.subHeaderPill}>Enseñanza</p>
                                        <div style={customStyles.verticalDivider}></div>
                                        <p style={customStyles.subHeaderPill}>Aprendizaje</p>
                                        <div style={customStyles.verticalDivider}></div>
                                        <p style={customStyles.subHeaderPill}>Enseñanza</p>
                                        <div style={customStyles.verticalDivider}></div>
                                        <p style={customStyles.subHeaderPill}>Aprendizaje</p>
                                    </div>
                                </div>

                                <div style={customStyles.contentGrid4Columns}>
                                    <InfoTextBox
                                        content={info.aspectosPositivosEnsenianza}
                                        borderColor={COLOR_ACCION + "30"}
                                    />
                                    <InfoTextBox
                                        content={info.aspectosPositivosAprendizaje}
                                        borderColor={COLOR_ACCION + "30"}
                                    />
                                    <InfoTextBox
                                        content={info.ObstaculosEnsenianza}
                                        borderColor={COLOR_ACCION + "30"}
                                    />
                                    <InfoTextBox
                                        content={info.obstaculosAprendizaje}
                                        borderColor={COLOR_ACCION + "30"}
                                    />
                                </div>
                            </div>

                            {/* Estrategias */}
                            <div style={customStyles.strategyBox}>
                                <label style={customStyles.strategyLabel}>
                                    Estrategias a Implementar
                                </label>
                                <div style={customStyles.strategyContent}>
                                    {info.estrategiasAImplementar ||
                                        "No se han definido estrategias a implementar para el próximo ciclo."}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AspecPosObstaculosInformeSintetico;

// --- Estilos ---
const customStyles: Record<string, React.CSSProperties> = {
    container: {
        backgroundColor: COLOR_FONDO_CLARO,
        padding: "40px",
        fontFamily: '"Inter", "Roboto", sans-serif',
        color: "#333",
    },
    heading: {
        fontSize: "28px",
        fontWeight: 700,
        color: COLOR_PRIMARIO,
        marginBottom: "30px",
        borderBottom: `2px solid #e0e0e0`,
        paddingBottom: "10px",
    },
    grid: {
        display: "grid",
        gap: "30px",
    },
    card: {
        backgroundColor: COLOR_FONDO_BLANCO,
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 51, 102, 0.08)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
    },
    legendBox: {
        backgroundColor: COLOR_PRIMARIO,
        color: COLOR_FONDO_BLANCO,
        padding: "20px 24px",
        borderBottom: `4px solid ${COLOR_ACCION}`,
    },
    legendTitle: {
        fontSize: "20px",
        fontWeight: 700,
        margin: 0,
    },
    legendSub: {
        fontSize: "14px",
        opacity: 0.85,
    },
    contentSection: {
        padding: "24px",
        backgroundColor: "#fff",
    },
    twoLevelHeaderContainer: {
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        overflow: "hidden",
        marginBottom: "12px",
    },
    mainHeaderRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
    },
    mainHeaderAspects: {
        backgroundColor: COLOR_EXITO_FONDO,
        color: COLOR_EXITO_TEXTO,
        margin: 0,
        textAlign: "center",
        padding: "10px",
        fontWeight: 700,
    },
    mainHeaderObstacles: {
        backgroundColor: COLOR_PELIGRO_FONDO,
        color: COLOR_PELIGRO_TEXTO,
        margin: 0,
        textAlign: "center",
        padding: "10px",
        fontWeight: 700,
    },
    subHeaderRow: {
        display: "grid",
        gridTemplateColumns: "auto 1px auto 1px auto 1px auto",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #e0e0e0",
        alignItems: "center",
    },
    subHeaderPill: {
        textAlign: "center",
        padding: "6px 0",
        fontWeight: 600,
        color: COLOR_PRIMARIO,
        fontSize: "12px",
    },
    verticalDivider: {
        width: "1px",
        height: "100%",
        backgroundColor: "#d0d7e0",
    },
    contentGrid4Columns: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        marginTop: "15px",
    },
    infoBox: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid",
        backgroundColor: "#f2f7ff",
    },
    infoContent: {
        fontSize: "14px",
        lineHeight: 1.5,
        color: COLOR_PRIMARIO,
    },
    strategyBox: {
        backgroundColor: "#ffffff",
        padding: "20px 24px",
        borderTop: `3px solid ${COLOR_ACCION}`,
    },
    strategyLabel: {
        fontWeight: 700,
        color: COLOR_PRIMARIO,
        marginBottom: "10px",
    },
    strategyContent: {
        backgroundColor: "#f2f7ff",
        border: `1px solid ${COLOR_ACCION}30`,
        borderRadius: "6px",
        padding: "12px",
        fontSize: "14px",
        lineHeight: 1.5,
        color: COLOR_PRIMARIO,
    },
    emptyStateContainer: {
        backgroundColor: COLOR_FONDO_BLANCO,
        borderRadius: "12px",
        padding: "50px 20px",
        border: "1px dashed #c2d4ea",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,51,102,0.05)",
    },
    emptyStateIcon: {
        fontSize: "48px",
        display: "block",
        marginBottom: "15px",
    },
    emptyStateTitle: {
        fontSize: "20px",
        fontWeight: 700,
        color: COLOR_PRIMARIO,
    },
    emptyStateText: {
        fontSize: "16px",
        color: "#666",
        marginTop: "8px",
    },
};

// --- Skeleton Styles ---
const skeletonStyles: Record<string, React.CSSProperties> = {
    card: {
        backgroundColor: "#eaf1fa",
        borderRadius: "12px",
        height: "350px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    header: {
        height: "60px",
        background: `linear-gradient(90deg, #ccd9ea 25%, #d9e3f2 50%, #ccd9ea 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
    },
    body: {
        flex: 1,
        background: `linear-gradient(90deg, #e3eef9 25%, #f5f8fb 50%, #e3eef9 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
    },
    footer: {
        height: "70px",
        background: `linear-gradient(90deg, #d0e2ff 25%, #e1ebff 50%, #d0e2ff 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
    },
};
