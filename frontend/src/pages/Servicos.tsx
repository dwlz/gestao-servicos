import { useState, useEffect } from 'react';
import { servicosApi, empresasApi } from '../services/api';
import ServiceCard from '../components/ServiceCard';
import { Plus, Search, Wrench } from 'lucide-react';
import type { StatusServico, TipoServico, Servico, Empresa, Local } from '../types';

const Servicos = () => {
    const [filterStatus, setFilterStatus] = useState<StatusServico | 'todos'>('todos');
    const [filterTipo, setFilterTipo] = useState<TipoServico | 'todos'>('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [locais, setLocais] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([servicosApi.list(), empresasApi.list(), empresasApi.allLocais()])
            .then(([srv, emp, loc]) => {
                setServicos(srv);
                setEmpresas(emp);
                setLocais(loc);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredServicos = servicos.filter(servico => {
        const matchesSearch = servico.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'todos' || servico.status === filterStatus;
        const matchesTipo = filterTipo === 'todos' || servico.tipo === filterTipo;
        return matchesSearch && matchesStatus && matchesTipo;
    });

    const getEmpresa = (id: string) => empresas.find(e => e.id === id);
    const getLocal = (id: string) => locais.find(l => l.id === id);

    const selectClass = "px-3 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="animate-page-enter">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Wrench size={22} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Serviços e Manutenções</h1>
                        <p className="text-[var(--color-text-muted)] mt-0.5 text-sm">Gerencie agendamentos e histórico.</p>
                    </div>
                </div>
                <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-[var(--color-accent)]/20 transition-all hover:scale-105 active:scale-95 text-sm">
                    <Plus size={18} />
                    Novo Serviço
                </button>
            </div>

            <div className="bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] mb-6 animate-slide-up stagger-1">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar serviços..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className={selectClass} value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusServico | 'todos')}>
                            <option value="todos">Todos Status</option>
                            <option value="pendente">Pendente</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <select className={selectClass} value={filterTipo} onChange={e => setFilterTipo(e.target.value as TipoServico | 'todos')}>
                            <option value="todos">Todos Tipos</option>
                            <option value="preventiva">Preventiva</option>
                            <option value="corretiva">Corretiva</option>
                            <option value="instalacao">Instalação</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-3">
                {filteredServicos.length > 0 ? (
                    filteredServicos.map((servico, i) => (
                        <div key={servico.id} className="animate-slide-up" style={{ animationDelay: `${(i + 2) * 0.08}s`, animationFillMode: 'both' }}>
                            <ServiceCard
                                servico={servico}
                                empresa={getEmpresa(servico.empresaId)}
                                local={getLocal(servico.localId)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-[var(--color-surface-card)] rounded-2xl border border-dashed border-[var(--color-border)] animate-fade-in">
                        <p className="text-[var(--color-text-muted)] text-lg">Nenhum serviço encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Servicos;
