import { useState } from 'react';
import Modal from './Modal';
import { Building2, User } from 'lucide-react';
import clsx from 'clsx';
import type { TipoPessoa } from '../types';

interface CadastrarClienteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CadastrarClienteModal: React.FC<CadastrarClienteModalProps> = ({ isOpen, onClose }) => {
    const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('pj');
    const [nome, setNome] = useState('');
    const [documento, setDocumento] = useState('');
    const [contato, setContato] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [nomeLocal, setNomeLocal] = useState('');
    const [enderecoLocal, setEnderecoLocal] = useState('');
    const [responsavelLocal, setResponsavelLocal] = useState('');

    const isPJ = tipoPessoa === 'pj';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tipo = isPJ ? 'Empresa' : 'Pessoa Física';
        alert(`${tipo} "${nome}" cadastrado(a) com sucesso!`);
        onClose();
    };

    const inputClass = "w-full px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all";
    const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Cliente" size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tipo de Pessoa Toggle */}
                <div className="flex gap-2 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
                    <button
                        type="button"
                        onClick={() => setTipoPessoa('pj')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                            isPJ
                                ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        )}
                    >
                        <Building2 size={16} />
                        Pessoa Jurídica
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoPessoa('pf')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                            !isPJ
                                ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                        )}
                    >
                        <User size={16} />
                        Pessoa Física
                    </button>
                </div>

                <div className="p-4 bg-[var(--color-accent-light)] rounded-lg border border-[var(--color-accent)]/10">
                    <p className="text-sm font-semibold text-[var(--color-accent-text)] mb-0.5">
                        {isPJ ? 'Dados da Empresa' : 'Dados Pessoais'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        {isPJ ? 'Informações da empresa ou razão social' : 'Informações da pessoa física'}
                    </p>
                </div>

                <div>
                    <label className={labelClass}>{isPJ ? 'Razão Social / Nome Fantasia' : 'Nome Completo'}</label>
                    <input
                        className={inputClass}
                        placeholder={isPJ ? 'Ex: Supermercado Compre Bem' : 'Ex: Roberto da Silva'}
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>{isPJ ? 'CNPJ' : 'CPF'}</label>
                        <input
                            className={inputClass}
                            placeholder={isPJ ? '00.000.000/0000-00' : '000.000.000-00'}
                            value={documento}
                            onChange={e => setDocumento(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Telefone</label>
                        <input className={inputClass} placeholder="(00) 00000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>{isPJ ? 'Contato Principal' : 'Apelido / Como Prefere Ser Chamado'}</label>
                        <input
                            className={inputClass}
                            placeholder={isPJ ? 'Nome do responsável' : 'Ex: Roberto'}
                            value={contato}
                            onChange={e => setContato(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>E-mail</label>
                        <input
                            type="email"
                            className={inputClass}
                            placeholder={isPJ ? 'email@empresa.com' : 'email@pessoal.com'}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>{isPJ ? 'Endereço da Sede' : 'Endereço Residencial'}</label>
                    <input className={inputClass} placeholder="Rua, número, bairro, cidade" value={endereco} onChange={e => setEndereco(e.target.value)} />
                </div>

                {/* First Location */}
                <div className="p-4 bg-[var(--color-accent-light)] rounded-lg border border-[var(--color-accent)]/10 mt-6">
                    <p className="text-sm font-semibold text-[var(--color-accent-text)] mb-0.5">
                        {isPJ ? 'Primeiro Local / Filial' : 'Local do Serviço'}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        {isPJ ? 'Você pode adicionar mais locais depois' : 'Endereço onde o serviço será realizado (pode ser o mesmo)'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>{isPJ ? 'Nome do Local' : 'Identificação'}</label>
                        <input
                            className={inputClass}
                            placeholder={isPJ ? 'Ex: Matriz - Centro' : 'Ex: Residência'}
                            value={nomeLocal}
                            onChange={e => setNomeLocal(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Responsável</label>
                        <input className={inputClass} placeholder="Nome do responsável" value={responsavelLocal} onChange={e => setResponsavelLocal(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Endereço do Local</label>
                    <input className={inputClass} placeholder="Rua, número, bairro, cidade" value={enderecoLocal} onChange={e => setEnderecoLocal(e.target.value)} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg shadow-lg shadow-[var(--color-accent)]/20 transition-all">
                        Cadastrar Cliente
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CadastrarClienteModal;
