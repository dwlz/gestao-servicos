import { useState } from 'react';
import { mockEmpresas, mockLocais } from '../services/mockData';
import EmpresaCard from '../components/EmpresaCard';
import { Plus, Search, Building2 } from 'lucide-react';

const Empresas = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmpresas = mockEmpresas.filter(empresa =>
        empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cnpj.includes(searchTerm)
    );

    return (
        <div className="animate-page-enter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Empresas e Locais</h1>
                        <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">Gerencie seus clientes e suas filiais.</p>
                    </div>
                </div>
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all hover:scale-105 active:scale-95 text-sm">
                    <Plus size={18} />
                    Nova Empresa
                </button>
            </div>

            <div className="bg-[var(--color-surface-card)] p-3 rounded-2xl border border-[var(--color-border)] mb-6 animate-slide-up stagger-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar empresa por nome ou CNPJ..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredEmpresas.length > 0 ? (
                    filteredEmpresas.map((empresa, i) => (
                        <div key={empresa.id} className="animate-slide-up" style={{ animationDelay: `${(i + 2) * 0.08}s`, animationFillMode: 'both' }}>
                            <EmpresaCard
                                empresa={empresa}
                                locais={mockLocais.filter(l => l.empresaId === empresa.id)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-[var(--color-surface-card)] rounded-2xl border border-dashed border-[var(--color-border)] animate-fade-in">
                        <p className="text-[var(--color-text-muted)] text-lg">Nenhuma empresa encontrada.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Empresas;
