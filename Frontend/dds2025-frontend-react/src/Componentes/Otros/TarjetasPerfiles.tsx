import React from "react";
import { Link } from "react-router-dom";
import { User, Calendar } from "lucide-react";
import fotoPerfil from "../../assets/avatarOA.png";
import { User as UserType } from "../../types/UserTypes";
import "../../App.css";

interface Props {
    usuario: UserType;
    onLogout: () => void;
    onClose: () => void;
}

const TarjetaDelPerfil: React.FC<Props> = ({ usuario, onLogout, onClose }) => {
    const rol = usuario.role_name;

    return (
        <div className="profile-card">

            {/* HEADER */}
            <div className="card-header">
                <img src={fotoPerfil} alt="User" className="card-avatar-large" />

                <h3 className="card-user-name">
                    {usuario.username}
                </h3>

                <span className="card-user-role">{rol}</span>

                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    {usuario.email}
                </div>
            </div>

            {/* INFORMACION SEGÚN ROL */}
            <div className="card-body">

                {/* ALUMNO */}
                {rol === "alumno" && usuario.alumno && (
                    <>
                        <div className="info-row">
                            <span className="info-label">Nombre</span>
                            <span className="info-value">{usuario.alumno.nombre}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">DNI</span>
                            <span className="info-value">{usuario.alumno.dni}</span>
                        </div>
                    </>
                )}

                {/* DOCENTE */}
                {rol === "docente" && usuario.docente && (
                    <>
                        <div className="info-row">
                            <span className="info-label">Nombre</span>
                            <span className="info-value">{usuario.docente.nombre}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Legajo</span>
                            <span className="info-value">{usuario.docente.nroLegajo}</span>
                        </div>

                    </>
                )}

                {/* DEPARTAMENTO */}
                {rol === "departamento" && usuario.departamento && (
                    <>
                        <div className="info-row">
                            <span className="info-label">Nombre</span>
                            <span className="info-value">{usuario.departamento.nombre}</span>
                        </div>

                    </>
                )}

                {/* ADMINISTRADOR */}
                {rol === "Administrador" && (
                    <div className="info-row">
                        <span className="info-label">Usuario</span>
                        <span className="info-value">{usuario.username}</span>
                    </div>
                )}

            </div>

            {/* ACCIONES */}
            <div className="card-actions">

                {/* <Link to="/home/perfil" className="action-btn" onClick={onClose}>
                    <User size={18} /> Mi Perfil Completo
                </Link> */}

                {/* ✔ Ahora TODOS los roles comparten calendario */}
                <Link to="/home/calendario" className="action-btn" onClick={onClose}>
                    <Calendar size={18} /> Mi Calendario
                </Link>

                <div className="dropdown-divider"></div>

                <div className="dropdown-item logout" onClick={onLogout}>
                    Cerrar Sesión
                </div>
            </div>
        </div>
    );
};

export default TarjetaDelPerfil;
