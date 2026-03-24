import { useState } from 'react';
import { KpiCard } from '@/components/KpiCard';
import { LoadingState, ErrorState, EmptyState } from '@/components/StateViews';
import { useTrades, useTradeStats, useCreateTrade } from '@/hooks/use-trades';
import {
  BarChart3, Filter, Plus, Download, ChevronDown, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { CreateTradeInput, TradeSide } from '@/types';

export default function Trades() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: allTrades, isLoading, error, refetch } = useTrades();
  const { data: stats, isLoading: statsLoading } = useTradeStats();
  const createTrade = useCreateTrade();

  // Form state for new trade
  const [form, setForm] = useState<Record<string, string>>({});
  const updateField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSaveTrade = () => {
    const input: CreateTradeInput = {
      symbol: form.symbol || 'NQ',
      setup: form.setup || 'Breakout',
      side: (form.side as TradeSide) || 'Long',
      size: Number(form.size) || 1,
      entry: Number(form.entry) || 0,
      exit: Number(form.exit) || 0,
      stopLoss: form.stopLoss ? Number(form.stopLoss) : undefined,
      target: form.target ? Number(form.target) : undefined,
      notes: form.notes || '',
    };

    if (!input.entry || !input.exit) {
      toast({ title: 'Missing fields', description: 'Entry and exit prices are required.', variant: 'destructive' });
      return;
    }

    createTrade.mutate(input, {
      onSuccess: () => {
        setModalOpen(false);
        setForm({});
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trades</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and review your trade history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted-foreground hover:text-foreground">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)} className="gap-1.5 border-border text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Trade
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Total Trades" value={statsLoading ? '...' : String(stats?.totalTrades ?? 0)} icon={<BarChart3 className="h-4 w-4" />} />
        <KpiCard title="Total Profit" value={statsLoading ? '...' : `$${(stats?.totalProfit ?? 0).toLocaleString()}`} variant="profit" />
        <KpiCard title="Avg Winner" value={statsLoading ? '...' : `$${(stats?.avgWinner ?? 0).toLocaleString()}`} variant="profit" />
        <KpiCard title="Avg Loser" value={statsLoading ? '...' : `$${Math.abs(stats?.avgLoser ?? 0).toLocaleString()}`} variant="loss" />
        <KpiCard title="Largest Win" value={statsLoading ? '...' : `$${(stats?.largestWin ?? 0).toLocaleString()}`} variant="profit" />
        <KpiCard title="Largest Loss" value={statsLoading ? '...' : `$${Math.abs(stats?.largestLoss ?? 0).toLocaleString()}`} variant="loss" />
      </div>

      {/* Filter Bar */}
      {filterOpen && (
        <div className="glass-card p-4 flex flex-wrap items-center gap-3 animate-slide-up">
          {['NQ', 'ES', 'All Symbols'].map(s => (
            <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-all">
              {s}
            </button>
          ))}
          <div className="h-4 w-px bg-border" />
          {['All', 'Winners', 'Losers'].map(s => (
            <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-all">
              {s}
            </button>
          ))}
          <div className="h-4 w-px bg-border" />
          {['Breakout', 'Pullback', 'Reversal', 'All Setups'].map(s => (
            <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Trade Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading trades..." />
        ) : error ? (
          <ErrorState message="Failed to load trades" onRetry={() => refetch()} />
        ) : !allTrades?.length ? (
          <EmptyState title="No trades yet" description="Log your first trade to get started." action={{ label: 'New Trade', onClick: () => setModalOpen(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  {['Date', 'Symbol', 'Setup', 'Side', 'Entry', 'Exit', 'Size', 'P&L', 'R Multiple', 'Session', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-medium">
                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                        {h} <ChevronDown className="h-3 w-3" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTrades.map((trade) => {
                  const exitPrice = trade.exit ?? (trade as any).exit_price ?? 0;
                  const entryPrice = trade.entry ?? 0;
                  const pnl = trade.pnl ?? 0;
                  const rMul = trade.rMultiple ?? (trade as any).r_multiple ?? 0;
                  return (
                  <tr key={trade.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer group">
                    <td className="px-5 py-4 text-muted-foreground text-xs">{trade.date}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{trade.symbol}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">{trade.setup}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', trade.side === 'Long' ? 'bg-profit/10 text-profit' : 'bg-loss/10 text-loss')}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-foreground">{entryPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 font-mono text-foreground">{exitPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 text-foreground">{trade.size}</td>
                    <td className={cn('px-5 py-4 font-semibold font-mono', pnl >= 0 ? 'text-profit' : 'text-loss')}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </td>
                    <td className={cn('px-5 py-4 font-mono text-sm', rMul >= 0 ? 'text-profit' : 'text-loss')}>
                      {rMul > 0 ? '+' : ''}{rMul}R
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{trade.session}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-profit/10 text-profit text-xs font-medium">{trade.status}</span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Trade Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Log New Trade</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Symbol', key: 'symbol', placeholder: 'NQ' },
                  { label: 'Setup Type', key: 'setup', placeholder: 'Breakout' },
                  { label: 'Side', key: 'side', placeholder: 'Long / Short' },
                  { label: 'Size', key: 'size', placeholder: '2' },
                  { label: 'Entry Price', key: 'entry', placeholder: '21456.25' },
                  { label: 'Exit Price', key: 'exit', placeholder: '21502.50' },
                  { label: 'Stop Loss', key: 'stopLoss', placeholder: '21430.00' },
                  { label: 'Target', key: 'target', placeholder: '21520.00' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{field.label}</label>
                    <input
                      value={form[field.key] || ''}
                      onChange={e => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes || ''}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="Trade notes..."
                  className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1 border-border text-muted-foreground">Cancel</Button>
                <Button
                  onClick={handleSaveTrade}
                  disabled={createTrade.isPending}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createTrade.isPending ? 'Saving...' : 'Save Trade'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
