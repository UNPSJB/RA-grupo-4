import React, { useState, useEffect } from 'react';

// --- 1. Definición de Tipos ---
export enum UserRole {
  ALUMNO = 'ALUMNO',
  DOCENTE = 'DOCENTE',
  DEPARTAMENTO = 'DEPARTAMENTO',
  SECRETARIA = 'SECRETARIA',
}

interface Usuario {
  nombre: string;
  email: string;
  rol: UserRole;
  area: string;
  cargo?: string;
}

// --- 2. DATOS HARDCODEADOS (MOCK DATA) ---
const mockAdminUser: Usuario = {
  nombre: "Administrador",
  email: "admin@unpsjb.edu.ar",
  rol: UserRole.DEPARTAMENTO, 
  area: "Informática",
  cargo: "Superusuario"
};

// --- 3. Componente de Tarjeta ---
const InnovativeCard = ({ user }: { user: Usuario }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`admin-card ${mounted ? 'visible' : ''}`}>
      
      {/* Círculos decorativos de fondo */}
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>

      {/* Contenido Glass */}
      <div className="card-glass-content">
        
        {/* Header */}
        <div className="card-header-gradient">
          <div className="avatar-placeholder">
             {/* Sin foto, usamos iniciales o ícono */}
             <span className="avatar-initials">Ad</span>
             <span className="status-indicator"></span>
          </div>
          <h2 className="user-name">{user.nombre}</h2>
          <span className="user-role-badge">ADMINISTRADOR</span>
        </div>

        {/* Detalles (Sin botones abajo) */}
        <div className="card-body-details">
          <div className="info-group">
            <label>Departamento</label>
            <p>{user.area}</p>
          </div>
          <div className="info-group">
            <label>Email </label>
            <p>{user.email}</p>
          </div>
          <div className="info-group">
            <label>Permisos</label>
            <p className="access-level">Acceso Total</p>
          </div>
        </div>

      </div>

      {/* Estilos CSS (Inline para facilitar el copy-paste) */}
      <style>{`
        /* Contenedor Tarjeta */
        .admin-card {
          position: relative;
          width: 360px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.1),
            0 10px 20px rgba(0, 86, 179, 0.05);
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
          z-index: 10;
        }

        .admin-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Header Azul */
        .card-header-gradient {
          background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
          padding: 40px 20px 30px;
          text-align: center;
          color: white;
          /* Curva suave abajo */
          border-radius: 24px 24px 50% 50% / 20px 20px 30px 30px; 
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 20px rgba(0, 86, 179, 0.2);
        }

        /* Avatar Placeholder (Sin foto) */
        .avatar-placeholder {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 auto 15px;
          background: rgba(255, 255, 255, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .avatar-initials {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          letter-spacing: 1px;
        }

        .status-indicator {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 16px;
          height: 16px;
          background-color: #2ecc71;
          border: 3px solid #0056b3;
          border-radius: 50%;
        }

        .user-name {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .user-role-badge {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 12px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1px;
        }

        /* Body Details */
        .card-body-details {
          padding: 35px 30px 40px; /* Padding extra abajo compensa falta de botones */
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-group {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 10px;
        }
        .info-group:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-group label {
          display: block;
          font-size: 0.75rem;
          color: #8898aa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .info-group p {
          margin: 0;
          font-size: 1.05rem;
          color: #333;
          font-weight: 500;
        }

        .access-level {
          color: #d9534f !important; /* Rojo para resaltar root */
          font-weight: 700 !important;
        }

        /* Animación Círculos Fondo */
        .bg-circle {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
          opacity: 0.5;
        }

        .circle-1 {
          width: 140px;
          height: 140px;
          background: #ffc107;
          top: -20px;
          left: -20px;
          filter: blur(45px);
          animation: float 7s infinite ease-in-out;
        }

        .circle-2 {
          width: 100px;
          height: 100px;
          background: #17a2b8;
          bottom: 10px;
          right: -10px;
          filter: blur(40px);
          animation: float 9s infinite ease-in-out reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8px, 12px); }
        }
      `}</style>
    </div>
  );
};

// --- 4. Container Centrado ---
const AdminProfileShowcase: React.FC = () => {
  return (
    <div className="showcase-container">
      <InnovativeCard user={mockAdminUser} />
      <style>{`
        .showcase-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f4f7f6; /* Fondo liso o gradiente muy suave */
        }
      `}</style>
    </div>
  );
};

export default AdminProfileShowcase;