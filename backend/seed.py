"""
Seed script — popula o MongoDB com dados iniciais.
Uso: cd backend && python seed.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.config import Config
from app.database import get_db
from app.routes.auth import hash_password


def seed():
    db = get_db()
    print(f"🌱 Conectado ao MongoDB: {Config.DB_NAME}")

    # ---- Users ----
    if db.users.count_documents({}) == 0:
        print("  👤 Criando usuário admin...")
        db.users.insert_one(
            {
                "nome": "Will Prestador",
                "email": "will@servicepro.com",
                "senha": hash_password("123456"),
            }
        )
    else:
        print("  👤 Usuários já existem, pulando...")

    # ---- Empresas ----
    if db.empresas.count_documents({}) == 0:
        print("  🏢 Criando empresas...")
        empresas = [
            {
                "_id_ref": "1",
                "tipoPessoa": "pj",
                "nome": "Supermercado Compre Bem",
                "cnpj": "12.345.678/0001-90",
                "cpf": "",
                "contato": "Carlos Gerente",
                "email": "compras@comprebem.com",
                "telefone": "(11) 99999-0000",
                "endereco": "Av. Principal, 1000",
            },
            {
                "_id_ref": "2",
                "tipoPessoa": "pj",
                "nome": "Padaria Pão Quente",
                "cnpj": "98.765.432/0001-10",
                "cpf": "",
                "contato": "Ana Proprietária",
                "email": "ana@paoquente.com",
                "telefone": "(11) 98888-1111",
                "endereco": "Rua das Flores, 50",
            },
            {
                "_id_ref": "3",
                "tipoPessoa": "pf",
                "nome": "Roberto da Silva",
                "cnpj": "",
                "cpf": "123.456.789-00",
                "contato": "Roberto",
                "email": "roberto.silva@email.com",
                "telefone": "(11) 97777-2222",
                "endereco": "Rua dos Lírios, 120 - Casa",
            },
        ]
        inserted_empresas = {}
        for emp in empresas:
            ref = emp.pop("_id_ref")
            result = db.empresas.insert_one(emp)
            inserted_empresas[ref] = str(result.inserted_id)
    else:
        print("  🏢 Empresas já existem, pulando...")
        # Map existing empresas
        inserted_empresas = {}
        for i, emp in enumerate(db.empresas.find().limit(3), 1):
            inserted_empresas[str(i)] = str(emp["_id"])

    # ---- Locais ----
    if db.locais.count_documents({}) == 0:
        print("  📍 Criando locais...")
        locais = [
            {
                "_id_ref": "l1",
                "empresaId": inserted_empresas.get("1", "1"),
                "nome": "Matriz - Centro",
                "endereco": "Av. Principal, 1000",
                "responsavel": "João",
            },
            {
                "_id_ref": "l2",
                "empresaId": inserted_empresas.get("1", "1"),
                "nome": "Filial - Norte",
                "endereco": "Rua Norte, 200",
                "responsavel": "Pedro",
            },
            {
                "_id_ref": "l3",
                "empresaId": inserted_empresas.get("2", "2"),
                "nome": "Unidade Única",
                "endereco": "Rua das Flores, 50",
                "responsavel": "Ana",
            },
            {
                "_id_ref": "l4",
                "empresaId": inserted_empresas.get("3", "3"),
                "nome": "Residência",
                "endereco": "Rua dos Lírios, 120 - Casa",
                "responsavel": "Roberto",
            },
        ]
        inserted_locais = {}
        for loc in locais:
            ref = loc.pop("_id_ref")
            result = db.locais.insert_one(loc)
            inserted_locais[ref] = str(result.inserted_id)
    else:
        print("  📍 Locais já existem, pulando...")
        inserted_locais = {}
        for i, loc in enumerate(db.locais.find().limit(4)):
            inserted_locais[f"l{i+1}"] = str(loc["_id"])

    # ---- Serviços ----
    if db.servicos.count_documents({}) == 0:
        print("  🔧 Criando serviços...")
        servicos = [
            {
                "empresaId": inserted_empresas.get("1", "1"),
                "localId": inserted_locais.get("l1", "l1"),
                "titulo": "Manutenção Preventiva Câmara Fria",
                "descricao": "Limpeza de condensadora e verificação de gás.",
                "dataAgendamento": "2024-02-10",
                "status": "pendente",
                "tipo": "preventiva",
                "valorMaoDeObra": 350,
                "valorPecas": 0,
                "equipamento": "",
                "fotos": [],
            },
            {
                "empresaId": inserted_empresas.get("1", "1"),
                "localId": inserted_locais.get("l2", "l2"),
                "titulo": "Troca de Compressor",
                "descricao": "Compressor queimado, substituição necessária.",
                "dataAgendamento": "2024-02-08",
                "dataConclusao": "2024-02-08",
                "status": "concluido",
                "tipo": "corretiva",
                "valorMaoDeObra": 800,
                "valorPecas": 2500,
                "equipamento": "",
                "fotos": [],
            },
            {
                "empresaId": inserted_empresas.get("2", "2"),
                "localId": inserted_locais.get("l3", "l3"),
                "titulo": "Instalação Ar Condicionado",
                "descricao": "Split 12000 BTUs",
                "dataAgendamento": "2024-02-12",
                "status": "pendente",
                "tipo": "instalacao",
                "valorMaoDeObra": 500,
                "valorPecas": 150,
                "equipamento": "",
                "fotos": [],
            },
        ]
        for s in servicos:
            db.servicos.insert_one(s)
    else:
        print("  🔧 Serviços já existem, pulando...")

    # ---- Orçamentos ----
    if db.orcamentos.count_documents({}) == 0:
        print("  📄 Criando orçamentos...")
        orcamentos = [
            {
                "empresaId": inserted_empresas.get("1", "1"),
                "localId": inserted_locais.get("l1", "l1"),
                "numero": "#2024-001",
                "dataCriacao": "2024-02-09",
                "validade": "2024-02-19",
                "status": "enviado",
                "valorTotal": 3500,
                "itens": [
                    {"id": "i1", "descricao": "Compressor 2HP", "qtd": 1, "valorUnitario": 2500, "total": 2500},
                    {"id": "i2", "descricao": "Mão de Obra", "qtd": 1, "valorUnitario": 1000, "total": 1000},
                ],
                "observacoes": "",
            },
            {
                "empresaId": inserted_empresas.get("2", "2"),
                "localId": inserted_locais.get("l3", "l3"),
                "numero": "#2024-002",
                "dataCriacao": "2024-02-10",
                "validade": "2024-02-20",
                "status": "rascunho",
                "valorTotal": 850,
                "itens": [
                    {"id": "i3", "descricao": "Carga de Gás R404a", "qtd": 1, "valorUnitario": 450, "total": 450},
                    {"id": "i4", "descricao": "Limpeza Química", "qtd": 1, "valorUnitario": 400, "total": 400},
                ],
                "observacoes": "",
            },
        ]
        for o in orcamentos:
            db.orcamentos.insert_one(o)
    else:
        print("  📄 Orçamentos já existem, pulando...")

    # ---- Transações ----
    if db.transacoes.count_documents({}) == 0:
        print("  💰 Criando transações financeiras...")
        transacoes = [
            {
                "tipo": "receita",
                "categoria": "Serviço",
                "descricao": "Manutenção Balcão Frios",
                "valor": 450,
                "data": "2024-02-01",
                "status": "pago",
            },
            {
                "tipo": "despesa",
                "categoria": "Peças",
                "descricao": "Compra de Gás",
                "valor": 1200,
                "data": "2024-02-02",
                "status": "pago",
            },
            {
                "tipo": "receita",
                "categoria": "Projeto",
                "descricao": "Instalação Câmara Fria",
                "valor": 15000,
                "data": "2024-02-05",
                "status": "pendente",
            },
        ]
        for t in transacoes:
            db.transacoes.insert_one(t)
    else:
        print("  💰 Transações já existem, pulando...")

    print("\n✅ Seed concluído com sucesso!")


if __name__ == "__main__":
    seed()
