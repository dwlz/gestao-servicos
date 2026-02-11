from flask import Blueprint, request, jsonify
from ..database import get_db
from ..models import validate_orcamento, serialize_doc, serialize_list
from .auth import token_required
from bson import ObjectId

orcamentos_bp = Blueprint("orcamentos", __name__, url_prefix="/api/orcamentos")


@orcamentos_bp.route("", methods=["GET"])
@token_required
def list_orcamentos():
    db = get_db()
    query = {}

    empresa_id = request.args.get("empresaId")
    if empresa_id:
        query["empresaId"] = empresa_id

    status = request.args.get("status")
    if status:
        query["status"] = status

    orcamentos = serialize_list(
        db.orcamentos.find(query).sort("dataCriacao", -1)
    )
    return jsonify(orcamentos)


@orcamentos_bp.route("", methods=["POST"])
@token_required
def create_orcamento():
    data = request.get_json()
    cleaned, error = validate_orcamento(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.orcamentos.insert_one(cleaned)
    cleaned["id"] = str(result.inserted_id)
    return jsonify(cleaned), 201


@orcamentos_bp.route("/<orcamento_id>", methods=["GET"])
@token_required
def get_orcamento(orcamento_id):
    db = get_db()
    orcamento = db.orcamentos.find_one({"_id": ObjectId(orcamento_id)})
    if not orcamento:
        return jsonify({"error": "Orçamento não encontrado"}), 404
    return jsonify(serialize_doc(orcamento))


@orcamentos_bp.route("/<orcamento_id>", methods=["PUT"])
@token_required
def update_orcamento(orcamento_id):
    data = request.get_json()
    cleaned, error = validate_orcamento(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.orcamentos.update_one(
        {"_id": ObjectId(orcamento_id)}, {"$set": cleaned}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Orçamento não encontrado"}), 404

    cleaned["id"] = orcamento_id
    return jsonify(cleaned)


@orcamentos_bp.route("/<orcamento_id>", methods=["DELETE"])
@token_required
def delete_orcamento(orcamento_id):
    db = get_db()
    result = db.orcamentos.delete_one({"_id": ObjectId(orcamento_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Orçamento não encontrado"}), 404
    return jsonify({"message": "Orçamento removido com sucesso"})


@orcamentos_bp.route("/<orcamento_id>/status", methods=["PATCH"])
@token_required
def update_status(orcamento_id):
    data = request.get_json()
    new_status = data.get("status")
    if new_status not in ("rascunho", "enviado", "aprovado", "rejeitado"):
        return jsonify({"error": "Status inválido"}), 400

    db = get_db()
    result = db.orcamentos.update_one(
        {"_id": ObjectId(orcamento_id)}, {"$set": {"status": new_status}}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Orçamento não encontrado"}), 404

    return jsonify({"message": "Status atualizado", "status": new_status})
