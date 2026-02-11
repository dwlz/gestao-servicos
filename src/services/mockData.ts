import { Empresa, Local, Servico, Orcamento, TransacaoFinanceira } from '../types';

export const mockEmpresas: Empresa[] = [
    {
        id: '1',
        tipoPessoa: 'pj',
        nome: 'Supermercado Compre Bem',
        cnpj: '12.345.678/0001-90',
        contato: 'Carlos Gerente',
        email: 'compras@comprebem.com',
        telefone: '(11) 99999-0000',
        endereco: 'Av. Principal, 1000'
    },
    {
        id: '2',
        tipoPessoa: 'pj',
        nome: 'Padaria Pão Quente',
        cnpj: '98.765.432/0001-10',
        contato: 'Ana Proprietária',
        email: 'ana@paoquente.com',
        telefone: '(11) 98888-1111',
        endereco: 'Rua das Flores, 50'
    },
    {
        id: '3',
        tipoPessoa: 'pf',
        nome: 'Roberto da Silva',
        cnpj: '',
        cpf: '123.456.789-00',
        contato: 'Roberto',
        email: 'roberto.silva@email.com',
        telefone: '(11) 97777-2222',
        endereco: 'Rua dos Lírios, 120 - Casa'
    }
];

export const mockLocais: Local[] = [
    { id: 'l1', empresaId: '1', nome: 'Matriz - Centro', endereco: 'Av. Principal, 1000', responsavel: 'João' },
    { id: 'l2', empresaId: '1', nome: 'Filial - Norte', endereco: 'Rua Norte, 200', responsavel: 'Pedro' },
    { id: 'l3', empresaId: '2', nome: 'Unidade Única', endereco: 'Rua das Flores, 50', responsavel: 'Ana' },
    { id: 'l4', empresaId: '3', nome: 'Residência', endereco: 'Rua dos Lírios, 120 - Casa', responsavel: 'Roberto' }
];

export const mockServicos: Servico[] = [
    {
        id: 's1',
        empresaId: '1',
        localId: 'l1',
        titulo: 'Manutenção Preventiva Câmara Fria',
        descricao: 'Limpeza de condensadora e verificação de gás.',
        dataAgendamento: '2024-02-10',
        status: 'pendente',
        tipo: 'preventiva',
        valorMaoDeObra: 350,
        valorPecas: 0
    },
    {
        id: 's2',
        empresaId: '1',
        localId: 'l2',
        titulo: 'Troca de Compressor',
        descricao: 'Compressor queimado, substituição necessária.',
        dataAgendamento: '2024-02-08',
        dataConclusao: '2024-02-08',
        status: 'concluido',
        tipo: 'corretiva',
        valorMaoDeObra: 800,
        valorPecas: 2500
    },
    {
        id: 's3',
        empresaId: '2',
        localId: 'l3',
        titulo: 'Instalação Ar Condicionado',
        descricao: 'Split 12000 BTUs',
        dataAgendamento: '2024-02-12',
        status: 'pendente',
        tipo: 'instalacao',
        valorMaoDeObra: 500,
        valorPecas: 150
    }
];

export const mockOrcamentos: Orcamento[] = [
    {
        id: 'o1',
        empresaId: '1',
        localId: 'l1',
        numero: '#2024-001',
        dataCriacao: '2024-02-09',
        validade: '2024-02-19',
        status: 'enviado',
        valorTotal: 3500,
        itens: [
            { id: 'i1', descricao: 'Compressor 2HP', qtd: 1, valorUnitario: 2500, total: 2500 },
            { id: 'i2', descricao: 'Mão de Obra', qtd: 1, valorUnitario: 1000, total: 1000 }
        ]
    },
    {
        id: 'o2',
        empresaId: '2',
        localId: 'l3',
        numero: '#2024-002',
        dataCriacao: '2024-02-10',
        validade: '2024-02-20',
        status: 'rascunho',
        valorTotal: 850,
        itens: [
            { id: 'i3', descricao: 'Carga de Gás R404a', qtd: 1, valorUnitario: 450, total: 450 },
            { id: 'i4', descricao: 'Limpeza Química', qtd: 1, valorUnitario: 400, total: 400 }
        ]
    }
];

export const mockTransacoes: TransacaoFinanceira[] = [
    {
        id: 't1',
        tipo: 'receita',
        categoria: 'Serviço',
        descricao: 'Manutenção Balcão Frios',
        valor: 450,
        data: '2024-02-01',
        status: 'pago',
        referenciaId: 's10'
    },
    {
        id: 't2',
        tipo: 'despesa',
        categoria: 'Peças',
        descricao: 'Compra de Gás',
        valor: 1200,
        data: '2024-02-02',
        status: 'pago'
    },
    {
        id: 't3',
        tipo: 'receita',
        categoria: 'Projeto',
        descricao: 'Instalação Câmara Fria',
        valor: 15000,
        data: '2024-02-05',
        status: 'pendente',
        referenciaId: 'o5'
    }
];

export const mockStats = {
    servicosHoje: 1,
    orcamentosPendentes: mockOrcamentos.filter(o => o.status === 'enviado' || o.status === 'rascunho').length,
    faturamentoMes: 15450.00,
    servicosConcluidosMes: 12
};
