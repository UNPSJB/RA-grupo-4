import React, { forwardRef } from 'react';
import HeaderInstitucional from '../Otros/HeaderInstitucional';

interface InformeImprimibleProps {
    data: any;
}

const InformeImprimible = forwardRef<HTMLDivElement, InformeImprimibleProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}>Cargando datos para imprimir...</div>;

    const txt = (val: any) => (val ? String(val) : '-');

    return (
        <div ref={ref} className="print-document-root">
            <style>
                {`
                @media print {
                    @page { 
                        size: A4; 
                        margin: 10mm; /* Margen seguro de impresora */
                    }
                    body { 
                        margin: 0; 
                        padding: 0; 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                    }
                }
                
                /* Estilos del documento */
                .print-document-root {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 10pt;
                    line-height: 1.3;
                    color: #000;
                    background: #fff;
                    width: 100%;
                    max-width: 210mm; /* Ancho A4 */
                    margin: 0 auto;
                    padding: 20px;
                    box-sizing: border-box;
                }

                /* Títulos */
                .doc-title {
                    text-align: center;
                    font-size: 16pt;
                    font-weight: bold;
                    text-transform: uppercase;
                    color: #003366;
                    border-bottom: 2px solid #003366;
                    margin: 10px 0 5px 0;
                    padding-bottom: 5px;
                }
                .doc-subtitle {
                    text-align: center;
                    font-size: 11pt;
                    margin-bottom: 20px;
                    color: #333;
                }

                /* Secciones */
                .section-header {
                    background-color: #003366 !important;
                    color: white !important;
                    font-weight: bold;
                    font-size: 11pt;
                    padding: 4px 8px;
                    margin-top: 15px;
                    margin-bottom: 5px;
                    border-radius: 2px;
                    -webkit-print-color-adjust: exact;
                }

                /* Tablas */
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 10px;
                    page-break-inside: avoid; /* Evita que la tabla se corte */
                }
                .info-table th, .info-table td {
                    border: 1px solid #999;
                    padding: 4px 6px;
                    vertical-align: top;
                    text-align: left;
                }
                .info-table th {
                    background-color: #e6f2ff !important;
                    color: #003366;
                    font-weight: bold;
                    width: 25%;
                    -webkit-print-color-adjust: exact;
                }
                
                /* Gráficos simulados con CSS */
                .chart-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 3px;
                    page-break-inside: avoid;
                }
                .chart-label { width: 40%; font-size: 9pt; text-align: right; padding-right: 10px; }
                .chart-bar-bg { flex-grow: 1; background: #eee; height: 10px; border: 1px solid #ccc; }
                .chart-bar-fill { background: #4a90e2 !important; height: 100%; -webkit-print-color-adjust: exact; }
                .chart-value { width: 35px; font-size: 9pt; font-weight: bold; text-align: right; padding-left: 5px; }

                /* Firmas */
                .signatures {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                    page-break-inside: avoid;
                }
                .sig-box {
                    width: 40%;
                    border-top: 1px solid #000;
                    text-align: center;
                    padding-top: 5px;
                    font-size: 10pt;
                }
                `}
            </style>

            {/* Encabezado */}
            <div style={{ textAlign: 'center' }}>
                {/* Renderizamos el HeaderInstitucional dentro de un div contenedor seguro */}
                <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center', marginBottom: '-10px' }}>
                    <HeaderInstitucional />
                </div>
            </div>

            <h1 className="doc-title">Informe de Actividad Curricular</h1>
            <div className="doc-subtitle">
                <strong>{data.materia?.nombre}</strong> ({data.materia?.codigoMateria}) | Ciclo: {data.ciclo_lectivo}
                <br/>
                Docente: {data.docente?.nombre} | Sede: {data.sede}
            </div>

            {/* 1. DATOS GENERALES */}
            <div className="section-header">1. DATOS GENERALES Y MATRÍCULA</div>
            <table className="info-table">
                <tbody>
                    <tr>
                        <th>Alumnos Inscriptos</th><td>{txt(data.cantidad_alumnos_inscriptos)}</td>
                        <th>Comisiones Teóricas</th><td>{txt(data.cantidad_comisiones_teoricas)}</td>
                    </tr>
                    <tr>
                        <th>Comisiones Prácticas</th><td>{txt(data.cantidad_comisiones_practicas)}</td>
                        <th>Código Materia</th><td>{txt(data.materia?.codigoMateria)}</td>
                    </tr>
                </tbody>
            </table>

            {/* 2. NECESIDADES */}
            <div className="section-header">2. NECESIDADES</div>
            <table className="info-table">
                <tbody>
                    <tr>
                        <th style={{ width: '20%' }}>Equipamiento</th>
                        <td>{data.necesidades_equipamiento?.length ? data.necesidades_equipamiento.join(', ') : 'Sin requerimientos.'}</td>
                    </tr>
                    <tr>
                        <th>Bibliografía</th>
                        <td>{data.necesidades_bibliografia?.length ? data.necesidades_bibliografia.join(', ') : 'Sin requerimientos.'}</td>
                    </tr>
                </tbody>
            </table>

            {/* 3. PORCENTAJES */}
            <div className="section-header">3. PORCENTAJES DE DICTADO</div>
            <table className="info-table">
                <tbody>
                    <tr>
                        <th>% Teóricas</th><td>{txt(data.porcentaje_teoricas)}%</td>
                        <th>% Prácticas</th><td>{txt(data.porcentaje_practicas)}%</td>
                    </tr>
                    <tr>
                        <th>% Contenido</th><td>{txt(data.porcentaje_contenido_abordado)}%</td>
                        <th>Justificación</th><td>{txt(data.justificacion_porcentaje)}</td>
                    </tr>
                </tbody>
            </table>

            {/* 4. RESUMEN ENCUESTAS */}
            <div className="section-header">4. RESUMEN VALORES ENCUESTA</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {data.resumenSecciones?.map((seccion: any) => (
                    <div key={seccion.id} style={{ border: '1px solid #ccc', padding: '5px', breakInside: 'avoid' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '5px', borderBottom: '1px solid #eee' }}>
                            {seccion.sigla} - {seccion.nombre}
                        </div>
                        {Object.entries(seccion.porcentajes_opciones || {}).map(([opcion, valor]: any) => (
                            <div key={opcion} className="chart-row">
                                <div className="chart-label">{opcion}</div>
                                <div className="chart-bar-bg">
                                    <div className="chart-bar-fill" style={{ width: `${valor}%` }}></div>
                                </div>
                                <div className="chart-value">{Math.round(valor)}%</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '5px', border: '1px solid #ccc', padding: '5px', fontSize: '9pt', background: '#f9f9f9' }}>
                <strong>Observaciones:</strong> {txt(data.opinionSobreResumen)}
            </div>

            {/* 5. PROCESO E-A */}
            <div className="section-header">5. PROCESO DE ENSEÑANZA-APRENDIZAJE</div>
            <table className="info-table">
                <tbody>
                    <tr><th>Asp. Positivos (Ens)</th><td colSpan={3}>{txt(data.aspectos_positivos_enseñanza)}</td></tr>
                    <tr><th>Asp. Positivos (Apr)</th><td colSpan={3}>{txt(data.aspectos_positivos_aprendizaje)}</td></tr>
                    <tr><th>Obstáculos (Ens)</th><td colSpan={3}>{txt(data.obstaculos_enseñanza)}</td></tr>
                    <tr><th>Obstáculos (Apr)</th><td colSpan={3}>{txt(data.obstaculos_aprendizaje)}</td></tr>
                    <tr><th>Estrategias</th><td colSpan={3}>{txt(data.estrategias_a_implementar)}</td></tr>
                    <tr><th>Reflexión</th><td colSpan={3}>{txt(data.resumen_reflexion)}</td></tr>
                </tbody>
            </table>

            {/* 6. ACTIVIDADES */}
            <div className="section-header">6. ACTIVIDADES DE CÁTEDRA</div>
            <table className="info-table">
                <thead>
                    <tr>
                        <th>Integrante</th>
                        <th style={{textAlign:'center', width: '30px'}}>C</th>
                        <th style={{textAlign:'center', width: '30px'}}>I</th>
                        <th style={{textAlign:'center', width: '30px'}}>E</th>
                        <th style={{textAlign:'center', width: '30px'}}>G</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.actividades?.map((act: any, i: number) => (
                        <tr key={i}>
                            <td>{txt(act.integranteCatedra)}</td>
                            <td style={{textAlign:'center'}}>{act.capacitacion ? 'X' : ''}</td>
                            <td style={{textAlign:'center'}}>{act.investigacion ? 'X' : ''}</td>
                            <td style={{textAlign:'center'}}>{act.extension ? 'X' : ''}</td>
                            <td style={{textAlign:'center'}}>{act.gestion ? 'X' : ''}</td>
                            <td>{txt(act.observacionComentarios)}</td>
                        </tr>
                    ))}
                    {(!data.actividades || data.actividades.length === 0) && <tr><td colSpan={6}>Sin registros.</td></tr>}
                </tbody>
            </table>

            {/* 7. AUXILIARES */}
            <div className="section-header">7. VALORACIÓN DE AUXILIARES</div>
            <table className="info-table">
                <thead><tr><th>Nombre</th><th style={{width:'50px'}}>Calif.</th><th>Justificación</th></tr></thead>
                <tbody>
                    {data.valoracion_auxiliares?.map((val: any, i: number) => (
                        <tr key={i}>
                            <td>{txt(val.nombre_auxiliar)}</td>
                            <td style={{textAlign:'center'}}>{txt(val.calificacion)}</td>
                            <td>{txt(val.justificacion)}</td>
                        </tr>
                    ))}
                     {(!data.valoracion_auxiliares || data.valoracion_auxiliares.length === 0) && <tr><td colSpan={3}>Sin registros.</td></tr>}
                </tbody>
            </table>

            {/* FIRMAS */}
            <div className="signatures">
                <div className="sig-box">Firma Docente Responsable</div>
                <div className="sig-box">Recibido en Departamento</div>
            </div>
        </div>
    );
});

export default InformeImprimible;