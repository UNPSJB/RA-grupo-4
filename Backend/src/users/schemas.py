from re import S
from pydantic import BaseModel, EmailStr
from typing import Optional
from src.estudiantes.schemas import Estudiante
from src.docentes.schemas import Docente
from src.departamentos.schemas import DepartamentoBase
class UserBase(BaseModel): 
    username: str
    email: EmailStr
    role_id: Optional[int] = None


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    model_config = {"extra": "forbid"}


class User(UserBase):
    id: int
    role_name: str
    alumno_id: Optional[int] = None
    alumno: Optional[Estudiante]
    docente_id: Optional[int] = None
    docente: Optional[Docente]
    departamento_id: Optional[int] = None
    departamento: Optional[DepartamentoBase]

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    model_config = {"extra": "ignore"}


class UserDelete(BaseModel):
    id: int
    msg: str
