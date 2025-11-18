import React, { forwardRef } from 'react';
import HeaderInstitucional from '../Otros/HeaderInstitucional';

interface InformeImprimibleProps {
    data: any;
}

const InformeImprimible = forwardRef<HTMLDivElement, InformeImprimibleProps>(({ data }, ref) => {
    if (!data) return <div ref={ref}>Cargando datos...</div>;

    const txt = (val: any) => (val ? String(val) : '-');

    return (
        <div ref={ref} className="print-document">
            <style>
                {`
                @media print {
                    @page { size: A4; margin: 10mm; } /* Margen de hoja controlado */
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-document { margin: 0; padding: 0 !important; width: 100%; }
                }
                .print-document {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 10pt; /* Letra un poco más chica para que entre todo */
                    color: #000;
                    background: #fff;
                    padding: 40px; /* Padding solo para vista en pantalla */
                    width: 100%;
                    box-sizing: border-box;
                }
                
                /* Estilos de Tablas (La clave para que no se rompa) */
                .full-width-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    page-break-inside: avoid; /* Intenta no cortar tablas a la mitad */
                }
                .full-width-table th, .full-width-table td {
                    border: 1px solid #999;
                    padding: 6px 8px;
                    vertical-align: middle;
                    text-align: left;
                }
                .full-width-table th {
                    background-color: #e6f2ff !important; /* Forzar color al imprimir */
                    color: #003366;
                    font-weight: bold;
                    width: 25%;
                }
                .full-width-table td {
                    width: 25%;
                }

                /* Títulos */
                h1.main-title { 
                    font-size: 18pt; 
                    text-align: center; 
                    color: #003366; 
                    text-transform: uppercase; 
                    margin: 10px 0; 
                    border-bottom: 2px solid #003366;
                }
                .section-header {
                    background-color: #003366 !important;
                    color: white !important;
                    font-weight: bold;
                    padding: 5px 10px;
                    font-size: 11pt;
                    margin-top: 15px;
                    margin-bottom: 5px;
                    -webkit-print-color-adjust: exact;
                }

                /* Gráficos de Barras CSS */
                .bar-chart-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    font-size: 9pt;
                }
                .bar-label { width: 45%; text-align: right; padding-right: 10px; }
                .bar-track { flex-grow: 1; background: #eee; height: 12px; border: 1px solid #ccc; }
                .bar-fill { background: #4f46e5 !important; height: 100%; display: block; -webkit-print-color-adjust: exact; }
                .bar-value { width: 40px; padding-left: 5px; font-weight: bold; }
                
                .center-text { text-align: center !important; }
                `}
            </style>

            {/* ENCABEZADO */}
            <div style={{ marginBottom: '20px' }}>
                <HeaderInstitucional />
                <h1 className="main-title">Informe de Actividad Curricular</h1>
                <div style={{ textAlign: 'center', fontSize: '11pt' }}>
                    <strong>{data.materia?.nombre} ({data.materia?.codigoMateria})</strong> | Ciclo: {data.ciclo_lectivo}
                    <br/>
                    Docente Responsable: {data.docente?.nombre} | Sede: {data.sede}
                </div>
            </div>

            {/* 1. DATOS GENERALES (Ahora es una tabla real) */}
            <div className="section-header">1. DATOS GENERALES Y MATRÍCULA</div>
            <table className="full-width-table">
                <tbody>
                    <tr>
                        <th>Alumnos Inscriptos</th>
                        <td>{txt(data.cantidad_alumnos_inscriptos)}</td>
                        <th>Comisiones Teóricas</th>
                        <td>{txt(data.cantidad_comisiones_teoricas)}</td>
                    </tr>
                    <tr>
                        <th>Comisiones Prácticas</th>
                        <td>{txt(data.cantidad_comisiones_practicas)}</td>
                        <th>Código Materia</th>
                        <td>{txt(data.materia?.codigoMateria)}</td>
                    </tr>
                </tbody>
            </table>

            {/* 2. NECESIDADES */}
            <div className="section-header">2. NECESIDADES</div>
            <table className="full-width-table">
                <tbody>
                    <tr>
                        <th>Equipamiento</th>
                        <td colSpan={3}>
                            {data.necesidades_equipamiento?.length 
                                ? data.necesidades_equipamiento.join(', ') 
                                : 'Sin requerimientos.'}
                        </td>
                    </tr>
                    <tr>
                        <th>Bibliografía</th>
                        <td colSpan={3}>
                            {data.necesidades_bibliografia?.length 
                                ? data.necesidades_bibliografia.join(', ') 
                                : 'Sin requerimientos.'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* 3. PORCENTAJES */}
            <div className="section-header">3. PORCENTAJES DE DICTADO</div>
            <table className="full-width-table">
                <tbody>
                    <tr>
                        <th>% Teóricas</th>
                        <td>{txt(data.porcentaje_teoricas)}%</td>
                        <th>% Prácticas</th>
                        <td>{txt(data.porcentaje_practicas)}%</td>
                    </tr>
                    <tr>
                        <th>% Contenido Abordado</th>
                        <td>{txt(data.porcentaje_contenido_abordado)}%</td>
                        <th>Justificación</th>
                        <td>{txt(data.justificacion_porcentaje)}</td>
                    </tr>
                </tbody>
            </table>

            {/* 4. RESUMEN ENCUESTAS (Gráficos CSS seguros) */}
            <div className="section-header">4. RESUMEN VALORES DE ENCUESTA</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '10px', pageBreakInside: 'avoid' }}>
                {data.resumenSecciones?.map((seccion: any) => (
                    <div key={seccion.id} style={{ border: '1px solid #ccc', padding: '10px', breakInside: 'avoid' }}>
                        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', marginBottom: '5px', fontSize: '9pt' }}>
                            {seccion.sigla} - {seccion.nombre}
                        </div>
                        {Object.entries(seccion.porcentajes_opciones || {}).map(([opcion, valor]: any) => (
                            <div key={opcion} className="bar-chart-row">
                                <div className="bar-label">{opcion}</div>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${valor}%` }}></div>
                                </div>
                                <div className="bar-value">{Math.round(valor)}%</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div style={{ border: '1px solid #999', padding: '10px', fontSize: '10pt', backgroundColor: '#f9f9f9' }}>
                <strong>Observaciones sobre valores:</strong> {txt(data.opinionSobreResumen)}
            </div>

            {/* 5. PROCESO ENSEÑANZA */}
            <div className="section-header">5. PROCESO DE ENSEÑANZA-APRENDIZAJE</div>
            <table className="full-width-table">
                <tbody>
                    <tr><th>Asp. Positivos (Enseñanza)</th><td colSpan={3}>{txt(data.aspectos_positivos_enseñanza)}</td></tr>
                    <tr><th>Asp. Positivos (Aprendizaje)</th><td colSpan={3}>{txt(data.aspectos_positivos_aprendizaje)}</td></tr>
                    <tr><th>Obstáculos (Enseñanza)</th><td colSpan={3}>{txt(data.obstaculos_enseñanza)}</td></tr>
                    <tr><th>Obstáculos (Aprendizaje)</th><td colSpan={3}>{txt(data.obstaculos_aprendizaje)}</td></tr>
                    <tr><th>Estrategias</th><td colSpan={3}>{txt(data.estrategias_a_implementar)}</td></tr>
                    <tr><th>Reflexión Final</th><td colSpan={3}>{txt(data.resumen_reflexion)}</td></tr>
                </tbody>
            </table>

            {/* 6. ACTIVIDADES */}
            <div className="section-header">6. ACTIVIDADES DE CÁTEDRA</div>
            <table className="full-width-table">
                <thead>
                    <tr>
                        <th style={{width:'25%'}}>Integrante</th>
                        <th className="center-text" style={{width:'10%'}}>Cap.</th>
                        <th className="center-text" style={{width:'10%'}}>Inv.</th>
                        <th className="center-text" style={{width:'10%'}}>Ext.</th>
                        <th className="center-text" style={{width:'10%'}}>Ges.</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.actividades && data.actividades.map((act: any, i: number) => (
                        <tr key={i}>
                            <td>{txt(act.integranteCatedra)}</td>
                            <td className="center-text">{act.capacitacion ? 'X' : ''}</td>
                            <td className="center-text">{act.investigacion ? 'X' : ''}</td>
                            <td className="center-text">{act.extension ? 'X' : ''}</td>
                            <td className="center-text">{act.gestion ? 'X' : ''}</td>
                            <td>{txt(act.observacionComentarios)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 7. VALORACIÓN AUXILIARES */}
            <div className="section-header">7. VALORACIÓN DE AUXILIARES</div>
            <table className="full-width-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th className="center-text" style={{width:'15%'}}>Calif.</th>
                        <th>Justificación</th>
                    </tr>
                </thead>
                <tbody>
                    {data.valoracion_auxiliares && data.valoracion_auxiliares.map((val: any, i: number) => (
                        <tr key={i}>
                            <td>{txt(val.nombre_auxiliar)}</td>
                            <td className="center-text">{txt(val.calificacion)}</td>
                            <td>{txt(val.justificacion)}</td>
                        </tr>
                    ))}
                    {(!data.valoracion_auxiliares || data.valoracion_auxiliares.length === 0) && <tr><td colSpan={3}>No hay auxiliares registrados.</td></tr>}
                </tbody>
            </table>

            {/* FIRMAS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', pageBreakInside: 'avoid' }}>
                <div style={{ width: '40%', borderTop: '1px solid #000', textAlign: 'center', paddingTop: '5px' }}>
                    Firma Docente Responsable
                </div>
                <div style={{ width: '40%', borderTop: '1px solid #000', textAlign: 'center', paddingTop: '5px' }}>
                    Recibido en Departamento
                </div>
            </div>
        </div>
    );
});

export default InformeImprimible;