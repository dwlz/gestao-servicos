import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorStyles = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
};

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    color = 'blue'
}) => {
    return (
        <div className="bg-[var(--color-surface-card)] p-5 rounded-2xl border border-[var(--color-border)] card-hover group">
            <div className="flex justify-between items-start">
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</h3>

                    {trend && (
                        <div className={clsx(
                            "flex items-center gap-1 text-xs font-medium",
                            trendUp ? "text-emerald-500" : "text-red-500"
                        )}>
                            <span>{trendUp ? '↑' : '↓'} {trend}</span>
                            <span className="text-[var(--color-text-muted)]">vs mês anterior</span>
                        </div>
                    )}
                </div>

                <div className={clsx("p-3 rounded-xl", colorStyles[color].bg, colorStyles[color].text)}>
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
