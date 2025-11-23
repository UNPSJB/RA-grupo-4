import React from 'react';

// 1. Definimos los Tipos (Para que TypeScript te ayude)
// Esto idealmente iría en un archivo types.ts
export enum UserRole {
  ALUMNO = 'ALUMNO',
  DOCENTE = 'DOCENTE',
  DEPARTAMENTO = 'DEPARTAMENTO',
  SECRETARIA = 'SECRETARIA',
}

interface Usuario {
  nombre: string;
  email: string;
  rol: UserRole; // El campo clave
  // Campos específicos (opcionales o unidos con Union Types)
  legajo?: string;
  cargo?: string;
  area?: string;
}

interface Props {
  usuario: Usuario;
}

// ----------------------------------------------------------
// Sub-componentes (pueden estar en el mismo archivo o separados)
// ----------------------------------------------------------

const PerfilAlumno = ({ data }: { data: Usuario }) => (
  <div className="p-4 bg-blue-50 border border-blue-200 rounded">
    <h2 className="text-xl font-bold text-blue-700">Panel de Estudiante</h2>
    <p><strong>Nombre:</strong> {data.nombre}</p>
    <p><strong>Legajo:</strong> {data.legajo}</p>
    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Ver Notas</button>
  </div>
);

const PerfilDocente = ({ data }: { data: Usuario }) => (
  <div className="p-4 bg-green-50 border border-green-200 rounded">
    <h2 className="text-xl font-bold text-green-700">Panel Docente</h2>
    <p><strong>Profesor:</strong> {data.nombre}</p>
    <p><strong>Cargo:</strong> {data.cargo}</p>
    <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Cargar Notas</button>
  </div>
);

const PerfilAdministrativo = ({ data, titulo }: { data: Usuario, titulo: string }) => (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
    <h2 className="text-xl font-bold text-gray-700">{titulo}</h2>
    <p><strong>Responsable:</strong> {data.nombre}</p>
    <p><strong>Area:</strong> {data.area}</p>
    <button className="mt-2 bg-gray-600 text-white px-4 py-2 rounded">Gestionar Trámites</button>
  </div>
);

const MostrarMiPerfil: React.FC<Props> = ({ usuario }) => {
  

  switch (usuario.rol) {
    case UserRole.ALUMNO:
      return <PerfilAlumno data={usuario} />;

    case UserRole.DOCENTE:
      return <PerfilDocente data={usuario} />;

    case UserRole.DEPARTAMENTO:
      return <PerfilAdministrativo data={usuario} titulo="Departamento Académico" />;

    case UserRole.SECRETARIA:
      return <PerfilAdministrativo data={usuario} titulo="Secretaría Académica" />;

    default:
      return <div className="text-red-500">Error: Rol de usuario desconocido ({usuario.rol})</div>;
  }
};

export default MostrarMiPerfil;