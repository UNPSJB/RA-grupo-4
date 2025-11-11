import React from 'react';

const outerContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  borderBottom: '2px solid #000',
  padding: '20px 0',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 30px',
  fontFamily: '"Segoe UI", "Roboto", sans-serif',
};

const logoStyles: React.CSSProperties = {
  height: '120px',
  marginRight: '24px',
};

const dividerStyles: React.CSSProperties = {
  width: '2px',
  height: '100px',
  backgroundColor: '#000',
  marginRight: '24px',
};

const textContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  lineHeight: '1.5',
  color: '#000',
};

const universidadStyles: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
};

const facultadStyles: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
};

const contactoStyles: React.CSSProperties = {
  fontSize: '14px',
};

const HeaderInstitucional: React.FC = () => (
  <div style={outerContainer}>
    <div style={headerStyles}>
      <img
        src="/logo.png"
        alt="Logo UNPSJB"
        style={logoStyles}
      />
      <div style={textContainerStyles}>
        <div style={universidadStyles}>
          Universidad Nacional de la Patagonia San Juan Bosco
        </div>
        <div style={facultadStyles}>
          Facultad de Ingeniería
        </div>
        <div style={contactoStyles}>
          Ciudad Universitaria - Ruta Prov. Nº 1 – Km. 4 - (9005) Comodoro Rivadavia - Chubut<br />
          TE/Fax: 54 – 0297 – 4550836 / 4550816
        </div>
      </div>
    </div>
  </div>
);

export default HeaderInstitucional;
