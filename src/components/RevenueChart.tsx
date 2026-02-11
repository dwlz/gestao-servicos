import { useState } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export interface MonthData {
    month: string;
    shortMonth: string;
    year: number;
    value: number;
    servicosHoje: number;
    orcamentosPendentes: number;
    servicosConcluidos: number;
}

export const allMonthsData: MonthData[] = [
    { month: 'Março', shortMonth: 'Mar', year: 2025, value: 9800, servicosHoje: 0, orcamentosPendentes: 1, servicosConcluidos: 6 },
    { month: 'Abril', shortMonth: 'Abr', year: 2025, value: 11200, servicosHoje: 0, orcamentosPendentes: 3, servicosConcluidos: 8 },
    { month: 'Maio', shortMonth: 'Mai', year: 2025, value: 10500, servicosHoje: 0, orcamentosPendentes: 2, servicosConcluidos: 7 },
    { month: 'Junho', shortMonth: 'Jun', year: 2025, value: 13800, servicosHoje: 0, orcamentosPendentes: 4, servicosConcluidos: 10 },
    { month: 'Julho', shortMonth: 'Jul', year: 2025, value: 12400, servicosHoje: 0, orcamentosPendentes: 1, servicosConcluidos: 9 },
    { month: 'Agosto', shortMonth: 'Ago', year: 2025, value: 14200, servicosHoje: 0, orcamentosPendentes: 2, servicosConcluidos: 11 },
    { month: 'Setembro', shortMonth: 'Set', year: 2025, value: 11900, servicosHoje: 0, orcamentosPendentes: 3, servicosConcluidos: 8 },
    { month: 'Outubro', shortMonth: 'Out', year: 2025, value: 16100, servicosHoje: 0, orcamentosPendentes: 5, servicosConcluidos: 14 },
    { month: 'Novembro', shortMonth: 'Nov', year: 2025, value: 13500, servicosHoje: 0, orcamentosPendentes: 2, servicosConcluidos: 10 },
    { month: 'Dezembro', shortMonth: 'Dez', year: 2025, value: 18700, servicosHoje: 0, orcamentosPendentes: 1, servicosConcluidos: 16 },
    { month: 'Janeiro', shortMonth: 'Jan', year: 2026, value: 14300, servicosHoje: 0, orcamentosPendentes: 3, servicosConcluidos: 11 },
    { month: 'Fevereiro', shortMonth: 'Fev', year: 2026, value: 15450, servicosHoje: 1, orcamentosPendentes: 2, servicosConcluidos: 12 },
];

interface RevenueChartProps {
    selectedIndex: number;
    onSelectMonth: (index: number) => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ selectedIndex, onSelectMonth }) => {
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const totalPages = Math.ceil(allMonthsData.length / pageSize);
    const pageStart = page * pageSize;
    const data = allMonthsData.slice(pageStart, pageStart + pageSize);

    const maxValue = Math.max(...allMonthsData.map(d => d.value));
    const minValue = Math.min(...allMonthsData.map(d => d.value));
    // Use a floor so bars have more contrast (min bar = ~25% height)
    const floor = minValue * 0.6;
    const range = maxValue - floor;

    const currentMonth = allMonthsData[selectedIndex];
    const prevMonth = selectedIndex > 0 ? allMonthsData[selectedIndex - 1] : null;
    const percentChange = prevMonth
        ? (((currentMonth.value - prevMonth.value) / prevMonth.value) * 100).toFixed(1)
        : '0';
    const isPositive = Number(percentChange) >= 0;

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] uppercase tracking-wider">Faturamento Mensal</h3>
                        <span className={clsx(
                            "text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        )}>
                            <TrendingUp size={12} className={!isPositive ? "rotate-180" : ""} />
                            {isPositive ? '+' : ''}{percentChange}%
                        </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {data[0]?.shortMonth}/{data[0]?.year} — {data[data.length - 1]?.shortMonth}/{data[data.length - 1]?.year}
                        {currentMonth && (
                            <span className="ml-2 text-[var(--color-accent)]">
                                • {currentMonth.month}/{currentMonth.year}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="flex items-end gap-3 h-44">
                {data.map((item, i) => {
                    const globalIndex = pageStart + i;
                    const height = ((item.value - floor) / range) * 100;
                    const isHovered = hoveredIndex === i;
                    const isSelected = globalIndex === selectedIndex;

                    return (
                        <div
                            key={`${item.shortMonth}-${item.year}`}
                            className="flex-1 flex flex-col items-center gap-2 relative group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => onSelectMonth(globalIndex)}
                        >
                            {/* Tooltip */}
                            <div className={clsx(
                                "absolute -top-14 left-1/2 -translate-x-1/2 bg-[var(--color-sidebar-bg)] text-white text-[11px] font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap transition-all duration-200 pointer-events-none z-10",
                                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                            )}>
                                <p>R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                <p className="text-[9px] font-normal text-gray-400 mt-0.5">{item.month} {item.year}</p>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--color-sidebar-bg)] rotate-45" />
                            </div>

                            {/* Value above bar */}
                            <div className={clsx(
                                "text-[10px] font-bold transition-all duration-300 tabular-nums",
                                isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100"
                            )}>
                                {(item.value / 1000).toFixed(1)}k
                            </div>

                            {/* Bar */}
                            <div className="w-full flex justify-center" style={{ height: '140px' }}>
                                <div
                                    className={clsx(
                                        "w-full max-w-[44px] rounded-lg transition-all duration-300 relative overflow-hidden",
                                        isSelected
                                            ? "bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-400 shadow-lg shadow-indigo-500/30 scale-105"
                                            : isHovered
                                                ? "bg-gradient-to-t from-indigo-500/60 to-indigo-400/50 scale-105"
                                                : "bg-gradient-to-t from-indigo-500/25 to-indigo-400/15"
                                    )}
                                    style={{ height: `${Math.max(height, 8)}%` }}
                                >
                                    {/* Shine effect on selected */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-lg" />
                                    )}
                                </div>
                            </div>

                            {/* Label */}
                            <div className={clsx("text-center transition-all duration-200", isSelected && "scale-105")}>
                                <p className={clsx(
                                    "text-[11px] font-bold transition-colors",
                                    isSelected ? "text-[var(--color-accent)]" : isHovered ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"
                                )}>
                                    {item.shortMonth}
                                </p>
                                <p className={clsx(
                                    "text-[9px] transition-colors",
                                    isSelected ? "text-[var(--color-accent)]/70" : "text-[var(--color-text-muted)]"
                                )}>
                                    {item.year}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gradient-to-r from-indigo-600 to-purple-500" />
                        <span className="text-[11px] text-[var(--color-text-muted)]">Selecionado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-indigo-500/25" />
                        <span className="text-[11px] text-[var(--color-text-muted)]">Outros meses</span>
                    </div>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                    Total 12m: <span className="font-bold text-[var(--color-text-primary)]">
                        R$ {allMonthsData.reduce((a, b) => a + b.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RevenueChart;
