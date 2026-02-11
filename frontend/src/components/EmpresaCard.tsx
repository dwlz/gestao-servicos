import { useState } from 'react';
import type { Empresa, Local } from '../types';
import { Building2, MapPin, Phone, Mail, ChevronDown, ChevronUp, Edit, Trash2, User } from 'lucide-react';
import clsx from 'clsx';

interface EmpresaCardProps {
    empresa: Empresa;
    locais: Local[];
}

const EmpresaCard: React.FC<EmpresaCardProps> = ({ empresa, locais }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-300 hover:shadow-md">
            <div
                className="p-5 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className={clsx(
                            "p-3 rounded-xl",
                            empresa.tipoPessoa === 'pf' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                        )}>
                            {empresa.tipoPessoa === 'pf' ? <User size={22} /> : <Building2 size={22} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-[var(--color-text-primary)]">{empresa.nome}</h3>
                                <span className={clsx(
                                    "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                    empresa.tipoPessoa === 'pf' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                                )}>
                                    {empresa.tipoPessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {empresa.tipoPessoa === 'pf'
                                    ? `CPF: ${empresa.cpf || '—'}`
                                    : `CNPJ: ${empresa.cnpj}`
                                }
                            </p>

                            <div className="flex flex-wrap gap-4 mt-3">
                                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                    <Phone size={13} />
                                    <span>{empresa.telefone}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                    <Mail size={13} />
                                    <span>{empresa.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 text-[var(--color-text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                            <Edit size={16} />
                        </button>
                        <button className="p-2 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg transition-colors">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={clsx(
                "bg-[var(--color-surface)] border-t border-[var(--color-border)] transition-all duration-300 overflow-hidden",
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-t-0"
            )}>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Locais / Filiais</h4>
                        <button className="text-xs text-[var(--color-accent)] font-semibold hover:underline">+ Adicionar Local</button>
                    </div>

                    <div className="grid gap-2">
                        {locais.length > 0 ? (
                            locais.map(local => (
                                <div key={local.id} className="bg-[var(--color-surface-card)] p-4 rounded-xl border border-[var(--color-border)] flex justify-between items-center hover:border-[var(--color-accent)]/30 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-[var(--color-text-muted)] mt-0.5" size={16} />
                                        <div>
                                            <p className="font-medium text-sm text-[var(--color-text-primary)]">{local.nome}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">{local.endereco}</p>
                                            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">Resp: {local.responsavel}</p>
                                        </div>
                                    </div>
                                    <button className="p-1.5 text-[var(--color-text-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                        <Edit size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[var(--color-text-muted)] italic">Nenhum local cadastrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpresaCard;
