import { KpiCard } from '@/components/KpiCard';
import { LoadingState, ErrorState } from '@/components/StateViews';
import { useAnalytics } from '@/hooks/use-analytics';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Target, Percent, BarChart3, Award, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(207, 90%, 54%)', 'hsl(174, 62%, 47%)', 'hsl(152, 60%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(270, 60%, 55%)'];

const tooltipStyle = {
  backgroundColor: 'hsl(220, 18%, 12%)',
  border: '1px solid hsl(220, 14%, 20%)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(210, 20%, 92%)',
};

export default function Analytics() {
  const { data: analyticsData, isLoading, error, refetch } = useAnalytics();

  if (isLoading) return <LoadingState message="Loading analytics..." />;
  if (error) return <ErrorState message="Failed to load analytics" onRetry={() => refetch()} />;
  if (!analyticsData) return null;

  const { stats, equityCurve, weekdayPerformance, setupPerformance, timePerformance, dailyHeatmap } = analyticsData;

  const winLossData = [
    { name: 'Winners', value: Math.round(stats.totalTrades * 0.684) },
    { name: 'Losers', value: Math.round(stats.totalTrades * 0.316) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep insights into your trading performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Expectancy" value={`$${stats.expectancy}`} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard title="Profit Factor" value={String(stats.profitFactor)} icon={<Target className="h-4 w-4" />} />
        <KpiCard title="Avg R Multiple" value={`${stats.avgRMultiple}R`} icon={<Percent className="h-4 w-4" />} />
        <KpiCard title="Total Trades" value={String(stats.totalTrades)} icon={<BarChart3 className="h-4 w-4" />} />
        <KpiCard title="Sharpe Ratio" value={String(stats.sharpeRatio)} icon={<Award className="h-4 w-4" />} />
        <KpiCard title="Max Drawdown" value={`$${Math.abs(stats.maxDrawdown)}`} variant="loss" icon={<ArrowDown className="h-4 w-4" />} />
      </div>

      {/* Equity Curve */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Equity Curve</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={equityCurve}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Balance']} />
              <Area type="monotone" dataKey="value" stroke="hsl(152, 60%, 45%)" strokeWidth={2} fill="url(#eqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Breakdown */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Win/Loss Breakdown</h3>
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={winLossData} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={4} dataKey="value">
                  <Cell fill="hsl(152, 60%, 45%)" />
                  <Cell fill="hsl(0, 72%, 51%)" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-profit" />
              <span className="text-sm text-muted-foreground">Winners ({winLossData[0].value})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-loss" />
              <span className="text-sm text-muted-foreground">Losers ({winLossData[1].value})</span>
            </div>
          </div>
        </div>

        {/* Performance by Weekday */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance by Weekday</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {weekdayPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? 'hsl(152, 60%, 45%)' : 'hsl(0, 72%, 51%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance by Time */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance by Time of Day</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 14%, 55%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {timePerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? 'hsl(207, 90%, 54%)' : 'hsl(0, 72%, 51%)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Setup Performance */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Performance by Setup</h3>
          <div className="space-y-3">
            {setupPerformance.map((setup, i) => (
              <div key={setup.setup} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${COLORS[i]}20`, color: COLORS[i] }}>
                  {setup.setup.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{setup.setup}</span>
                    <span className="text-sm font-semibold text-profit">{setup.winRate}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${setup.winRate}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{setup.trades} trades</span>
                    <span className="text-xs text-muted-foreground">Avg {setup.avgR}R</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Heatmap */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Daily P&L Heatmap</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {dailyHeatmap.map((day) => {
            const intensity = Math.min(Math.abs(day.pnl) / 3000, 1);
            const isPositive = day.pnl >= 0;
            return (
              <div
                key={day.date}
                className="aspect-square rounded-lg flex flex-col items-center justify-center p-2 border border-border/50 transition-all hover:scale-105"
                style={{
                  backgroundColor: isPositive
                    ? `hsla(152, 60%, 45%, ${intensity * 0.4})`
                    : `hsla(0, 72%, 51%, ${intensity * 0.4})`,
                }}
              >
                <span className="text-[10px] text-muted-foreground">{day.date}</span>
                <span className={cn('text-xs font-semibold font-mono', isPositive ? 'text-profit' : 'text-loss')}>
                  {isPositive ? '+' : ''}{day.pnl}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
