import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import InformeImprimible from './InformeImprimible';

interface VisualizarInformeProps {
  informe: any;
  onVolver: () => void;
}

const VisualizarInformeACDep: React.FC<VisualizarInformeProps> = ({ informe, onVolver }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      // Pequeña espera para asegurar que la referencia se asignó y el contenido se renderizó
      const timer = setTimeout(() => {
          if (printRef.current) setIsReady(true);
      }, 300);
      return () => clearTimeout(timer);
  }, []);

  const handlePrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Informe_${informe.materia?.nombre || 'AC'}_${informe.ciclo_lectivo || ''}`,
    onPrintError: (_, err) => alert("Error al intentar generar el PDF.")
  });

  return (
    <div style={{ backgroundColor: '#e9ebee', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BARRA SUPERIOR - zIndex en 0 para que no tape menús desplegables */}
      <div style={{
          backgroundColor: '#fff', padding: '12px 25px', borderRadius: '50px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', marginBottom: '30px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: '20px', zIndex: 0, width: '95%', maxWidth: '1000px'
      }}>
          <button 
              onClick={onVolver}
              style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                  border: '1px solid #ddd', borderRadius: '25px', backgroundColor: '#fff', 
                  cursor: 'pointer', fontSize: '15px', color: '#555', fontWeight: '500'
              }}
          >
              ⬅ Volver
          </button>

          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
             Vista Previa Oficial
          </div>

          <button 
              onClick={() => handlePrintFn()}
              disabled={!isReady}
              style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', 
                  border: 'none', borderRadius: '25px',
                  backgroundColor: isReady ? '#2e7d32' : '#999', 
                  color: 'white', cursor: isReady ? 'pointer' : 'not-allowed', 
                  fontSize: '15px', fontWeight: 'bold', 
                  boxShadow: isReady ? '0 4px 10px rgba(46, 125, 50, 0.3)' : 'none'
              }}
          >
              🖨️ Imprimir / PDF
          </button>
      </div>

      {/* CONTENEDOR HOJA A4 */}
      <div style={{ 
          backgroundColor: 'white', width: '210mm', minHeight: '297mm', 
          padding: '20mm', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', marginBottom: '50px' 
      }}>
          <InformeImprimible ref={printRef} data={informe} />
      </div>
    </div>
  );
};

export default VisualizarInformeACDep;