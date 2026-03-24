import { KpiCard } from '@/components/KpiCard';
import { LoadingState, ErrorState } from '@/components/StateViews';
import { useDashboardKpis, useWatchlist, useNotifications } from '@/hooks/use-market-data';
import { useTrades, useOpenPositions } from '@/hooks/use-trades';
import {
  DollarSign, TrendingUp, Target, Wallet, ShieldAlert, BarChart3,
  Clock, ArrowUpRight, ArrowDownRight, Activity, Eye, CheckSquare, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const miniChartData = Array.from({ length: 40 }, (_, i) => ({
  t: i,
  v: 21300 + Math.sin(i / 5) * 80 + i * 3 + (Math.random() - 0.3) * 30,
}));

const volumeData = Array.from({ length: 20 }, (_, i) => ({
  t: i,
  v: Math.floor(Math.random() * 4000 + 500),
}));

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];
const indicators = ['EMA', 'VWAP', 'RSI', 'MACD'];

export default function Dashboard() {
  const [selectedTf, setSelectedTf] = useState('5m');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['EMA', 'VWAP']);

  const { data: kpiData, isLoading: kpisLoading, error: kpisError, refetch: refetchKpis } = useDashboardKpis();
  const { data: trades, isLoading: tradesLoading } = useTrades();
  const { data: positions, isLoading: positionsLoading } = useOpenPositions();
  const { data: watchlist, isLoading: watchlistLoading } = useWatchlist();
  const { data: notifications } = useNotifications();

  const toggleIndicator = (ind: string) => {
    setActiveIndicators(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  const recentTrades = trades?.slice(0, 4) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      {kpisError ? (
        <ErrorState message="Failed to load KPIs" onRetry={() => refetchKpis()} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard title="Daily P&L" value={kpisLoading ? '...' : `$${kpiData!.dailyPnL.toLocaleString()}`} change={12.4} variant="profit" icon={<DollarSign className="h-4 w-4" />} />
          <KpiCard title="Weekly P&L" value={kpisLoading ? '...' : `$${kpiData!.weeklyPnL.toLocaleString()}`} change={8.2} variant="profit" icon={<TrendingUp className="h-4 w-4" />} />
          <KpiCard title="Win Rate" value={kpisLoading ? '...' : `${kpiData!.winRate}%`} icon={<Target className="h-4 w-4" />} />
          <KpiCard title="Account Balance" value={kpisLoading ? '...' : `$${kpiData!.accountBalance.toLocaleString()}`} change={4.1} icon={<Wallet className="h-4 w-4" />} />
          <KpiCard title="Risk Used" value={kpisLoading ? '...' : `${kpiData!.riskUsedToday}%`} suffix="of 3%" icon={<ShieldAlert className="h-4 w-4" />} />
          <KpiCard title="Open Positions" value={kpisLoading ? '...' : String(kpiData!.openPositions)} icon={<BarChart3 className="h-4 w-4" />} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Area - 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          {/* Chart */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">NQ Futures</h2>
                <span className="text-2xl font-bold text-foreground font-mono">21,512.75</span>
                <span className="flex items-center gap-1 text-sm font-medium text-profit">
                  <ArrowUpRight className="h-4 w-4" /> +176.25 (0.82%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTf(tf)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                      selectedTf === tf ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex items-center gap-2 mb-4">
              {indicators.map(ind => (
                <button
                  key={ind}
                  onClick={() => toggleIndicator(ind)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium border transition-all',
                    activeIndicators.includes(ind)
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-muted-foreground border-border hover:border-primary/20'
                  )}
                >
                  {ind}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(207, 90%, 54%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(207, 90%, 54%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 14%, 20%)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: 'hsl(210, 20%, 92%)',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  />
                  <Area type="monotone" dataKey="v" stroke="hsl(207, 90%, 54%)" strokeWidth={2} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume */}
            <div className="h-[60px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <Bar dataKey="v" fill="hsl(207, 90%, 54%)" opacity={0.3} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Open Positions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Open Positions</h3>
            </div>
            {positionsLoading ? (
              <LoadingState message="Loading positions..." />
            ) : !positions?.length ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No open positions</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b border-border">
                      <th className="text-left pb-3 font-medium">Symbol</th>
                      <th className="text-left pb-3 font-medium">Side</th>
                      <th className="text-right pb-3 font-medium">Entry</th>
                      <th className="text-right pb-3 font-medium">Current</th>
                      <th className="text-right pb-3 font-medium">Stop</th>
                      <th className="text-right pb-3 font-medium">Target</th>
                      <th className="text-right pb-3 font-medium">Size</th>
                      <th className="text-right pb-3 font-medium">Unrealized P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 font-semibold text-foreground">{pos.symbol}</td>
                        <td className="py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            pos.side === 'Long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss'
                          )}>
                            {pos.side}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-foreground">{pos.entry.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono text-foreground">{pos.current.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono text-loss">{pos.stop.toFixed(2)}</td>
                        <td className="py-3 text-right font-mono text-profit">{pos.target.toFixed(2)}</td>
                        <td className="py-3 text-right text-foreground">{pos.size}</td>
                        <td className={cn('py-3 text-right font-semibold font-mono', pos.unrealizedPnL >= 0 ? 'text-profit' : 'text-loss')}>
                          {pos.unrealizedPnL >= 0 ? '+' : ''}${pos.unrealizedPnL.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Trades */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Recent Trades</h3>
              </div>
              <button className="text-xs text-primary hover:text-primary/80 transition-colors">View All →</button>
            </div>
            {tradesLoading ? (
              <LoadingState message="Loading trades..." />
            ) : (
              <div className="space-y-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center',
                        trade.pnl >= 0 ? 'bg-profit/10' : 'bg-loss/10'
                      )}>
                        {trade.pnl >= 0 ? <ArrowUpRight className="h-4 w-4 text-profit" /> : <ArrowDownRight className="h-4 w-4 text-loss" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{trade.symbol} · {trade.setup}</p>
                        <p className="text-xs text-muted-foreground">{trade.date} · {trade.session}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-sm font-semibold font-mono', trade.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - 1 col */}
        <div className="space-y-4">
          {/* Watchlist */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Watchlist</h3>
            </div>
            {watchlistLoading ? (
              <LoadingState message="Loading watchlist..." />
            ) : (
              <div className="space-y-1">
                {(watchlist ?? []).map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.symbol}</p>
                      <p className="text-xs text-muted-foreground">Vol: {item.volume}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-foreground">{item.price.toLocaleString()}</p>
                      <p className={cn('text-xs font-medium', item.change >= 0 ? 'text-profit' : 'text-loss')}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Session Info */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Session Info</h3>
            <div className="space-y-3">
              {[
                { name: 'Pre-Market', time: '4:00 - 9:30 ET', status: 'completed' },
                { name: 'NY AM Session', time: '9:30 - 12:00 ET', status: 'active' },
                { name: 'NY PM Session', time: '12:00 - 16:00 ET', status: 'upcoming' },
                { name: 'London Session', time: '3:00 - 11:30 ET', status: 'completed' },
              ].map((session) => (
                <div key={session.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      session.status === 'active' ? 'bg-profit animate-pulse-subtle' :
                      session.status === 'completed' ? 'bg-muted-foreground' : 'bg-warning'
                    )} />
                    <span className="text-sm text-foreground">{session.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{session.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Focus */}
          <div className="glass-card p-5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Today's Focus</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { text: 'Only trade NQ breakout setups', done: true },
                { text: 'Max 3 trades today', done: false },
                { text: 'Wait for candle close on entries', done: true },
                { text: 'No trading after 2:00 PM', done: false },
                { text: 'Review trades before closing', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <CheckSquare className={cn('h-4 w-4 shrink-0', item.done ? 'text-profit' : 'text-muted-foreground')} />
                  <span className={cn('text-sm', item.done ? 'text-muted-foreground line-through' : 'text-foreground')}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Alerts</h3>
            <div className="space-y-2">
              {(notifications ?? []).slice(0, 3).map(n => (
                <div key={n.id} className="p-2.5 rounded-lg bg-muted/30 text-xs">
                  <p className="text-foreground">{n.message}</p>
                  <p className="text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
