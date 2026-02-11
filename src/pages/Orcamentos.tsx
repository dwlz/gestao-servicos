import { mockOrcamentos, mockEmpresas } from '../services/mockData';
import { FileText, Plus, Check, X, Send, ClipboardList } from 'lucide-react';
import clsx from 'clsx';

const statusConfig = {
    rascunho: { color: 'bg-gray-500/10 text-gray-500', label: 'Rascunho', icon: FileText },
    enviado: { color: 'bg-blue-500/10 text-blue-500', label: 'Enviado', icon: Send },
    aprovado: { color: 'bg-emerald-500/10 text-emerald-500', label: 'Aprovado', icon: Check },
    rejeitado: { color: 'bg-red-500/10 text-red-500', label: 'Rejeitado', icon: X },
};

const Orcamentos = () => {
    const getEmpresaNome = (id: string) => mockEmpresas.find(e => e.id === id)?.nome || '—';

    return (
        <div className="animate-page-enter">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                        <ClipboardList size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Orçamentos</h1>
                        <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">Gerencie propostas comerciais.</p>
                    </div>
                </div>
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all text-sm hover:scale-105 active:scale-95">
                    <Plus size={18} />
                    Novo Orçamento
                </button>
            </div>

            <div className="grid gap-4">
                {mockOrcamentos.map((orcamento, i) => {
                    const StatusIcon = statusConfig[orcamento.status].icon;

                    return (
                        <div key={orcamento.id} className="animate-slide-up" style={{ animationDelay: `${(i + 1) * 0.08}s`, animationFillMode: 'both' }}>
                            <div className="bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border)] p-5 card-hover gradient-border">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                                            <FileText size={22} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-[var(--color-text-primary)]">{orcamento.numero}</span>
                                                <span className="text-[var(--color-text-muted)]">•</span>
                                                <span className="text-xs text-[var(--color-text-muted)]">{new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-[var(--color-text-primary)]">{getEmpresaNome(orcamento.empresaId)}</h3>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                                {orcamento.itens.length} itens • Validade: {new Date(orcamento.validade).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-wider">Valor Total</p>
                                            <p className="text-xl font-bold text-[var(--color-text-primary)]">
                                                R$ {orcamento.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className={clsx("flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-xs", statusConfig[orcamento.status].color)}>
                                            <StatusIcon size={14} />
                                            <span>{statusConfig[orcamento.status].label}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex justify-end gap-3">
                                    <button className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg text-xs font-medium transition-colors">
                                        Visualizar PDF
                                    </button>
                                    <button className="px-4 py-2 bg-[var(--color-accent-light)] text-[var(--color-accent-text)] hover:bg-[var(--color-accent)]/20 rounded-lg text-xs font-medium transition-colors">
                                        Editar Orçamento
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Orcamentos;
