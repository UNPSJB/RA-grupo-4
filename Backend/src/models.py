import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base
import datetime

load_dotenv()

engine = create_engine(os.getenv("DB_URL"), connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    # Para usar restricciones de FK en SQLite, debemos habilitar la siguiente opción:
    db.execute(text("PRAGMA foreign_keys = ON"))
    try:
        yield db
    finally:
        db.close()

Base = declarative_base()

# autor original: https://stackoverflow.com/a/54034230
def keyvalgen(obj):
    """Genera pares nombre/valor, quitando/filtrando los atributos de SQLAlchemy."""
    excl = ("_sa_adapter", "_sa_instance_state")
    for k, v in vars(obj).items():
        if not k.startswith("_") and not any(hasattr(v, a) for a in excl):
            yield k, v

class ModeloBase(Base):
    """Modelo base para los módulos de nuestra app."""
    __abstract__ = True

    def __repr__(self):
        # Define un formato de representacion como cadena para el modelo base.
        params = ", ".join(f"{k}={v}" for k, v in keyvalgen(self))
        return f"{self.__class__.__name__}({params})"

# --- NUEVA CLASE AGREGADA PARA EL HISTORIAL ---
class HistorialInformeSintetico(ModeloBase):
    __tablename__ = "historial_informes_sinteticos"

    id = Column(Integer, primary_key=True, index=True)
    fecha_generacion = Column(DateTime, default=datetime.datetime.now)
    
    # Metadatos para filtrar
    anio_lectivo = Column(Integer, nullable=False)
    cuatrimestre = Column(String, nullable=False)
    departamento_id = Column(Integer, nullable=False)
    nombre_departamento = Column(String, nullable=True) # Guardamos el nombre por si borran el depto
    usuario_generador = Column(String, nullable=True)
    
    # EL SNAPSHOT: Aquí guardamos todo el JSON con los datos calculados
    datos_json = Column(Text, nullable=False)