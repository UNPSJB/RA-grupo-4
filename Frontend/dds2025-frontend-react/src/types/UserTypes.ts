export interface User {
    id: number;
    username: string;
    email: string;
    role_name: string;
    role_id: number;

    alumno_id?: number | null;
    alumno?: Alumno | null;

    docente_id?: number | null;
    docente?: Docente | null;

    departamento_id?: number | null;
    departamento?: Departamento | null;

}

interface Alumno {
    id: number;
    dni: number;
    nombre: string; 
}

interface Docente {
    id_docente: number;
    nroLegajo: number;
    nombre: string;
}

interface Departamento {
    id: number;
    nombre: string;
}