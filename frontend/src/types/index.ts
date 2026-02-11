export type TipoPessoa = 'pj' | 'pf';

export interface Empresa {
    id: string;
    tipoPessoa: TipoPessoa;
    nome: string;
    cnpj: string;  // CNPJ para PJ, CPF para PF
    cpf?: string;   // CPF (usado apenas para PF)
    contato: string;
    email: string;
    telefone: string;
    endereco: string;
}

export interface Local {
    id: string;
    empresaId: string;
    nome: string; // Ex: Loja Centro, Filial Norte
    endereco: string;
    responsavel: string;
}

export type StatusServico = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
export type TipoServico = 'preventiva' | 'corretiva' | 'instalacao' | 'outros';

export interface Servico {
    id: string;
    empresaId: string;
    localId: string;
    titulo: string;
    descricao: string;
    dataAgendamento: string;
    dataConclusao?: string;
    status: StatusServico;
    tipo: TipoServico;
    valorMaoDeObra: number;
    valorPecas: number;
    equipamento?: string;
    fotos?: string[]; // URLs
}

export type StatusOrcamento = 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';

export interface ItemOrcamento {
    id: string;
    descricao: string;
    qtd: number;
    valorUnitario: number;
    total: number;
}

export interface Orcamento {
    id: string;
    empresaId: string;
    localId: string;
    numero: string; // Ex: #2024-001
    dataCriacao: string;
    validade: string;
    status: StatusOrcamento;
    itens: ItemOrcamento[];
    valorTotal: number;
    observacoes?: string;
}

export interface TransacaoFinanceira {
    id: string;
    tipo: 'receita' | 'despesa';
    categoria: string;
    descricao: string;
    valor: number;
    data: string;
    status: 'pago' | 'pendente';
    referenciaId?: string; // ID do serviço ou orçamento
}
