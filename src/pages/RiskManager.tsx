import { LoadingState, ErrorState } from '@/components/StateViews';
import { useRiskSettings } from '@/hooks/use-risk';
import { Shield, AlertTriangle, Lock, CheckCircle2, XCircle, Flame, Pause, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function RiskManager() {
  const { data: risk, isLoading, error, refetch } = useRiskSettings();

  if (isLoading) return <LoadingState message="Loading risk settings..." />;
  if (error) return <ErrorState message="Failed to load risk settings" onRetry={() => refetch()} />;
  if (!risk) return null;

  const dailyLossPercent = (risk.todayLoss / risk.maxDailyLoss) * 100;
  const tradePercent = (risk.todayTradeCount / risk.maxTradesPerDay) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Protect your capital and enforce discipline</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 border-loss/30 text-loss hover:bg-loss/10">
          <Pause className="h-4 w-4" /> Emergency Stop
        </Button>
      </div>

      {/* Discipline Score */}
      <div className="glass-card p-6 glow-primary">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Discipline Score</h3>
            <p className="text-5xl font-bold text-foreground mt-2">{risk.disciplineScore}<span className="text-xl text-muted-foreground">/100</span></p>
          </div>
          <div className="h-24 w-24 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(220, 14%, 16%)" strokeWidth="4" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(207, 90%, 54%)" strokeWidth="4"
                strokeDasharray={`${risk.disciplineScore * 2.89} 289`} strokeLinecap="round" />
            </svg>
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">You're maintaining good discipline this week. Keep following your rules.</p>
      </div>

      {/* Risk Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily Loss Limit</span>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold text-foreground">${risk.todayLoss} <span className="text-sm text-muted-foreground font-normal">/ ${risk.maxDailyLoss}</span></p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className={cn('h-full rounded-full transition-all', dailyLossPercent > 80 ? 'bg-loss' : dailyLossPercent > 50 ? 'bg-warning' : 'bg-profit')} style={{ width: `${dailyLossPercent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{dailyLossPercent.toFixed(0)}% used</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Loss Limit</span>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold text-foreground">$450 <span className="text-sm text-muted-foreground font-normal">/ ${risk.maxWeeklyLoss}</span></p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-profit transition-all" style={{ width: '9%' }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">9% used</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trades Today</span>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold text-foreground">{risk.todayTradeCount} <span className="text-sm text-muted-foreground font-normal">/ {risk.maxTradesPerDay}</span></p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${tradePercent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{risk.maxTradesPerDay - risk.todayTradeCount} remaining</p>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Per Trade</span>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-bold text-foreground">{risk.riskPerTrade}%</p>
          <p className="text-sm text-muted-foreground mt-2">${(127450 * risk.riskPerTrade / 100).toFixed(0)} per trade</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Streak Tracking</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-profit/5 border border-profit/10">
              <p className="text-xs text-muted-foreground mb-1">Win Streak</p>
              <p className="text-3xl font-bold text-profit">{risk.winStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">Current</p>
            </div>
            <div className="p-4 rounded-lg bg-loss/5 border border-loss/10">
              <p className="text-xs text-muted-foreground mb-1">Loss Streak</p>
              <p className="text-3xl font-bold text-loss">{risk.lossStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">Current</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border-warning/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Lockout Status</h3>
          </div>
          <div className="p-4 rounded-lg bg-profit/5 border border-profit/10 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-profit" />
            <div>
              <p className="text-sm font-medium text-foreground">All Clear</p>
              <p className="text-xs text-muted-foreground">No limits breached. You're within all risk parameters.</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Behavioral Rules Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { rule: 'Only trade during NY AM session', met: true },
              { rule: 'Wait for 5-min candle close before entry', met: true },
              { rule: 'No revenge trading after a loss', met: true },
              { rule: 'Size down after 2 consecutive losses', met: true },
              { rule: 'Review pre-market plan before first trade', met: true },
              { rule: 'No trading during high-impact news (±5 min)', met: false },
              { rule: 'Take a 15-min break after each trade', met: true },
              { rule: 'Journal every trade within 30 minutes', met: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                {item.met ? (
                  <CheckCircle2 className="h-4 w-4 text-profit shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-warning shrink-0" />
                )}
                <span className={cn('text-sm', item.met ? 'text-foreground' : 'text-warning')}>{item.rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
