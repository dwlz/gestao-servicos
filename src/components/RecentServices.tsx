import type { Servico, Empresa } from '../types';
import { Calendar, Wrench } from 'lucide-react';
import clsx from 'clsx';

interface RecentServicesProps {
    servicos: Servico[];
    empresas: Empresa[];
}

const statusColor: Record<string, string> = {
    pendente: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    em_andamento: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    concluido: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    cancelado: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const statusLabel: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
};

const RecentServices: React.FC<RecentServicesProps> = ({ servicos, empresas }) => {
    const getEmpresaNome = (id: string) => empresas.find(e => e.id === id)?.nome || '—';

    return (
        <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Serviços Recentes</h3>
                <button className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold transition-colors">Ver todos →</button>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
                {servicos.map((servico) => (
                    <div key={servico.id} className="p-5 hover:bg-[var(--color-surface-hover)] transition-colors flex items-start gap-4">
                        <div className="p-2.5 bg-[var(--color-surface)] rounded-xl text-[var(--color-text-muted)]">
                            <Wrench size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <h4 className="font-semibold text-[var(--color-text-primary)] text-sm truncate">{servico.titulo}</h4>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{getEmpresaNome(servico.empresaId)}</p>
                                </div>
                                <span className={clsx(
                                    "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0",
                                    statusColor[servico.status]
                                )}>
                                    {statusLabel[servico.status]}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 mt-3 text-[11px] text-[var(--color-text-muted)]">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{new Date(servico.dataAgendamento).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <span className="px-1.5 py-0.5 bg-[var(--color-surface)] rounded text-[10px] font-bold uppercase tracking-wide">
                                    {servico.tipo}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentServices;
