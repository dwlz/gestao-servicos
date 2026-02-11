from flask import Blueprint, request, jsonify
from ..database import get_db
from ..models import validate_empresa, validate_local, serialize_doc, serialize_list
from .auth import token_required
from bson import ObjectId

empresas_bp = Blueprint("empresas", __name__, url_prefix="/api/empresas")


@empresas_bp.route("", methods=["GET"])
@token_required
def list_empresas():
    db = get_db()
    empresas = serialize_list(db.empresas.find().sort("nome", 1))
    return jsonify(empresas)


@empresas_bp.route("", methods=["POST"])
@token_required
def create_empresa():
    data = request.get_json()
    cleaned, error = validate_empresa(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.empresas.insert_one(cleaned)
    cleaned["id"] = str(result.inserted_id)
    return jsonify(cleaned), 201


@empresas_bp.route("/<empresa_id>", methods=["PUT"])
@token_required
def update_empresa(empresa_id):
    data = request.get_json()
    cleaned, error = validate_empresa(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.empresas.update_one({"_id": ObjectId(empresa_id)}, {"$set": cleaned})
    if result.matched_count == 0:
        return jsonify({"error": "Empresa não encontrada"}), 404

    cleaned["id"] = empresa_id
    return jsonify(cleaned)


@empresas_bp.route("/<empresa_id>", methods=["DELETE"])
@token_required
def delete_empresa(empresa_id):
    db = get_db()
    result = db.empresas.delete_one({"_id": ObjectId(empresa_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Empresa não encontrada"}), 404

    # Also delete related locais
    db.locais.delete_many({"empresaId": empresa_id})
    return jsonify({"message": "Empresa removida com sucesso"})


# ----- Locais (sub-resource) -----


@empresas_bp.route("/<empresa_id>/locais", methods=["GET"])
@token_required
def list_locais(empresa_id):
    db = get_db()
    locais = serialize_list(db.locais.find({"empresaId": empresa_id}).sort("nome", 1))
    return jsonify(locais)


@empresas_bp.route("/<empresa_id>/locais", methods=["POST"])
@token_required
def create_local(empresa_id):
    data = request.get_json()
    data["empresaId"] = empresa_id
    cleaned, error = validate_local(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.locais.insert_one(cleaned)
    cleaned["id"] = str(result.inserted_id)
    return jsonify(cleaned), 201


@empresas_bp.route("/<empresa_id>/locais/<local_id>", methods=["PUT"])
@token_required
def update_local(empresa_id, local_id):
    data = request.get_json()
    data["empresaId"] = empresa_id
    cleaned, error = validate_local(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.locais.update_one({"_id": ObjectId(local_id)}, {"$set": cleaned})
    if result.matched_count == 0:
        return jsonify({"error": "Local não encontrado"}), 404

    cleaned["id"] = local_id
    return jsonify(cleaned)


@empresas_bp.route("/<empresa_id>/locais/<local_id>", methods=["DELETE"])
@token_required
def delete_local(empresa_id, local_id):
    db = get_db()
    result = db.locais.delete_one({"_id": ObjectId(local_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Local não encontrado"}), 404
    return jsonify({"message": "Local removido com sucesso"})


# ----- All locais (utility) -----


@empresas_bp.route("/locais/all", methods=["GET"])
@token_required
def list_all_locais():
    db = get_db()
    locais = serialize_list(db.locais.find().sort("nome", 1))
    return jsonify(locais)
