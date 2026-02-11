from flask import Blueprint, request, jsonify
from ..database import get_db
from ..models import validate_servico, serialize_doc, serialize_list
from .auth import token_required
from bson import ObjectId

servicos_bp = Blueprint("servicos", __name__, url_prefix="/api/servicos")


@servicos_bp.route("", methods=["GET"])
@token_required
def list_servicos():
    db = get_db()
    query = {}

    empresa_id = request.args.get("empresaId")
    if empresa_id:
        query["empresaId"] = empresa_id

    status = request.args.get("status")
    if status:
        query["status"] = status

    tipo = request.args.get("tipo")
    if tipo:
        query["tipo"] = tipo

    servicos = serialize_list(
        db.servicos.find(query).sort("dataAgendamento", -1)
    )
    return jsonify(servicos)


@servicos_bp.route("", methods=["POST"])
@token_required
def create_servico():
    data = request.get_json()
    cleaned, error = validate_servico(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.servicos.insert_one(cleaned)
    cleaned["id"] = str(result.inserted_id)
    return jsonify(cleaned), 201


@servicos_bp.route("/<servico_id>", methods=["GET"])
@token_required
def get_servico(servico_id):
    db = get_db()
    servico = db.servicos.find_one({"_id": ObjectId(servico_id)})
    if not servico:
        return jsonify({"error": "Serviço não encontrado"}), 404
    return jsonify(serialize_doc(servico))


@servicos_bp.route("/<servico_id>", methods=["PUT"])
@token_required
def update_servico(servico_id):
    data = request.get_json()
    cleaned, error = validate_servico(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.servicos.update_one({"_id": ObjectId(servico_id)}, {"$set": cleaned})
    if result.matched_count == 0:
        return jsonify({"error": "Serviço não encontrado"}), 404

    cleaned["id"] = servico_id
    return jsonify(cleaned)


@servicos_bp.route("/<servico_id>", methods=["DELETE"])
@token_required
def delete_servico(servico_id):
    db = get_db()
    result = db.servicos.delete_one({"_id": ObjectId(servico_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Serviço não encontrado"}), 404
    return jsonify({"message": "Serviço removido com sucesso"})
