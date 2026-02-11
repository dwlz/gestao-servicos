from flask import Blueprint, request, jsonify
from functools import wraps
import bcrypt
import jwt
import datetime
from ..database import get_db
from ..config import Config

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password, hashed):
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id, email):
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

        if not token:
            return jsonify({"error": "Token não fornecido"}), 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            db = get_db()
            from bson import ObjectId

            user = db.users.find_one({"_id": ObjectId(payload["sub"])})
            if not user:
                return jsonify({"error": "Usuário não encontrado"}), 401
            request.current_user = {
                "id": str(user["_id"]),
                "nome": user["nome"],
                "email": user["email"],
            }
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except (jwt.InvalidTokenError, Exception):
            return jsonify({"error": "Token inválido"}), 401

        return f(*args, **kwargs)

    return decorated


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    nome = data.get("nome", "").strip()
    email = data.get("email", "").strip().lower()
    senha = data.get("senha", "")
    codigo_convite = data.get("codigoConvite", "").strip().upper()

    if not all([nome, email, senha, codigo_convite]):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400

    if codigo_convite not in Config.VALID_INVITE_CODES:
        return (
            jsonify(
                {
                    "error": "Código de convite inválido. Solicite um código ao administrador."
                }
            ),
            400,
        )

    db = get_db()
    if db.users.find_one({"email": email}):
        return jsonify({"error": "Este e-mail já está cadastrado."}), 400

    user = {
        "nome": nome,
        "email": email,
        "senha": hash_password(senha),
        "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    result = db.users.insert_one(user)

    token = create_token(result.inserted_id, email)
    return (
        jsonify(
            {
                "token": token,
                "user": {
                    "id": str(result.inserted_id),
                    "nome": nome,
                    "email": email,
                },
            }
        ),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    senha = data.get("senha", "")

    if not email or not senha:
        return jsonify({"error": "E-mail e senha são obrigatórios"}), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    if not user or not check_password(senha, user["senha"]):
        return jsonify({"error": "E-mail ou senha incorretos."}), 401

    token = create_token(user["_id"], email)
    return jsonify(
        {
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "nome": user["nome"],
                "email": user["email"],
            },
        }
    )


@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    return jsonify({"user": request.current_user})
