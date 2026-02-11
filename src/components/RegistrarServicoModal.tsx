import { useState } from 'react';
import Modal from './Modal';
import { mockEmpresas, mockLocais } from '../services/mockData';
import { Building2, User } from 'lucide-react';
import clsx from 'clsx';

interface RegistrarServicoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrarServicoModal: React.FC<RegistrarServicoModalProps> = ({ isOpen, onClose }) => {
    const [tipoCliente, setTipoCliente] = useState<'pj' | 'pf' | ''>('');
    const [clienteId, setClienteId] = useState('');
    const [localId, setLocalId] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('preventiva');
    const [dataAgendamento, setDataAgendamento] = useState('');
    const [valorMaoDeObra, setValorMaoDeObra] = useState(0);
    const [valorPecas, setValorPecas] = useState(0);
    const [equipamento, setEquipamento] = useState('');

    const clientesFiltrados = tipoCliente
        ? mockEmpresas.filter(e => e.tipoPessoa === tipoCliente)
        : mockEmpresas;

    const locaisFiltrados = mockLocais.filter(l => l.empresaId === clienteId);

    const clienteSelecionado = mockEmpresas.find(e => e.id === clienteId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Serviço "${titulo}" registrado com sucesso!`);
        onClose();
    };

    const inputClass = "w-full px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all";
    const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Registrar Serviço" size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className={labelClass}>Título do Serviço</label>
                    <input className={inputClass} placeholder="Ex: Manutenção Preventiva Câmara Fria" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                </div>

                {/* Tipo de Cliente */}
                <div>
                    <label className={labelClass}>Para quem é o serviço?</label>
                    <div className="flex gap-2 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                        <button
                            type="button"
                            onClick={() => { setTipoCliente('pj'); setClienteId(''); setLocalId(''); }}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                tipoCliente === 'pj'
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                            )}
                        >
                            <Building2 size={16} />
                            Empresa (PJ)
                        </button>
                        <button
                            type="button"
                            onClick={() => { setTipoCliente('pf'); setClienteId(''); setLocalId(''); }}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                tipoCliente === 'pf'
                                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                            )}
                        >
                            <User size={16} />
                            Pessoa Física (PF)
                        </button>
                    </div>
                </div>

                {/* Cliente & Local Selectors */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            {tipoCliente === 'pf' ? 'Cliente' : 'Empresa'}
                        </label>
                        <select
                            className={inputClass}
                            value={clienteId}
                            onChange={e => { setClienteId(e.target.value); setLocalId(''); }}
                            required
                        >
                            <option value="">Selecione...</option>
                            {clientesFiltrados.map(e => (
                                <option key={e.id} value={e.id}>
                                    {e.nome}
                                    {e.tipoPessoa === 'pf' ? ` (CPF: ${e.cpf})` : ` (CNPJ: ${e.cnpj})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Local</label>
                        <select className={inputClass} value={localId} onChange={e => setLocalId(e.target.value)} required disabled={!clienteId}>
                            <option value="">Selecione...</option>
                            {locaisFiltrados.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select>
                    </div>
                </div>

                {/* Client badge */}
                {clienteSelecionado && (
                    <div className={clsx(
                        "flex items-center gap-3 p-3 rounded-xl border animate-fade-in",
                        clienteSelecionado.tipoPessoa === 'pf'
                            ? "bg-purple-500/5 border-purple-500/20"
                            : "bg-blue-500/5 border-blue-500/20"
                    )}>
                        <div className={clsx(
                            "p-1.5 rounded-lg",
                            clienteSelecionado.tipoPessoa === 'pf' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            {clienteSelecionado.tipoPessoa === 'pf' ? <User size={16} /> : <Building2 size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{clienteSelecionado.nome}</p>
                            <p className="text-[11px] text-[var(--color-text-muted)]">
                                {clienteSelecionado.tipoPessoa === 'pf'
                                    ? `CPF: ${clienteSelecionado.cpf} • ${clienteSelecionado.telefone}`
                                    : `CNPJ: ${clienteSelecionado.cnpj} • ${clienteSelecionado.telefone}`
                                }
                            </p>
                        </div>
                        <span className={clsx(
                            "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            clienteSelecionado.tipoPessoa === 'pf' ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            {clienteSelecionado.tipoPessoa === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Tipo de Serviço</label>
                        <select className={inputClass} value={tipo} onChange={e => setTipo(e.target.value)}>
                            <option value="preventiva">Preventiva</option>
                            <option value="corretiva">Corretiva</option>
                            <option value="instalacao">Instalação</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Data de Agendamento</label>
                        <input type="date" className={inputClass} value={dataAgendamento} onChange={e => setDataAgendamento(e.target.value)} required />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Equipamento (opcional)</label>
                    <input className={inputClass} placeholder="Ex: Split 12000 BTUs" value={equipamento} onChange={e => setEquipamento(e.target.value)} />
                </div>

                <div>
                    <label className={labelClass}>Descrição</label>
                    <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Descreva o serviço a ser realizado..." value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Mão de Obra (R$)</label>
                        <input type="number" min="0" step="0.01" className={inputClass} value={valorMaoDeObra || ''} onChange={e => setValorMaoDeObra(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className={labelClass}>Peças (R$)</label>
                        <input type="number" min="0" step="0.01" className={inputClass} value={valorPecas || ''} onChange={e => setValorPecas(Number(e.target.value))} />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Valor Total Estimado</p>
                        <p className="text-xl font-bold text-[var(--color-text-primary)]">R$ {(valorMaoDeObra + valorPecas).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg shadow-lg shadow-[var(--color-accent)]/20 transition-all">
                            Registrar Serviço
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default RegistrarServicoModal;
