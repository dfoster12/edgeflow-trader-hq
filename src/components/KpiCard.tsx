import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  suffix?: string;
  variant?: 'default' | 'profit' | 'loss';
  sparkline?: number[];
}

export function KpiCard({ title, value, change, icon, suffix, variant = 'default' }: KpiCardProps) {
  const isPositive = change !== undefined ? change >= 0 : variant === 'profit';

  return (
    <div className="glass-card-hover p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        {icon && <div className="text-muted-foreground group-hover:text-primary transition-colors">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn(
          'text-2xl font-bold tracking-tight',
          variant === 'profit' ? 'text-profit' : variant === 'loss' ? 'text-loss' : 'text-foreground'
        )}>
          {value}
        </span>
        {suffix && <span className="text-sm text-muted-foreground mb-0.5">{suffix}</span>}
      </div>
      {change !== undefined && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-profit' : 'text-loss')}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{change}%</span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      )}
      {/* Subtle glow */}
      <div className={cn(
        'absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        variant === 'profit' ? 'bg-profit/10' : variant === 'loss' ? 'bg-loss/10' : 'bg-primary/10'
      )} />
    </div>
  );
}
