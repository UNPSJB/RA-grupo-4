import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine

from src.models import ModeloBase

from src.estudiantes import models as estudiantes_models
from src.encuesta import models as encuesta_models
from src.preguntas import models as preguntas_models
from src.respuestas import models as respuestas_models
from src.materias import models as materias_models
from src.inscripciones import models as inscripciones_models 

# importamos los routers desde nuestros modulos
from src.informesAC.router import router as informesAC_router
from src.estudiantes.router import router as estudiantes_router
from src.encuesta.router import router as encuesta_router
from src.preguntas.router import router as preguntas_router
from src.respuestas.router import router as respuestas_router
from src.materias.router import router as materias_router
from src.carreras.router import router as carreras_router
from src.docentes.router import router as docentes_router
from src.inscripciones.router import router as inscripciones_router
from src.informesSinteticos.router import router as informesSinteticos_router
from src.departamentos.router import router as departamentos_router
from src.secciones.router import router as secciones_router

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)


origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
 )


app.include_router(preguntas_router)
app.include_router(respuestas_router)
app.include_router(encuesta_router)
app.include_router(estudiantes_router)
app.include_router(materias_router)
app.include_router(docentes_router)
app.include_router(carreras_router)
app.include_router(inscripciones_router)
app.include_router(informesAC_router)
app.include_router(informesSinteticos_router)
app.include_router(departamentos_router)
app.include_router(secciones_router)