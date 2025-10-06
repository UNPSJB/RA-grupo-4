import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase


# importamos los routers desde nuestros modulos
from src.estudiantes.router import router as estudiantes_router
from src.encuesta.router import router as encuesta_router
from src.preguntas.router import router as preguntas_router
from src.respuestas.router import router as respuestas_router
from src.materias.router import router as materias_router

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")


@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield


app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)

import logging

logging.basicConfig(level=logging.DEBUG)


origins = [
    "http://localhost:5173", # para recibir requests desde app React (puerto: 5173)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# asociamos los routers a nuestra app
app.include_router(preguntas_router)
app.include_router(respuestas_router)
app.include_router(encuesta_router)
app.include_router(estudiantes_router)
app.include_router(encuesta_router)
app.include_router(materias_router)