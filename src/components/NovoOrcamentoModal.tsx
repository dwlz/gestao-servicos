import { useState } from 'react';
import Modal from './Modal';
import { mockEmpresas, mockLocais } from '../services/mockData';

interface NovoOrcamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NovoOrcamentoModal: React.FC<NovoOrcamentoModalProps> = ({ isOpen, onClose }) => {
    const [empresaId, setEmpresaId] = useState('');
    const [localId, setLocalId] = useState('');
    const [validade, setValidade] = useState('');
    const [itens, setItens] = useState([{ descricao: '', qtd: 1, valorUnitario: 0 }]);

    const locaisFiltrados = mockLocais.filter(l => l.empresaId === empresaId);

    const addItem = () => setItens([...itens, { descricao: '', qtd: 1, valorUnitario: 0 }]);
    const removeItem = (i: number) => setItens(itens.filter((_, idx) => idx !== i));

    const updateItem = (i: number, field: string, value: string | number) => {
        const updated = [...itens];
        (updated[i] as any)[field] = value;
        setItens(updated);
    };

    const total = itens.reduce((acc, item) => acc + item.qtd * item.valorUnitario, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Orçamento criado! Total: R$ ${total.toFixed(2)}`);
        onClose();
    };

    const inputClass = "w-full px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all";
    const labelClass = "block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Novo Orçamento" size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Empresa</label>
                        <select className={inputClass} value={empresaId} onChange={e => { setEmpresaId(e.target.value); setLocalId(''); }} required>
                            <option value="">Selecione...</option>
                            {mockEmpresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Local</label>
                        <select className={inputClass} value={localId} onChange={e => setLocalId(e.target.value)} required disabled={!empresaId}>
                            <option value="">Selecione...</option>
                            {locaisFiltrados.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className={labelClass}>Validade</label>
                    <input type="date" className={inputClass} value={validade} onChange={e => setValidade(e.target.value)} required />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-[var(--color-text-primary)]">Itens do Orçamento</label>
                        <button type="button" onClick={addItem} className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors">
                            + Adicionar Item
                        </button>
                    </div>
                    <div className="space-y-3">
                        {itens.map((item, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-start bg-[var(--color-surface)] p-3 rounded-lg border border-[var(--color-border)]">
                                <div className="col-span-5">
                                    <input placeholder="Descrição" className={inputClass} value={item.descricao} onChange={e => updateItem(i, 'descricao', e.target.value)} required />
                                </div>
                                <div className="col-span-2">
                                    <input type="number" min="1" placeholder="Qtd" className={inputClass} value={item.qtd} onChange={e => updateItem(i, 'qtd', Number(e.target.value))} required />
                                </div>
                                <div className="col-span-3">
                                    <input type="number" min="0" step="0.01" placeholder="R$ Valor" className={inputClass} value={item.valorUnitario || ''} onChange={e => updateItem(i, 'valorUnitario', Number(e.target.value))} required />
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">R$ {(item.qtd * item.valorUnitario).toFixed(2)}</span>
                                    {itens.length > 1 && (
                                        <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-500 text-xs">✕</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Total do Orçamento</p>
                        <p className="text-xl font-bold text-[var(--color-text-primary)]">R$ {total.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg shadow-lg shadow-[var(--color-accent)]/20 transition-all">
                            Criar Orçamento
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default NovoOrcamentoModal;
