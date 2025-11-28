import os
from pathlib import Path
from dotenv import load_dotenv
from typing import Dict, Any

# 1. Cargar .env de forma robusta (buscando en la carpeta padre 'backend')
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# 2. Leer variables (Usando valores por defecto si no existen en el .env)
ENV = os.getenv("ENV", "DEV")
DB_URL = os.getenv("DB_URL", "sqlite:///./test.db") 
ROOT_PATH = os.getenv("ROOT_PATH", "")

# Seguridad y Claves (Defaults para desarrollo)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "clave_super_secreta_por_defecto_123456")
REFRESH_SECRET_KEY = os.getenv("REFRESH_SECRET_KEY", "refresh_clave_secreta_123456")

try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
except (ValueError, TypeError):
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7

# Configuración de URLs y Cookies
TOKEN_URL = os.getenv("TOKEN_URL", "/auth/login")

MAIN_SITE_DOMAIN = os.getenv(f"MAIN_SITE_DOMAIN_{ENV}", "localhost")
API_SITE_DOMAIN = os.getenv(f"API_SITE_DOMAIN_{ENV}", "localhost")

SECURE_COOKIES = os.getenv("SECURE_COOKIES", "False").lower() == "true"
REFRESH_TOKEN_COOKIE_NAME = os.getenv("REFRESH_TOKEN_COOKIE_NAME", "refresh_token")
ACCESS_TOKEN_COOKIE_NAME = os.getenv("ACCESS_TOKEN_COOKIE_NAME", "access_token")

# --- Funciones de Utilidad para Cookies ---

def get_base_cookie_config(key: str) -> Dict:
    domain_val = API_SITE_DOMAIN if API_SITE_DOMAIN not in ["localhost", "127.0.0.1"] else None
    
    return {
        "key": key,
        "httponly": True,
        "samesite": "lax",
        "secure": SECURE_COOKIES,
        "domain": domain_val,
        "path": "/"
    }

def get_token_settings(key: str, token: str, max_age: int) -> Dict[str, Any]:
    base_cookie = get_base_cookie_config(key)
    return {
        **base_cookie,
        "value": token,
        "max_age": max_age,
    }

def get_refresh_token_settings(refresh_token: str) -> Dict[str, Any]:
    max_age_seconds = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    refresh_token_settings = get_token_settings(
        REFRESH_TOKEN_COOKIE_NAME, refresh_token, max_age_seconds
    )
    return refresh_token_settings 

def get_delete_token_settings() -> Dict: 
    token_settings = get_base_cookie_config(REFRESH_TOKEN_COOKIE_NAME)
    token_settings["max_age"] = 0
    token_settings["value"] = ""
    return token_settings