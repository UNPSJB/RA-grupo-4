import React, { forwardRef } from 'react';
import HeaderInstitucional from '../Otros/HeaderInstitucional';
// Las siguientes importaciones no se usan en el componente final, pero las mantengo por si las necesitas en otro lugar.
import CompletarDatosGeneralesDoc from '../Docente/CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from '../Docente/CompletarNecesidadesDoc';
import CompletarPorcentajesDoc from '../Docente/CompletarPorcentajesDoc';
import CompletarContenidoAbordadoDoc from '../Docente/CompletarContenidoAbordadoDoc';
import CompletarProcesoAprendizajeDoc from '../Docente/CompletarProcesoAprendizajeDoc';
import ConsignarActividadesDoc from '../Docente/ConsignarActividadesDoc';
import CompletarValoracionAuxiliaresDoc from '../Docente/CompletarValoracionAuxiliaresDoc';
import ResumenSecciones from './ConsignarResumenValoresEncuesta';

interface InformeImprimibleProps {
    data: any;
}

const InformeImprimible = forwardRef<HTMLDivElement, InformeImprimibleProps>(({ data }, ref) => {
    if (!data) return <div ref={ref} style={{ padding: 20, fontFamily: 'Arial' }}>Cargando datos para vista previa...</div>;

    // Mapeo de datos seguro
    const d = {
        // Generales
        materiaNombre: data.materia?.nombre || '-',
        materiaCodigo: data.materia?.codigoMateria || '-',
        docenteNombre: data.docente?.nombre || data.docente_responsable || '-',
        ciclo: data.ciclo_lectivo || '-',
        sede: data.sede || '-',
        inscriptos: data.cantidad_alumnos_inscriptos || 0,
        comTeo: data.cantidad_comisiones_teoricas || 0,
        comPra: data.cantidad_comisiones_practicas || 0,

        // Porcentajes
        pctTeo: data.porcentaje_teoricas || 0,
        pctPra: data.porcentaje_practicas || 0,
        justifPct: data.justificacion_porcentaje || 'Sin justificación.',
        pctContenido: data.porcentaje_contenido_abordado || 0,

        // Desarrollo / Reflexión
        posEns: data.aspectos_positivos_enseñanza || 'No registrado.',
        posApr: data.aspectos_positivos_aprendizaje || 'No registrado.',
        obsEns: data.obstaculos_enseñanza || 'No registrado.',
        obsApr: data.obstaculos_aprendizaje || 'No registrado.',
        estrategias: data.estrategias_a_implementar || 'No registrado.',
        reflexion: data.resumen_reflexion || data.opinionSobreResumen || 'No registrado.',

        // Listas (asegurar que sean arrays)
        necesidadesEq: Array.isArray(data.necesidades_equipamiento) ? data.necesidades_equipamiento : (data.necesidades_equipamiento ? [data.necesidades_equipamiento] : []),
        necesidadesBib: Array.isArray(data.necesidades_bibliografia) ? data.necesidades_bibliografia : (data.necesidades_bibliografia ? [data.necesidades_bibliografia] : []),
        valoraciones: data.valoracion_auxiliares || [],
        actividades: data.actividades || [],
        resumenSecciones: data.resumenSecciones || [],
    };

    const getTexto = (text: string | number) => (String(text).trim() || 'No registrado.');


    return (
        <div ref={ref} className="informe-root-print">
            <style>
                {`
                /* --- ESTILOS BASE (VISTA PREVIA Y PANTALLA) --- */
                .informe-root-print {
                    background-color: #fff !important;
                    color: #000 !important;
                    font-family: 'Segoe UI', Roboto, Arial, sans-serif !important;
                    line-height: 1.5;
                    padding: 40px;
                    font-size: 11pt;
                }
                h1, h2 {
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #003366;
                    border-bottom: 2px solid #003366;
                    padding-bottom: 5px;
                    margin-top: 30px;
                    margin-bottom: 15px;
                }
                h1 { font-size: 20px; text-align: center; }
                h2 { font-size: 16px; }

                .tabla-info {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }
                .tabla-info th, .tabla-info td {
                    border: 1px solid #ccc;
                    padding: 8px 12px;
                    vertical-align: top;
                    font-size: 11pt;
                }
                .tabla-info th {
                    background-color: #f0f5ff;
                    font-weight: 600;
                    width: 30%;
                    color: #003366;
                }
                .text-area-view {
                    border: 1px solid #ddd;
                    padding: 10px;
                    background-color: #f9f9f9;
                    white-space: pre-wrap;
                    min-height: 50px;
                    display: block;
                }
                .center { text-align: center; }
                .referencia {
                    font-size: 9pt;
                    color: #666;
                    margin-top: 5px;
                    margin-left: 5px;
                }
                .lista-recursos {
                    list-style-type: disc;
                    padding-left: 20px;
                    margin: 5px 0;
                }
                
                /* Ocultar elementos de formulario nativos molestos */
                .informe-root-print .no-print { display: none !important; }
                
                /* --- ESTILOS DE IMPRESIÓN --- */
                @media print {
                    @page { size: A4; margin: 15mm; }
                    html, body { 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .informe-root-print { padding: 0 !important; }
                    .tabla-info th { background-color: #e0e7f5 !important; -webkit-print-color-adjust: exact; }
                    .seccion-print, table {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                }
                `}
            </style>

            <div style={{ marginBottom: '20px' }}>
                <HeaderInstitucional />
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <h1 style={{ margin: '0', fontSize: '24px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Informe de Actividad Curricular
                </h1>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', margin: '5px 0', borderBottom: 'none', paddingBottom: 0 }}>{d.materiaNombre} ({d.materiaCodigo}) - Ciclo {d.ciclo}</h2>
                <p style={{ margin: '5px 0' }}>** Docente Responsable: {d.docenteNombre} **</p>
            </div>

            {/* --- SECCIÓN 1: DATOS GENERALES --- */}
            <div className="seccion-print">
                <h2>1. Datos Generales y Matrícula</h2>
                <table className="tabla-info">
                    <tbody>
                        <tr><th>Sede</th><td>{d.sede}</td><th>Comisiones Teóricas</th><td>{d.comTeo}</td></tr>
                        <tr><th>Inscriptos</th><td>{d.inscriptos}</td><th>Comisiones Prácticas</th><td>{d.comPra}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* --- SECCIÓN 2: CARGA HORARIA Y CONTENIDO --- */}
            <div className="seccion-print">
                <h2>2. Carga Horaria y Contenido Abordado</h2>
                <table className="tabla-info">
                    <tbody>
                        <tr><th>% Teóricas dictadas</th><td>{d.pctTeo}%</td><th>% Contenido total abordado</th><td>{d.pctContenido}%</td></tr>
                        <tr><th>% Prácticas dictadas</th><td>{d.pctPra}%</td><th>Justificación de porcentajes bajos</th><td>{getTexto(d.justifPct)}</td></tr>
                    </tbody>
                </table>
            </div>

            {/* --- SECCIÓN 3: DESARROLLO DE LA CURSADA --- */}
            <div className="seccion-print">
                <h2>3. Desarrollo y Proceso de Aprendizaje</h2>
                <table className="tabla-info">
                    <tbody>
                        <tr><th>Aspectos Positivos (Enseñanza)</th><td><div className="text-area-view">{getTexto(d.posEns)}</div></td></tr>
                        <tr><th>Aspectos Positivos (Aprendizaje)</th><td><div className="text-area-view">{getTexto(d.posApr)}</div></td></tr>
                        <tr><th>Obstáculos (Enseñanza)</th><td><div className="text-area-view">{getTexto(d.obsEns)}</div></td></tr>
                        <tr><th>Obstáculos (Aprendizaje)</th><td><div className="text-area-view">{getTexto(d.obsApr)}</div></td></tr>
                        <tr><th>Estrategias a Implementar</th><td><div className="text-area-view">{getTexto(d.estrategias)}</div></td></tr>
                        <tr><th>Reflexión/Opinión Final</th><td><div className="text-area-view">{getTexto(d.reflexion)}</div></td></tr>
                    </tbody>
                </table>
            </div>

            {/* --- SECCIÓN 4: RESUMEN DE ENCUESTAS --- */}
            {d.resumenSecciones.length > 0 && (
                <div className="seccion-print">
                    <h2>4. Resumen de Encuestas a Estudiantes</h2>
                    {d.resumenSecciones.map((seccion: any, i: number) => (
                        <div key={i} style={{ marginBottom: '15px', border: '1px solid #eee', padding: '10px' }}>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '12pt', color: '#000', borderBottom: '1px solid #ddd' }}>{seccion.sigla} - {seccion.nombre}</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                                {Object.entries(seccion.porcentajes_opciones || {}).map(([opcion, porcentaje], j) => (
                                    <li key={j} style={{ fontWeight: '500' }}>
                                        {opcion}: <span style={{ float: 'right', fontWeight: 'bold' }}>{porcentaje}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* --- SECCIÓN 5: NECESIDADES (Corregido para no mostrar inputs) --- */}
            {(d.necesidadesEq.length > 0 || d.necesidadesBib.length > 0) && (
                <div className="seccion-print">
                    <h2>5. Necesidades</h2>
                    <table className="tabla-info">
                        <tbody>
                            <tr>
                                <th>Equipamiento</th>
                                <td>
                                    {d.necesidadesEq.length > 0 ? (
                                        <ul className="lista-recursos">
                                            {d.necesidadesEq.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : 'Ninguna requerida.'}
                                </td>
                            </tr>
                            <tr>
                                <th>Bibliografía</th>
                                <td>
                                    {d.necesidadesBib.length > 0 ? (
                                        <ul className="lista-recursos">
                                            {d.necesidadesBib.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : 'Ninguna requerida.'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- SECCIÓN 6: VALORACIÓN AUXILIARES --- */}
            {d.valoraciones.length > 0 && (
                <div className="seccion-print">
                    <h2>6. Valoración de Auxiliares</h2>
                    <table className="tabla-info">
                        <thead><tr><th>Nombre</th><th>Rol</th><th style={{ width: '15%' }} className="center">Calificación</th><th>Justificación</th></tr></thead>
                        <tbody>
                            {d.valoraciones.map((aux: any, i: number) => (
                                <tr key={i}>
                                    <td>{aux.nombre || '-'}</td>
                                    <td>{aux.rol || '-'}</td>
                                    <td className="center">{aux.calificacion || '-'}</td>
                                    <td>{aux.justificacion || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

             {/* --- SECCIÓN 7: CONSIGNACIÓN DE ACTIVIDADES --- */}
            {d.actividades.length > 0 && (
                <div className="seccion-print">
                    <h2>7. Consignación de Actividades</h2>
                    <table className="tabla-info">
                        <thead>
                            <tr>
                                <th>Integrante</th>
                                <th className="center">Cap.</th>
                                <th className="center">Inv.</th>
                                <th className="center">Ext.</th>
                                <th className="center">Ges.</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {d.actividades.map((act: any, i: number) => (
                                <tr key={i}>
                                    <td>{act.integranteCatedra || '-'}</td>
                                    <td className="center">{act.capacitacion ? '✓' : '-'}</td>
                                    <td className="center">{act.investigacion ? '✓' : '-'}</td>
                                    <td className="center">{act.extension ? '✓' : '-'}</td>
                                    <td className="center">{act.gestion ? '✓' : '-'}</td>
                                    <td>{act.observacionComentarios || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="referencia">
                        <em>Referencias: Cap.=Capacitación, Inv.=Investigación, Ext.=Extensión, Ges.=Gestión</em>
                    </div>
                </div>
            )}

            {/* --- SECCIÓN DE FIRMAS --- */}
            <div style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ccc', pageBreakInside: 'avoid' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%', textAlign: 'center', border: 'none', padding: '30px 10px 10px 10px' }}>
                                <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '5px', fontSize: '10pt' }}>
                                    Firma Docente Responsable
                                </div>
                            </td>
                            <td style={{ width: '50%', textAlign: 'center', border: 'none', padding: '30px 10px 10px 10px' }}>
                                <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '5px', fontSize: '10pt' }}>
                                    Recibido en Departamento
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
});

export default InformeImprimible;