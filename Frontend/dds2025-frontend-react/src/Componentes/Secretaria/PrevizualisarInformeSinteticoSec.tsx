import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ErrorCargaDatos from "../Otros/ErrorCargaDatos";
import HeaderInstitucional from "../Otros/HeaderInstitucional";
import SinDatos from "../Otros/SinDatos";

//Para ver datos hardcodeados
const USE_DEBUG_DATA = true;

const MOCK_INFORME_DATA: InformeSinteticoDetalle = {
  id: 999,
  descripcion: "[MODO PRUEBA] Informe Anual de Departamento",
  anio: 2025,
  periodo: "Anual",
  sede: "Puerto Madryn",
  integrantes: "Lic. Ana Turing, Dr. Alan Kay",
  departamento_nombre: "Departamento de Informática Experimental",
  comentarios: "Este es un comentario de prueba para verificar cómo se visualizan los textos largos en el documento final. Se espera que ocupe varias líneas y mantenga un formato legible.",
  resumen_general: [
    { codigo: "INF101", nombre: "Algoritmos I", alumnos_inscriptos: 150, comisiones_teoricas: 2, comisiones_practicas: 6 },
    { codigo: "INF205", nombre: "Ingeniería de Software", alumnos_inscriptos: 45, comisiones_teoricas: 1, comisiones_practicas: 2 },
  ],
  resumen_necesidades: [
    { 
      codigo_materia: "INF101", nombre_materia: "Algoritmos I", 
      necesidades_equipamiento: ["Proyector HD nuevo para Aula 5", "Pizarras adicionales"], 
      necesidades_bibliografia: ["Introduction to Algorithms (Cormen) - 3 copias"] 
    },
    { 
      codigo_materia: "INF205", nombre_materia: "Ingeniería de Software", 
      necesidades_equipamiento: null, 
      necesidades_bibliografia: ["Software Engineering at Google (O'Reilly)"] 
    },
  ],
  valoracion_miembros: [
    { nombre_docente: "Carlos López", materia: "Algoritmos I", valoracion: "Excelente", justificacion: "Compromiso destacado con los alumnos ingresantes." },
    { nombre_docente: "Marta Sanchez", materia: "Algoritmos I", valoracion: "Muy Bueno", justificacion: "" },
  ]
};
// ------------------------------

interface ResumenGeneralItem {
  codigo: string;
  nombre: string;
  alumnos_inscriptos: number;
  comisiones_teoricas: number;
  comisiones_practicas: number;
}

interface NecesidadItem {
  codigo_materia: string;
  nombre_materia: string;
  necesidades_equipamiento: string[] | null;
  necesidades_bibliografia: string[] | null;
}

interface ValoracionMiembroItem {
  nombre_docente: string;
  materia: string;
  valoracion: string;
  justificacion: string;
}

interface InformeSinteticoDetalle {
  id: number;
  descripcion: string;
  anio: number;
  periodo: string;
  sede: string;
  integrantes: string | null;
  departamento_nombre: string | null;
  comentarios: string | null;
  resumen_general: ResumenGeneralItem[] | null;
  resumen_necesidades: NecesidadItem[] | null;
  valoracion_miembros: ValoracionMiembroItem[] | null;
}

const PrevisualizarInformeSinteticoSec: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [informe, setInforme] = useState<InformeSinteticoDetalle | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInformeDetalle = useCallback(async () => {
    // Si estamos en modo debug, usamos los datos falsos y salimos
    if (USE_DEBUG_DATA) {
      console.log("⚡ MODO DEBUG ACTIVADO: Usando datos mock");
      setTimeout(() => {
        setInforme(MOCK_INFORME_DATA);
        setCargando(false);
      }, 800);
      return;
    }

    if (!id) return;
    try {
      setCargando(true);
      const response = await fetch(`http://localhost:8000/informes-sinteticos/${id}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? "Informe no encontrado." : "Error al cargar el informe.");
      }
      const data: InformeSinteticoDetalle = await response.json();
      setInforme(data);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInformeDetalle();
  }, [fetchInformeDetalle]);

  if (cargando) return (
    <>
      <HeaderInstitucional />
      <div className="loading-container" style={{ padding: "50px", textAlign: "center", color: "#003366" }}>
        Cargando documento...
      </div>
    </>
  );

  if (error) return (
    <>
      <HeaderInstitucional />
      <ErrorCargaDatos mensajeError={error} onReintentar={fetchInformeDetalle} />
    </>
  );

  if (!informe) return (
    <>
      <HeaderInstitucional />
      <SinDatos mensaje="No se pudo recuperar la información del informe." />
    </>
  );

  return (
    <>
      
      <div className="uni-wrapper">
        <HeaderInstitucional />
        <style>{`
          :root {
            --doc-bg: #ffffff;
            --doc-text: #2c3e50;
            --doc-heading: #003366;
            --doc-border: #e0e0e0;
            --uni-primary: #003366;
          }
          .uni-wrapper {
            font-family: 'Times New Roman', serif;
            max-width: 900px;
            margin: 30px auto;
            background: var(--doc-bg);
            padding: 50px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            color: var(--doc-text);
            line-height: 1.6;
          }
          .doc-header {
            text-align: center;
            border-bottom: 3px double var(--doc-heading);
            margin-bottom: 30px;
            padding-bottom: 20px;
          }
          .doc-title {
            font-size: 28px;
            color: var(--doc-heading);
            margin: 0 0 10px 0;
            text-transform: uppercase;
          }
          .doc-meta {
            font-family: 'Segoe UI', sans-serif;
            color: #555;
            font-size: 0.95rem;
          }
          .doc-section {
            margin-bottom: 40px;
          }
          .section-title {
            font-family: 'Segoe UI', sans-serif;
            font-size: 18px;
            color: var(--doc-heading);
            border-bottom: 1px solid var(--doc-heading);
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            background: #f9fbfc;
            padding: 10px 15px;
            border-left: 3px solid var(--uni-primary);
            font-family: 'Segoe UI', sans-serif;
            font-size: 0.9rem;
          }
          .info-label { font-weight: bold; color: var(--uni-primary); display: block; margin-bottom: 3px; }

          /* Tablas del documento */
          .doc-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 0.95rem;
            font-family: 'Segoe UI', sans-serif;
          }
          .doc-table th, .doc-table td {
            border: 1px solid var(--doc-border);
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
          }
          .doc-table th {
            background-color: #f0f4f8;
            color: var(--doc-heading);
            font-weight: 600;
          }
          .doc-table tr:nth-child(even) { background-color: #fafafa; }

          .empty-msg { font-style: italic; color: #777; padding: 10px; background: #f5f5f5; border-left: 3px solid #ccc; }
          
          .actions-bar {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px dashed #ccc;
            display: flex;
            justify-content: space-between;
            font-family: sans-serif;
          }
          .btn {
            padding: 10px 25px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
            border: none;
            font-family: 'Segoe UI', sans-serif;
          }
          .btn-back { background: #e0e0e0; color: #333; display: inline-flex; align-items: center; }
          .btn-back:hover { background: #d0d0d0; }
          .btn-print { background: var(--uni-primary); color: white; }
          .btn-print:hover { background: #002855; }

          /* Ajustes para impresión */
          @media print {
            body { background: white; }
            .uni-wrapper { box-shadow: none; margin: 0; padding: 0; max-width: 100%; }
            .actions-bar, header { display: none !important; } /* Oculta header institucional y botones al imprimir */
            .doc-section { break-inside: avoid; }
          }
        `}</style>

        {USE_DEBUG_DATA && (
          <div style={{background: '#fff3cd', color: '#856404', padding: '10px', textAlign: 'center', marginBottom: '20px', border: '1px solid #ffeeba', borderRadius: '4px'}}>
            ⚠️ <strong>MODO PREVISUALIZACIÓN:</strong> Se están mostrando datos de prueba hardcodeados.
          </div>
        )}

        {/* --- ENCABEZADO DEL DOCUMENTO --- */}
        <div className="doc-header">
          <h1 className="doc-title">Informe Sintetico de Departamento</h1>
          <div className="doc-meta">
            {informe.departamento_nombre && <div><strong>Departamento:</strong> {informe.departamento_nombre}</div>}
            <div><strong>Sede:</strong> {informe.sede} | <strong>Período:</strong> {informe.periodo} - {informe.anio}</div>
            <div><strong>ID Documento:</strong> #{informe.id}</div>
          </div>
        </div>

        {/* --- SECCIÓN 1: DATOS GENERALES --- */}
        <div className="doc-section">
          <h2 className="section-title">1. Información General</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Descripción:</span>
              {informe.descripcion}
            </div>
            <div className="info-item">
              <span className="info-label">Integrantes que elaboraron:</span>
              {informe.integrantes || "Sin especificar"}
            </div>
          </div>
          {informe.comentarios && (
            <div style={{ marginTop: '15px', background: '#f9f9f9', padding: '15px', borderLeft: '3px solid #ccc' }}>
              <strong>Comentarios Adicionales:</strong>
              <p style={{ margin: '5px 0 0 0', whiteSpace: 'pre-wrap' }}>{informe.comentarios}</p>
            </div>
          )}
        </div>

        {/* --- SECCIÓN 2: RESUMEN DE ACTIVIDAD ACADÉMICA --- */}
        <div className="doc-section">
          <h2 className="section-title">2. Resumen de Actividad Académica</h2>
          {!informe.resumen_general || informe.resumen_general.length === 0 ? (
            <div className="empty-msg">No hay datos de resumen general disponibles para este período.</div>
          ) : (
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Cód.</th>
                  <th>Materia</th>
                  <th style={{textAlign: 'center'}}>Alumnos</th>
                  <th style={{textAlign: 'center'}}>Com. Teóricas</th>
                  <th style={{textAlign: 'center'}}>Com. Prácticas</th>
                </tr>
              </thead>
              <tbody>
                {informe.resumen_general.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.codigo}</td>
                    <td>{item.nombre}</td>
                    <td style={{textAlign: 'center'}}>{item.alumnos_inscriptos}</td>
                    <td style={{textAlign: 'center'}}>{item.comisiones_teoricas}</td>
                    <td style={{textAlign: 'center'}}>{item.comisiones_practicas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- SECCIÓN 3: NECESIDADES DETECTADAS --- */}
        <div className="doc-section">
          <h2 className="section-title">3. Necesidades de Cátedras</h2>
          {!informe.resumen_necesidades || informe.resumen_necesidades.length === 0 ? (
            <div className="empty-msg">No se reportaron necesidades de equipamiento o bibliografía en este período.</div>
          ) : (
            <table className="doc-table">
              <thead>
                <tr>
                  <th style={{width: '30%'}}>Materia</th>
                  <th>Necesidades Equipamiento</th>
                  <th>Necesidades Bibliografía</th>
                </tr>
              </thead>
              <tbody>
                {informe.resumen_necesidades.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{item.codigo_materia}</strong><br/>
                      {item.nombre_materia}
                    </td>
                    <td>
                      {item.necesidades_equipamiento?.length ? (
                        <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
                          {item.necesidades_equipamiento.map((ne, i) => <li key={i}>{ne}</li>)}
                        </ul>
                      ) : <span style={{color: '#999'}}>- Sin requerimientos -</span>}
                    </td>
                    <td>
                      {item.necesidades_bibliografia?.length ? (
                        <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
                          {item.necesidades_bibliografia.map((nb, i) => <li key={i}>{nb}</li>)}
                        </ul>
                      ) : <span style={{color: '#999'}}>- Sin requerimientos -</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- SECCIÓN 4: VALORACIONES DE MIEMBROS --- */}
        <div className="doc-section">
          <h2 className="section-title">4. Valoraciones de Miembros de Cátedra</h2>
          {!informe.valoracion_miembros || informe.valoracion_miembros.length === 0 ? (
            <div className="empty-msg">No hay valoraciones de miembros registradas en este informe.</div>
          ) : (
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Docente Evaluado</th>
                  <th>Materia</th>
                  <th>Valoración</th>
                  <th style={{width: '40%'}}>Justificación</th>
                </tr>
              </thead>
              <tbody>
                {informe.valoracion_miembros.map((val, idx) => (
                  <tr key={idx}>
                    <td style={{fontWeight: 'bold'}}>{val.nombre_docente}</td>
                    <td>{val.materia}</td>
                    <td>{val.valoracion}</td>
                    <td>{val.justificacion || <span style={{color: '#999'}}>-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- BARRA DE ACCIONES --- */}
        <div className="actions-bar">
          <Link to="/home/seleccionar-informe-sintetico" className="btn btn-back">
            ← Volver al listado
          </Link>
          <button className="btn btn-print" onClick={() => window.print()}>
            🖨️ Imprimir Documento
          </button>
        </div>

      </div>
    </>
  );
};

export default PrevisualizarInformeSinteticoSec;