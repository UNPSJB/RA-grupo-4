from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import relationship, mapped_column, Mapped
from typing import Optional
from src.models import ModeloBase as Base 

class Role(Base):
    __tablename__ = "role"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255)) # Cambiado EmailStr a str para evitar errores de tipo en DB
    hashed_password: Mapped[str] = mapped_column(String(255))

    role_id: Mapped[Optional[int]] = mapped_column(ForeignKey("role.id"))
    
    role: Mapped[Optional["Role"]] = relationship("Role")

    @property
    def is_admin(self):
        return self.role_id == 1

    @property
    def role_name(self):
        if self.role:
            return self.role.name
        return None