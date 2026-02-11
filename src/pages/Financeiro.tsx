import { mockTransacoes } from '../services/mockData';
import { ArrowUpCircle, ArrowDownCircle, Filter, Download, Wallet } from 'lucide-react';
import clsx from 'clsx';

const Financeiro = () => {
    const totalReceitas = mockTransacoes
        .filter(t => t.tipo === 'receita' && t.status === 'pago')
        .reduce((acc, curr) => acc + curr.valor, 0);

    const totalDespesas = mockTransacoes
        .filter(t => t.tipo === 'despesa' && t.status === 'pago')
        .reduce((acc, curr) => acc + curr.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    return (
        <div className="animate-page-enter">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                    <Wallet size={22} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Financeiro</h1>
                    <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">Controle de receitas, despesas e fluxo de caixa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="animate-slide-up stagger-1">
                    <div className="bg-[var(--color-surface-card)] p-5 rounded-2xl border border-[var(--color-border)] card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                <ArrowUpCircle size={18} />
                            </div>
                            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Receitas (Mês)</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-500">+ R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="animate-slide-up stagger-2">
                    <div className="bg-[var(--color-surface-card)] p-5 rounded-2xl border border-[var(--color-border)] card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                <ArrowDownCircle size={18} />
                            </div>
                            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Despesas (Mês)</p>
                        </div>
                        <p className="text-2xl font-bold text-red-500">- R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="animate-slide-up stagger-3">
                    <div className="bg-[var(--color-surface-card)] p-5 rounded-2xl border border-[var(--color-border)] card-hover">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <Wallet size={18} />
                            </div>
                            <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Saldo Atual</p>
                        </div>
                        <p className={clsx("text-2xl font-bold", saldo >= 0 ? "text-blue-500" : "text-red-500")}>
                            R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="animate-slide-up stagger-4">
                <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
                    <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Extrato Recente</h3>
                        <div className="flex gap-2">
                            <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                                <Filter size={18} />
                            </button>
                            <button className="p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--color-surface)]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Data</th>
                                    <th className="px-5 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Descrição</th>
                                    <th className="px-5 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Categoria</th>
                                    <th className="px-5 py-3 text-left text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-right text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {mockTransacoes.map((transacao) => (
                                    <tr key={transacao.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
                                            {new Date(transacao.data).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx("p-1.5 rounded-lg", transacao.tipo === 'receita' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                                                    {transacao.tipo === 'receita' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                                                </div>
                                                <span className="font-medium text-sm text-[var(--color-text-primary)]">{transacao.descricao}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-text-muted)] text-[11px] font-medium">
                                                {transacao.categoria}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                                                transacao.status === 'pago'
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                            )}>
                                                {transacao.status === 'pago' ? 'Pago' : 'Pendente'}
                                            </span>
                                        </td>
                                        <td className={clsx("px-5 py-4 text-right text-sm font-semibold", transacao.tipo === 'receita' ? "text-emerald-500" : "text-red-500")}>
                                            {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Financeiro;
