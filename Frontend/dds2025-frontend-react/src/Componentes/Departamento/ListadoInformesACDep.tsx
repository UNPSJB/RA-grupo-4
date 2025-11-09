import React from 'react';

interface Docente {
  id_docente: number;
  nombre: string;
}
interface Materia {
  id_materia: number;
  nombre: string;
  anio: string;
}
interface InformeAC {
  id_informesAC: number;
  materia: Materia;
  docente: Docente;
}

interface Props {
  informes: InformeAC[];
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '24px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
  th: {
    backgroundColor: '#e6f2ff',
    color: '#003366',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc',
    fontSize: '15px',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
    color: '#000',
    height: '60px',
    verticalAlign: 'middle' as const,
  },
  rowAlt: {
    backgroundColor: '#f9f9f9',
  },
  rowBase: {
    backgroundColor: '#ffffff',
  },
  noResults: {
    fontSize: '15px',
    color: '#666',
    marginTop: '16px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
};

const ListadoInformesACDep: React.FC<Props> = ({ informes }) => {
  if (!informes || informes.length === 0) {
    return <p style={styles.noResults}>No se encontraron informes.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>ID</th>
          <th style={styles.th}>Año</th>
          <th style={styles.th}>Materia</th>
          <th style={styles.th}>Docente</th>
        </tr>
      </thead>
      <tbody>
        {informes.map((informe, index) => (
          <tr
            key={informe.id_informesAC}
            style={index % 2 === 0 ? styles.rowBase : styles.rowAlt}
          >
            <td style={styles.td}>{informe.id_informesAC}</td>
            <td style={styles.td}>{informe.materia.anio}</td>
            <td style={styles.td}>{informe.materia.nombre}</td>
            <td style={styles.td}>{informe.docente.nombre}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListadoInformesACDep;
