from pathlib import Path
from pymongo import MongoClient
from .config import Config

_client = None
_db = None

# Path to the SSL certificate for Square Cloud MongoDB
_cert_path = Path(__file__).resolve().parent.parent / "certificate.pem"


def get_db():
    global _client, _db
    if _db is None:
        if _cert_path.exists():
            _client = MongoClient(
                Config.MONGODB_URI,
                tls=True,
                tlsCertificateKeyFile=str(_cert_path),
                tlsCAFile=str(_cert_path),
                tlsAllowInvalidCertificates=True,
            )
        else:
            _client = MongoClient(Config.MONGODB_URI)
        _db = _client[Config.DB_NAME]
        _ensure_indexes(_db)
    return _db


def _ensure_indexes(db):
    db.users.create_index("email", unique=True)
    db.empresas.create_index("cnpj")
    db.locais.create_index("empresaId")
    db.servicos.create_index("empresaId")
    db.servicos.create_index("status")
    db.orcamentos.create_index("empresaId")
    db.transacoes.create_index("data")

