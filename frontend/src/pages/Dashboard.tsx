import { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import RecentServices from '../components/RecentServices';
import SnowParticles from '../components/SnowParticles';
import RevenueChart, { allMonthsData } from '../components/RevenueChart';
import NovoOrcamentoModal from '../components/NovoOrcamentoModal';
import RegistrarServicoModal from '../components/RegistrarServicoModal';
import CadastrarClienteModal from '../components/CadastrarClienteModal';
import { servicosApi, empresasApi } from '../services/api';
import type { Servico, Empresa } from '../types';
import {
    ClipboardList,
    DollarSign,
    Wrench,
    TrendingUp,
    FileText,
    Plus,
    Building2,
    Snowflake,
    Thermometer,
} from 'lucide-react';

const Dashboard = () => {
    const [showOrcamento, setShowOrcamento] = useState(false);
    const [showServico, setShowServico] = useState(false);
    const [showCliente, setShowCliente] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(allMonthsData.length - 1);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    useEffect(() => {
        Promise.all([servicosApi.list(), empresasApi.list()])
            .then(([srv, emp]) => {
                setServicos(srv);
                setEmpresas(emp);
            })
            .catch(console.error);
    }, []);

    const selectedMonth = allMonthsData[selectedMonthIndex];
    const prevMonth = selectedMonthIndex > 0 ? allMonthsData[selectedMonthIndex - 1] : null;

    const faturamentoTrend = prevMonth
        ? (((selectedMonth.value - prevMonth.value) / prevMonth.value) * 100).toFixed(0) + '%'
        : undefined;
    const faturamentoUp = prevMonth ? selectedMonth.value >= prevMonth.value : true;

    const concluidosTrend = prevMonth
        ? (((selectedMonth.servicosConcluidos - prevMonth.servicosConcluidos) / prevMonth.servicosConcluidos) * 100).toFixed(0) + '%'
        : undefined;
    const concluidosUp = prevMonth ? selectedMonth.servicosConcluidos >= prevMonth.servicosConcluidos : true;

    return (
        <div className="relative min-h-full">
            <SnowParticles />

            <div className="relative z-10">
                {/* Hero Header */}
                <div className="mb-8 animate-slide-up">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl animate-float">
                            <Snowflake size={22} />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] mt-1 ml-12">Visão geral do seu negócio e atividades recente.</p>
                </div>

                {/* Revenue Chart */}
                <div className="mb-8 animate-slide-up stagger-1">
                    <RevenueChart
                        selectedIndex={selectedMonthIndex}
                        onSelectMonth={setSelectedMonthIndex}
                    />
                </div>

                {/* Stats — driven by selected month */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="animate-slide-up stagger-3">
                        <StatsCard
                            title={`Faturamento (${selectedMonth.shortMonth})`}
                            value={`R$ ${selectedMonth.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon={DollarSign}
                            color="green"
                            trend={faturamentoTrend}
                            trendUp={faturamentoUp}
                        />
                    </div>
                    <div className="animate-slide-up stagger-4">
                        <StatsCard
                            title={`Serviços (${selectedMonth.shortMonth})`}
                            value={selectedMonth.servicosHoje}
                            icon={Wrench}
                            color="blue"
                        />
                    </div>
                    <div className="animate-slide-up stagger-5">
                        <StatsCard
                            title={`Orçamentos Pendentes`}
                            value={selectedMonth.orcamentosPendentes}
                            icon={ClipboardList}
                            color="orange"
                        />
                    </div>
                    <div className="animate-slide-up stagger-6">
                        <StatsCard
                            title={`Concluídos (${selectedMonth.shortMonth})`}
                            value={selectedMonth.servicosConcluidos}
                            icon={TrendingUp}
                            color="purple"
                            trend={concluidosTrend}
                            trendUp={concluidosUp}
                        />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 animate-slide-up stagger-7">
                        <RecentServices servicos={servicos} empresas={empresas} />
                    </div>

                    <div className="space-y-6">
                        {/* Temperature Widget */}
                        <div className="animate-slide-in-right stagger-5">
                            <div className="bg-gradient-to-br from-cyan-600/90 via-blue-700/90 to-indigo-800/90 rounded-2xl p-5 text-white shadow-xl shadow-blue-900/20 border border-white/5 backdrop-blur-sm overflow-hidden relative">
                                <div className="absolute -top-4 -right-4 opacity-10">
                                    <Thermometer size={80} />
                                </div>
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Snowflake size={16} className="text-cyan-200" />
                                        <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-200">Status Refrigeração</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                            <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Câmaras Ativas</p>
                                            <p className="text-xl font-bold mt-1">24</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                            <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Alertas</p>
                                            <p className="text-xl font-bold mt-1 text-amber-300">2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="animate-slide-in-right stagger-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
                                <div className="absolute top-3 right-3 opacity-10">
                                    <Snowflake size={60} className="animate-spin" style={{ animationDuration: '20s' }} />
                                </div>
                                <h3 className="text-base font-bold mb-2 relative">💡 Dica do Dia</h3>
                                <p className="text-indigo-100 text-sm leading-relaxed relative">
                                    Mantenha o cadastro dos equipamentos atualizado para facilitar a geração de orçamentos de preventivas.
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="animate-slide-in-right stagger-7">
                            <div className="bg-[var(--color-surface-card)] rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
                                <h3 className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Acesso Rápido</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setShowOrcamento(true)}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-all group card-hover gradient-border"
                                    >
                                        <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg group-hover:bg-indigo-500/20 transition-colors group-hover:scale-110 duration-200">
                                            <FileText size={16} />
                                        </div>
                                        Novo Orçamento
                                        <span className="ml-auto text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors text-xs">→</span>
                                    </button>
                                    <button
                                        onClick={() => setShowServico(true)}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-emerald-500 transition-all group card-hover gradient-border"
                                    >
                                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg group-hover:bg-emerald-500/20 transition-colors group-hover:scale-110 duration-200">
                                            <Plus size={16} />
                                        </div>
                                        Registrar Serviço
                                        <span className="ml-auto text-[var(--color-text-muted)] group-hover:text-emerald-500 transition-colors text-xs">→</span>
                                    </button>
                                    <button
                                        onClick={() => setShowCliente(true)}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:text-orange-500 transition-all group card-hover gradient-border"
                                    >
                                        <div className="p-1.5 bg-orange-500/10 text-orange-500 rounded-lg group-hover:bg-orange-500/20 transition-colors group-hover:scale-110 duration-200">
                                            <Building2 size={16} />
                                        </div>
                                        Cadastrar Cliente
                                        <span className="ml-auto text-[var(--color-text-muted)] group-hover:text-orange-500 transition-colors text-xs">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NovoOrcamentoModal isOpen={showOrcamento} onClose={() => setShowOrcamento(false)} />
            <RegistrarServicoModal isOpen={showServico} onClose={() => setShowServico(false)} />
            <CadastrarClienteModal isOpen={showCliente} onClose={() => setShowCliente(false)} />
        </div>
    );
};

export default Dashboard;
