import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: React.FC<any>;
    className?: string;
    description?: string;
}

export const StatsCard = ({ title, value, trend, icon: Icon, className, description }: StatsCardProps) => {
    return (
        <div className={cn("glass-card rounded-xl p-6 group", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="text-3xl font-bold mt-2 tracking-tight text-foreground drop-shadow-sm">{value}</h3>
                    {description && <p className="text-xs text-muted-foreground mt-1 group-hover:text-blue-500/80 transition-colors">{description}</p>}
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-500 dark:group-hover:text-blue-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 mt-4 text-xs font-medium">
                    <span className={cn(
                        "flex items-center gap-0.5",
                        trend.isPositive ? "text-emerald-400" : "text-rose-400"
                    )}>
                        {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend.value)}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                </div>
            )}
        </div>
    );
};
