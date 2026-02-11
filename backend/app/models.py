"""Validation and serialization helpers for MongoDB documents."""

from bson import ObjectId
from datetime import datetime


def serialize_doc(doc):
    """Convert a MongoDB document to a JSON-serializable dict."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc


def serialize_list(cursor):
    """Convert a MongoDB cursor to a list of serialized dicts."""
    return [serialize_doc(doc) for doc in cursor]


def validate_empresa(data):
    """Validate empresa data. Returns (cleaned_data, error)."""
    required = ["nome", "contato", "email", "telefone", "endereco"]
    for field in required:
        if not data.get(field):
            return None, f"Campo obrigatório: {field}"

    tipo_pessoa = data.get("tipoPessoa", "pj")
    if tipo_pessoa not in ("pj", "pf"):
        return None, "tipoPessoa deve ser 'pj' ou 'pf'"

    cleaned = {
        "tipoPessoa": tipo_pessoa,
        "nome": data["nome"].strip(),
        "cnpj": data.get("cnpj", "").strip(),
        "cpf": data.get("cpf", "").strip(),
        "contato": data["contato"].strip(),
        "email": data["email"].strip(),
        "telefone": data["telefone"].strip(),
        "endereco": data["endereco"].strip(),
    }
    return cleaned, None


def validate_local(data):
    """Validate local data."""
    required = ["empresaId", "nome", "endereco", "responsavel"]
    for field in required:
        if not data.get(field):
            return None, f"Campo obrigatório: {field}"

    return {
        "empresaId": data["empresaId"],
        "nome": data["nome"].strip(),
        "endereco": data["endereco"].strip(),
        "responsavel": data["responsavel"].strip(),
    }, None


def validate_servico(data):
    """Validate servico data."""
    required = ["empresaId", "localId", "titulo", "descricao", "dataAgendamento", "tipo"]
    for field in required:
        if not data.get(field):
            return None, f"Campo obrigatório: {field}"

    status = data.get("status", "pendente")
    if status not in ("pendente", "em_andamento", "concluido", "cancelado"):
        return None, "Status inválido"

    tipo = data["tipo"]
    if tipo not in ("preventiva", "corretiva", "instalacao", "outros"):
        return None, "Tipo inválido"

    return {
        "empresaId": data["empresaId"],
        "localId": data["localId"],
        "titulo": data["titulo"].strip(),
        "descricao": data["descricao"].strip(),
        "dataAgendamento": data["dataAgendamento"],
        "dataConclusao": data.get("dataConclusao"),
        "status": status,
        "tipo": tipo,
        "valorMaoDeObra": float(data.get("valorMaoDeObra", 0)),
        "valorPecas": float(data.get("valorPecas", 0)),
        "equipamento": data.get("equipamento", ""),
        "fotos": data.get("fotos", []),
    }, None


def validate_orcamento(data):
    """Validate orcamento data."""
    required = ["empresaId", "localId", "numero", "dataCriacao", "validade"]
    for field in required:
        if not data.get(field):
            return None, f"Campo obrigatório: {field}"

    status = data.get("status", "rascunho")
    if status not in ("rascunho", "enviado", "aprovado", "rejeitado"):
        return None, "Status inválido"

    itens = data.get("itens", [])
    cleaned_itens = []
    for item in itens:
        cleaned_itens.append({
            "id": item.get("id", str(ObjectId())),
            "descricao": item.get("descricao", ""),
            "qtd": int(item.get("qtd", 0)),
            "valorUnitario": float(item.get("valorUnitario", 0)),
            "total": float(item.get("total", 0)),
        })

    return {
        "empresaId": data["empresaId"],
        "localId": data["localId"],
        "numero": data["numero"].strip(),
        "dataCriacao": data["dataCriacao"],
        "validade": data["validade"],
        "status": status,
        "itens": cleaned_itens,
        "valorTotal": float(data.get("valorTotal", 0)),
        "observacoes": data.get("observacoes", ""),
    }, None


def validate_transacao(data):
    """Validate transacao financeira data."""
    required = ["tipo", "categoria", "descricao", "valor", "data", "status"]
    for field in required:
        if not data.get(field):
            return None, f"Campo obrigatório: {field}"

    if data["tipo"] not in ("receita", "despesa"):
        return None, "Tipo deve ser 'receita' ou 'despesa'"
    if data["status"] not in ("pago", "pendente"):
        return None, "Status deve ser 'pago' ou 'pendente'"

    return {
        "tipo": data["tipo"],
        "categoria": data["categoria"].strip(),
        "descricao": data["descricao"].strip(),
        "valor": float(data["valor"]),
        "data": data["data"],
        "status": data["status"],
        "referenciaId": data.get("referenciaId"),
    }, None
