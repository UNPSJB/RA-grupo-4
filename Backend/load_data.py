import sys
from src.database import engine, SessionLocal
from src.models import ModeloBase as Base 
from sqlalchemy.orm import Session
from src.users.schemas import UserCreate
from src.users.service import create_user, assign_role
from sqlalchemy import delete

# Importamos TODOS los modelos para que SQLAlchemy sepa de todas las tablas
try:
    import src.actividades.models
    import src.carreras.models
    import src.departamentos.models
    import src.docentes.models
    import src.encuesta.models
    import src.estudiantes.models
    import src.informesAC.models
    import src.informesSinteticos.models
    import src.inscripciones.models
    import src.materias.models
    import src.periodos.models
    import src.preguntas.models
    import src.respuestas.models
    import src.secciones.models
except Exception as e:
    pass

from src.users.models import Role, User
from src.auth.models import AuthPasswordRecoveryToken

def get_or_create_role(db: Session, role_name: str):
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        role = Role(name=role_name)
        db.add(role)
        db.commit()
        db.refresh(role)
        print(f"Rol creado: {role_name}")
    return role

def create_or_update_user_and_role(db: Session, username: str, password: str, role_name: str):
    """Crea un usuario, asigna rol y garantiza que se usa la contraseña correcta."""
    role = get_or_create_role(db, role_name)
    usuario_existente = db.query(User).filter(User.username == username).first()

    if usuario_existente:
        # Borramos SOLO si existe, aunque no debería existir si la DB es nueva
        db.delete(usuario_existente)
        db.commit()
        
    # Crear usuario nuevo
    nuevo_usuario = create_user(
        db,
        UserCreate(
            username=username, 
            email=f"{username}@gmail.com", 
            password=password
        ),
    )
    assign_role(db=db, user_id=nuevo_usuario.id, role_id=role.id)
    print(f"Usuario '{username}' creado exitosamente con contraseña: {password}")


def main():
    print("--- Iniciando Script de Carga ---")
    
    # ⚠️ 1. CREAR TODAS LAS TABLAS DESDE CERO
    print("Forzando la creación de TODAS las tablas de la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas correctamente.")

    db = SessionLocal()
    
    # 2. Creamos todos los roles y usuarios
    roles_y_usuarios = {
        "user": "123456789",
        "admin": "123456789",
        "alumno": "123456789",
        "docente": "123456789",
        "secretaria_academica": "123456789",
    }

    print("Creando usuarios iniciales...")
    try:
        for rol_nombre, password in roles_y_usuarios.items():
            create_or_update_user_and_role(db, rol_nombre, password, rol_nombre)
                
    except Exception as e:
        print(f"\nERROR CRÍTICO: {e}")
    finally:
        db.close()
        print("--- Fin del Script ---")

if __name__ == "__main__":
    main()