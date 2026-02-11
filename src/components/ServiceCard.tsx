import type { Servico, Empresa, Local } from '../types';
import { Calendar, MapPin, Wrench, Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

interface ServiceCardProps {
    servico: Servico;
    empresa?: Empresa;
    local?: Local;
}

const statusConfig = {
    pendente: { color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pendente' },
    em_andamento: { color: 'text-blue-600 bg-blue-500/10 border-blue-500/20', icon: Wrench, label: 'Em Andamento' },
    concluido: { color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle, label: 'Concluído' },
    cancelado: { color: 'text-red-600 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Cancelado' },
};

const typeConfig = {
    preventiva: { color: 'bg-indigo-500/10 text-indigo-500', label: 'Preventiva' },
    corretiva: { color: 'bg-orange-500/10 text-orange-500', label: 'Corretiva' },
    instalacao: { color: 'bg-purple-500/10 text-purple-500', label: 'Instalação' },
    outros: { color: 'bg-gray-500/10 text-gray-500', label: 'Outros' },
};

const ServiceCard: React.FC<ServiceCardProps> = ({ servico, empresa, local }) => {
    const statusStyle = statusConfig[servico.status];
    const typeStyle = typeConfig[servico.tipo];

    return (
        <div className="bg-[var(--color-surface-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={clsx("p-2.5 rounded-xl shrink-0", statusStyle.color.split(' ').slice(1).join(' '))}>
                        <statusStyle.icon size={20} className={statusStyle.color.split(' ')[0]} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide", typeStyle.color)}>
                                {typeStyle.label}
                            </span>
                            <span className="text-[11px] text-[var(--color-text-muted)] font-mono">#{servico.id.toUpperCase()}</span>
                        </div>

                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
                            {servico.titulo}
                        </h3>

                        <p className="text-[var(--color-text-muted)] text-xs mt-1 line-clamp-1">
                            {servico.descricao}
                        </p>

                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-lg">
                                <Calendar size={13} className="text-[var(--color-text-muted)]" />
                                <span>{new Date(servico.dataAgendamento).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-lg">
                                <MapPin size={13} className="text-[var(--color-text-muted)]" />
                                <span className="font-medium">{empresa?.nome}</span>
                                {local && <span className="text-[var(--color-text-muted)]">• {local.nome}</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    <button className="p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={18} />
                    </button>
                    <div className={clsx("inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold", statusStyle.color)}>
                        {statusStyle.label}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
