from flask import Blueprint, request, jsonify
from ..database import get_db
from ..models import validate_transacao, serialize_doc, serialize_list
from .auth import token_required
from bson import ObjectId

financeiro_bp = Blueprint("financeiro", __name__, url_prefix="/api/financeiro")


@financeiro_bp.route("", methods=["GET"])
@token_required
def list_transacoes():
    db = get_db()
    query = {}

    tipo = request.args.get("tipo")
    if tipo:
        query["tipo"] = tipo

    status = request.args.get("status")
    if status:
        query["status"] = status

    transacoes = serialize_list(db.transacoes.find(query).sort("data", -1))
    return jsonify(transacoes)


@financeiro_bp.route("", methods=["POST"])
@token_required
def create_transacao():
    data = request.get_json()
    cleaned, error = validate_transacao(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.transacoes.insert_one(cleaned)
    cleaned["id"] = str(result.inserted_id)
    return jsonify(cleaned), 201


@financeiro_bp.route("/<transacao_id>", methods=["PUT"])
@token_required
def update_transacao(transacao_id):
    data = request.get_json()
    cleaned, error = validate_transacao(data)
    if error:
        return jsonify({"error": error}), 400

    db = get_db()
    result = db.transacoes.update_one(
        {"_id": ObjectId(transacao_id)}, {"$set": cleaned}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Transação não encontrada"}), 404

    cleaned["id"] = transacao_id
    return jsonify(cleaned)


@financeiro_bp.route("/<transacao_id>", methods=["DELETE"])
@token_required
def delete_transacao(transacao_id):
    db = get_db()
    result = db.transacoes.delete_one({"_id": ObjectId(transacao_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Transação não encontrada"}), 404
    return jsonify({"message": "Transação removida com sucesso"})


@financeiro_bp.route("/stats", methods=["GET"])
@token_required
def stats():
    db = get_db()
    month = request.args.get("month")  # Format: YYYY-MM

    # Build date filter
    date_filter = {}
    if month:
        date_filter = {
            "data": {"$regex": f"^{month}"}
        }

    # Revenue (receitas pagas)
    pipeline_receita = [
        {"$match": {**date_filter, "tipo": "receita", "status": "pago"}},
        {"$group": {"_id": None, "total": {"$sum": "$valor"}}},
    ]
    receita_result = list(db.transacoes.aggregate(pipeline_receita))
    faturamento = receita_result[0]["total"] if receita_result else 0

    # Expenses (despesas pagas)
    pipeline_despesa = [
        {"$match": {**date_filter, "tipo": "despesa", "status": "pago"}},
        {"$group": {"_id": None, "total": {"$sum": "$valor"}}},
    ]
    despesa_result = list(db.transacoes.aggregate(pipeline_despesa))
    despesas = despesa_result[0]["total"] if despesa_result else 0

    # Serviços stats
    servico_filter = {}
    if month:
        servico_filter["dataAgendamento"] = {"$regex": f"^{month}"}

    servicos_concluidos = db.servicos.count_documents(
        {**servico_filter, "status": "concluido"}
    )
    servicos_pendentes = db.servicos.count_documents(
        {**servico_filter, "status": "pendente"}
    )

    # Orçamentos pendentes
    orcamentos_pendentes = db.orcamentos.count_documents(
        {"status": {"$in": ["enviado", "rascunho"]}}
    )

    return jsonify(
        {
            "faturamentoMes": faturamento,
            "despesasMes": despesas,
            "lucroMes": faturamento - despesas,
            "servicosConcluidosMes": servicos_concluidos,
            "servicosPendentes": servicos_pendentes,
            "orcamentosPendentes": orcamentos_pendentes,
        }
    )


@financeiro_bp.route("/chart", methods=["GET"])
@token_required
def chart_data():
    """Return monthly revenue/expense data for charts."""
    db = get_db()
    year = request.args.get("year", "2024")

    months = []
    for m in range(1, 13):
        month_str = f"{year}-{m:02d}"

        # Receita
        pipeline_r = [
            {"$match": {"data": {"$regex": f"^{month_str}"}, "tipo": "receita", "status": "pago"}},
            {"$group": {"_id": None, "total": {"$sum": "$valor"}}},
        ]
        r = list(db.transacoes.aggregate(pipeline_r))
        receita = r[0]["total"] if r else 0

        # Despesa
        pipeline_d = [
            {"$match": {"data": {"$regex": f"^{month_str}"}, "tipo": "despesa", "status": "pago"}},
            {"$group": {"_id": None, "total": {"$sum": "$valor"}}},
        ]
        d = list(db.transacoes.aggregate(pipeline_d))
        despesa = d[0]["total"] if d else 0

        months.append({
            "month": month_str,
            "receita": receita,
            "despesa": despesa,
            "lucro": receita - despesa,
        })

    return jsonify(months)
