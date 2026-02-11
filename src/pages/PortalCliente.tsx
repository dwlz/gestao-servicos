import { useState } from 'react';
import {
    ShieldCheck,
    Wrench,
    FileText,
    Download,
    Calendar,
    MapPin,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Receipt,
    Eye,
    Building2,
} from 'lucide-react';
import { mockServicos, mockEmpresas, mockLocais, mockOrcamentos } from '../services/mockData';
import clsx from 'clsx';

// Simulate "logged-in client" = Supermercado Compre Bem (id: '1')
const clienteAtualId = '1';

const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    pendente: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', label: 'Pendente', icon: Clock },
    em_andamento: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', label: 'Em Andamento', icon: AlertCircle },
    concluido: { color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', label: 'Concluído', icon: CheckCircle2 },
    cancelado: { color: 'bg-red-500/10 text-red-500 border-red-500/20', label: 'Cancelado', icon: AlertCircle },
};

const orcamentoStatusConfig: Record<string, { color: string; label: string }> = {
    rascunho: { color: 'bg-gray-500/10 text-gray-500', label: 'Rascunho' },
    enviado: { color: 'bg-blue-500/10 text-blue-500', label: 'Enviado' },
    aprovado: { color: 'bg-emerald-500/10 text-emerald-500', label: 'Aprovado' },
    rejeitado: { color: 'bg-red-500/10 text-red-500', label: 'Rejeitado' },
};

const PortalCliente = () => {
    const [expandedServicos, setExpandedServicos] = useState<Record<string, boolean>>({});
    const [activeTab, setActiveTab] = useState<'servicos' | 'orcamentos'>('servicos');

    const empresa = mockEmpresas.find(e => e.id === clienteAtualId)!;
    const locaisCliente = mockLocais.filter(l => l.empresaId === clienteAtualId);
    const servicosCliente = mockServicos.filter(s => s.empresaId === clienteAtualId);
    const orcamentosCliente = mockOrcamentos.filter(o => o.empresaId === clienteAtualId);

    const totalServicos = servicosCliente.length;
    const concluidos = servicosCliente.filter(s => s.status === 'concluido').length;
    const valorTotal = servicosCliente.reduce((acc, s) => acc + s.valorMaoDeObra + s.valorPecas, 0);

    const toggleExpand = (id: string) => {
        setExpandedServicos(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getLocal = (id: string) => mockLocais.find(l => l.id === id);

    // Find orcamento linked to a servico (by empresaId + localId match)
    const getOrcamentoForServico = (servicoLocalId: string) => {
        return mockOrcamentos.find(o => o.empresaId === clienteAtualId && o.localId === servicoLocalId);
    };

    const handleDownloadNfce = (servicoId: string) => {
        const blob = new Blob(
            [`NFC-e SIMULADA\n\nNúmero: ${servicoId}\nEmpresa: ${empresa.nome}\nCNPJ: ${empresa.cnpj}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nEste é um documento fiscal simulado para fins de demonstração.`],
            { type: 'text/plain' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nfce-${servicoId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="animate-page-enter">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                    <ShieldCheck size={22} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Portal do Cliente</h1>
                    <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">Acompanhe os serviços e documentos fiscais da sua empresa.</p>
                </div>
            </div>

            {/* Client Info Banner */}
            <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 rounded-2xl p-5 mb-8 animate-slide-up stagger-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{empresa.nome}</h2>
                            <p className="text-xs text-[var(--color-text-muted)]">CNPJ: {empresa.cnpj} • {empresa.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center">
                            <p className="text-xl font-bold text-[var(--color-text-primary)]">{totalServicos}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold tracking-wider">Serviços</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-emerald-500">{concluidos}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold tracking-wider">Concluídos</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-[var(--color-accent)]">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold tracking-wider">Valor Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl p-1 mb-6 w-fit animate-slide-up stagger-2">
                <button
                    onClick={() => setActiveTab('servicos')}
                    className={clsx(
                        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                        activeTab === 'servicos'
                            ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                    )}
                >
                    <Wrench size={16} />
                    Serviços Prestados
                </button>
                <button
                    onClick={() => setActiveTab('orcamentos')}
                    className={clsx(
                        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                        activeTab === 'orcamentos'
                            ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                    )}
                >
                    <FileText size={16} />
                    Orçamentos
                </button>
            </div>

            {/* Tab Content: Servicos */}
            {activeTab === 'servicos' && (
                <div className="space-y-3">
                    {servicosCliente.length > 0 ? (
                        servicosCliente.map((servico, i) => {
                            const local = getLocal(servico.localId);
                            const orcamento = getOrcamentoForServico(servico.localId);
                            const status = statusConfig[servico.status];
                            const StatusIcon = status.icon;
                            const isExpanded = expandedServicos[servico.id];
                            const totalServico = servico.valorMaoDeObra + servico.valorPecas;

                            return (
                                <div
                                    key={servico.id}
                                    className="animate-slide-up bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden card-hover"
                                    style={{ animationDelay: `${(i + 3) * 0.08}s`, animationFillMode: 'both' }}
                                >
                                    {/* Main Row — always visible */}
                                    <button
                                        onClick={() => toggleExpand(servico.id)}
                                        className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 text-left hover:bg-[var(--color-surface-hover)]/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={clsx("p-2.5 rounded-xl", servico.tipo === 'preventiva' ? "bg-blue-500/10 text-blue-500" : servico.tipo === 'corretiva' ? "bg-orange-500/10 text-orange-500" : "bg-purple-500/10 text-purple-500")}>
                                                <Wrench size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{servico.titulo}</h3>
                                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(servico.dataAgendamento).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {local?.nome || '—'}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-md tracking-wider">
                                                        {servico.tipo}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-base font-bold text-[var(--color-text-primary)]">
                                                    R$ {totalServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>
                                            <div className={clsx("flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border", status.color)}>
                                                <StatusIcon size={13} />
                                                {status.label}
                                            </div>
                                            <div className={clsx("transition-transform duration-200", isExpanded && "rotate-180")}>
                                                <ChevronDown size={18} className="text-[var(--color-text-muted)]" />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5 animate-slide-down">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Service Details */}
                                                <div className="md:col-span-2 space-y-4">
                                                    <div>
                                                        <h4 className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-2">Descrição do Serviço</h4>
                                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{servico.descricao}</p>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-[var(--color-surface-card)] p-3 rounded-xl border border-[var(--color-border)]">
                                                            <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-1">Mão de Obra</p>
                                                            <p className="text-base font-bold text-[var(--color-text-primary)]">R$ {servico.valorMaoDeObra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                        </div>
                                                        <div className="bg-[var(--color-surface-card)] p-3 rounded-xl border border-[var(--color-border)]">
                                                            <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-1">Peças / Materiais</p>
                                                            <p className="text-base font-bold text-[var(--color-text-primary)]">R$ {servico.valorPecas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                        </div>
                                                    </div>
                                                    {servico.dataConclusao && (
                                                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold">
                                                            <CheckCircle2 size={14} />
                                                            Concluído em {new Date(servico.dataConclusao).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions & Linked Budget */}
                                                <div className="space-y-3">
                                                    {orcamento && (
                                                        <div className="bg-[var(--color-surface-card)] p-4 rounded-xl border border-[var(--color-border)]">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FileText size={14} className="text-[var(--color-accent)]" />
                                                                <h4 className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Orçamento Vinculado</h4>
                                                            </div>
                                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">{orcamento.numero}</p>
                                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">R$ {orcamento.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                            <span className={clsx("mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full", orcamentoStatusConfig[orcamento.status].color)}>
                                                                {orcamentoStatusConfig[orcamento.status].label}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {servico.status === 'concluido' && (
                                                        <button
                                                            onClick={() => handleDownloadNfce(servico.id)}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                                                        >
                                                            <Download size={16} />
                                                            Baixar NFC-e
                                                        </button>
                                                    )}

                                                    <button
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-accent-light)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent)]/20 rounded-xl text-sm font-medium transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                        Ver Detalhes Completos
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-[var(--color-surface-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
                            <Wrench size={40} className="mx-auto text-[var(--color-text-muted)] mb-3" />
                            <p className="text-[var(--color-text-muted)] text-lg font-medium">Nenhum serviço encontrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Orcamentos */}
            {activeTab === 'orcamentos' && (
                <div className="space-y-3">
                    {orcamentosCliente.length > 0 ? (
                        orcamentosCliente.map((orcamento, i) => {
                            const local = getLocal(orcamento.localId);

                            return (
                                <div
                                    key={orcamento.id}
                                    className="animate-slide-up bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-5 card-hover"
                                    style={{ animationDelay: `${(i + 3) * 0.08}s`, animationFillMode: 'both' }}
                                >
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                                                <Receipt size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{orcamento.numero}</span>
                                                    <span className={clsx("text-[10px] font-bold px-2.5 py-0.5 rounded-full", orcamentoStatusConfig[orcamento.status].color)}>
                                                        {orcamentoStatusConfig[orcamento.status].label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-text-muted)]">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</span>
                                                    <span className="flex items-center gap-1"><MapPin size={12} /> {local?.nome || '—'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Valor Total</p>
                                                <p className="text-xl font-bold text-[var(--color-text-primary)]">R$ {orcamento.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items Table */}
                                    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                                        <h4 className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-3">Itens do Orçamento</h4>
                                        <div className="space-y-2">
                                            {orcamento.itens.map(item => (
                                                <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-[var(--color-surface)] rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                                                        <span className="text-sm text-[var(--color-text-primary)]">{item.descricao}</span>
                                                    </div>
                                                    <div className="flex items-center gap-6 text-sm">
                                                        <span className="text-[var(--color-text-muted)]">Qtd: {item.qtd}</span>
                                                        <span className="font-semibold text-[var(--color-text-primary)]">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-end">
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            Válido até: <span className="font-semibold text-[var(--color-text-primary)]">{new Date(orcamento.validade).toLocaleDateString('pt-BR')}</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-16 bg-[var(--color-surface-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
                            <FileText size={40} className="mx-auto text-[var(--color-text-muted)] mb-3" />
                            <p className="text-[var(--color-text-muted)] text-lg font-medium">Nenhum orçamento encontrado.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PortalCliente;
