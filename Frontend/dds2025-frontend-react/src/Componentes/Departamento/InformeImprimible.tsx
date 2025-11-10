import React, { forwardRef } from 'react';
import HeaderInstitucional from './HeaderInstitucional';
import CompletarDatosGeneralesDoc from './Docente/CompletarDatosGeneralesDoc';
import CompletarNecesidadesDoc from './Docente/CompletarNecesidadesDoc';
import CompletarPorcentajesDoc from './Docente/CompletarPorcentajesDoc';
import CompletarContenidoAbordadoDoc from './Docente/CompletarContenidoAbordadoDoc';
import CompletarProcesoAprendizajeDoc from './Docente/CompletarProcesoAprendizajeDoc';
import ConsignarActividadesDoc from './Docente/ConsignarActividadesDoc';
import CompletarValoracionAuxiliaresDoc from './Docente/CompletarValoracionAuxiliaresDoc';
import ResumenSecciones from './Departamento/ConsignarResumenValoresEncuesta';

interface InformeImprimibleProps {
  data: any;
}

const InformeImprimible = forwardRef<HTMLDivElement, InformeImprimibleProps>(({ data }, ref) => {
  if (!data) return <div ref={ref} style={{ padding: 20, fontFamily: 'Arial' }}>Cargando datos para vista previa...</div>;

  // Mapeo de datos seguro
  const formDataMapeada = {
      sede: data.sede || '',
      ciclo_lectivo: String(data.ciclo_lectivo || ''),
      id_materia: String(data.materia?.id_materia || ''),
      codigoMateria: data.materia?.codigoMateria || '',
      id_docente: String(data.docente?.id_docente || ''),
      cantidad_alumnos_inscriptos: String(data.cantidad_alumnos_inscriptos || ''),
      cantidad_comisiones_teoricas: String(data.cantidad_comisiones_teoricas || ''),
      cantidad_comisiones_practicas: String(data.cantidad_comisiones_practicas || ''),
      porcentaje_teoricas: String(data.porcentaje_teoricas || ''),
      porcentaje_practicas: String(data.porcentaje_practicas || ''),
      justificacion_porcentaje: data.justificacion_porcentaje || '',
      porcentaje_contenido_abordado: String(data.porcentaje_contenido_abordado || ''),
      aspectos_positivos_enseñanza: data.aspectos_positivos_enseñanza || '',
      aspectos_positivos_aprendizaje: data.aspectos_positivos_aprendizaje || '',
      obstaculos_enseñanza: data.obstaculos_enseñanza || '',
      obstaculos_aprendizaje: data.obstaculos_aprendizaje || '',
      estrategias_a_implementar: data.estrategias_a_implementar || '',
      resumen_reflexion: data.opinionSobreResumen || '',
      opinionSobreResumen: data.opinionSobreResumen || ''
  };

  const materiasMock = data.materia ? [data.materia] : [];
  const docentesMock = data.docente ? [data.docente] : [];
  const noOp = () => {};

  return (
    <div ref={ref} className="informe-root">
        <style>
            {`
                /* --- ESTILOS BASE (VISTA PREVIA Y PANTALLA) --- */
                .informe-root {
                    background-color: #fff !important;
                    color: #000 !important;
                    font-family: 'Segoe UI', Roboto, Arial, sans-serif !important;
                    line-height: 1.5;
                }

                /* Forzar que los inputs deshabilitados parezcan texto normal */
                .informe-root input:disabled,
                .informe-root textarea:disabled,
                .informe-root select:disabled {
                    border: none !important;
                    background-color: transparent !important;
                    box-shadow: none !important;
                    resize: none !important;
                    appearance: none !important; -webkit-appearance: none !important; -moz-appearance: none !important;
                    color: #000 !important;
                    font-weight: 500 !important; /* Un poco más negrita para legibilidad */
                    padding: 0 !important;
                    margin: 0 !important;
                    opacity: 1 !important; /* Firefox a veces baja la opacidad */
                    cursor: text !important;
                    overflow: visible !important;
                }
                
                /* Truco para que los textareas muestren todo su contenido sin scrollbars */
                .informe-root textarea:disabled {
                    height: auto !important;
                    min-height: 1.5em;
                }

                /* Ocultar elementos de formulario nativos molestos */
                .informe-root select::-ms-expand { display: none; }
                .informe-root select { background-image: none !important; }
                .informe-root ::placeholder { color: transparent !important; opacity: 0 !important; }
                
                /* Ocultar botones en la vista previa */
                .informe-root button, 
                .informe-root .no-print, 
                .informe-root [type="button"],
                .informe-root [type="submit"] { 
                    display: none !important; 
                }

                /* Asegurar color negro puro para textos */
                .informe-root h1, .informe-root h2, .informe-root h3, .informe-root h4,
                .informe-root label, .informe-root p, .informe-root td, .informe-root th, .informe-root span, .informe-root div {
                    color: #000 !important;
                }

                /* --- ESTILOS ESPECÍFICOS DE IMPRESIÓN --- */
                @media print {
                    @page { size: A4; margin: 15mm; }
                    html, body { 
                        height: auto !important; 
                        background: #fff !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    
                    /* Permitir que las secciones grandes se dividan entre páginas */
                    .seccion-informe { 
                        page-break-inside: auto !important; 
                        break-inside: auto !important;
                        margin-bottom: 20px; 
                        display: block !important;
                    }
                    
                    /* Evitar que tablas pequeñas o fieldsets se corten por la mitad si es posible */
                    fieldset, tr, table { 
                        page-break-inside: avoid !important; 
                        break-inside: avoid !important;
                    }
                    
                    /* Asegurar que los gráficos tengan espacio */
                    .recharts-responsive-container { 
                        min-height: 300px !important; 
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

        <div className="seccion-informe">
             <CompletarDatosGeneralesDoc materias={materiasMock} docentes={docentesMock} formData={formDataMapeada} handleChange={noOp} loading={false} disabled={true} />
        </div>

        {(data.necesidades_equipamiento?.length > 0 || data.necesidades_bibliografia?.length > 0) && (
            <div className="seccion-informe">
                <CompletarNecesidadesDoc equipamiento={data.necesidades_equipamiento || []} bibliografia={data.necesidades_bibliografia || []} onNecesidadesChange={noOp} disabled={true} />
            </div>
        )}

        <div className="seccion-informe">
            <CompletarPorcentajesDoc formData={formDataMapeada} handleChange={noOp} disabled={true} />
        </div>

        <div className="seccion-informe">
            <CompletarContenidoAbordadoDoc formData={formDataMapeada} handleChange={noOp} disabled={true} />
        </div>

        {data.resumenSecciones && (
            <div className="seccion-informe" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <ResumenSecciones idMateria={Number(formDataMapeada.id_materia)} handleChange={noOp} disabled={true} />
            </div>
        )}

        <div className="seccion-informe">
            <CompletarProcesoAprendizajeDoc formData={formDataMapeada} handleChange={noOp} disabled={true} />
        </div>

        {data.actividades?.length > 0 && (
            <div className="seccion-informe">
                <ConsignarActividadesDoc actividades={data.actividades} onActividadesChange={noOp} disabled={true} />
            </div>
        )}

        {data.valoracion_auxiliares?.length > 0 && (
            <div className="seccion-informe">
                <CompletarValoracionAuxiliaresDoc valoraciones={data.valoracion_auxiliares} onValoracionesChange={noOp} disabled={true} />
            </div>
        )}
    </div>
  );
});

export default InformeImprimible;