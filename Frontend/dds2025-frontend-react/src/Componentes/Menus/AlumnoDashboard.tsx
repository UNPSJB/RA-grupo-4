import React from 'react';
import MiniEstadisticasEst from '../Estudiante/MiniEstadisticasEst';
import SeleccionarEncuestas from '../Estudiante/SeleccionarEncuestas';
import { FileText, List } from 'lucide-react';
import { useAuth } from '../../hooks';

const AlumnoDashboard = () => {
  
  const { currentUser } = useAuth();
  const estudianteId = currentUser?.alumno_id;

  return (
    <div className="alumno-dashboard-layout">
      {/* Panel lateral + estadísticas */}
      <div className="alumno-top-row">
        <aside className="alumno-panel">
          <h1 className="panel-title">Panel del Alumno</h1>
          <p className="panel-subtitle">Accedé a tus encuestas, materias y recursos institucionales.</p>
        </aside>

        <div className="estadisticas-tarjeta">
          <MiniEstadisticasEst estudianteId={estudianteId} />
        </div>
      </div>

      {/* Encuestas pendientes */}
      <section className="seccion-box">
        <h2 className="seccion-title"><FileText size={20} /> Encuestas Pendientes</h2>
        <SeleccionarEncuestas idAlumno={estudianteId} />
      </section>

      {/* Tarjetas de navegación */}
      <section className="seccion-box">
        <h2 className="seccion-title"><List size={20} /> Navegación y Acceso Rápido</h2>
        <div className="card-grid">
          {/* Tarjetas como antes */}
        </div>
      </section>
    </div>
  );
};

export default AlumnoDashboard;