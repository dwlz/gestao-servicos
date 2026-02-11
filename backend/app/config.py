import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend/ directory
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)


class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "servicepro")
    JWT_SECRET = os.getenv("JWT_SECRET", "servicepro-secret-key-change-me")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    VALID_INVITE_CODES = os.getenv(
        "VALID_INVITE_CODES", "SERVICEPRO2026,CONVITE123,ADMIN2026"
    ).split(",")
