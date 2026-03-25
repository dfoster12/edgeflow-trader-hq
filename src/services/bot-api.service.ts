// ============================================
// NQ Trading Bot API Bridge
// ============================================
// Fetches data from the trading bot's FastAPI server and transforms
// it into the shapes EdgeFlow components expect.

import env from '@/config/env';
import type {
  DashboardKpis,
  Trade,
  OpenPosition,
  RiskSettings,
  CandleData,
  EquityCurvePoint,
  AnalyticsData,
} from '@/types';

// --- Bot API response types ---

interface BotLiveState {
  timestamp: string;
  price: number;
  position: number;
  position_str: string;
  last_action: number;
  last_action_str: string;
  realized_pnl: number;
  unrealized_pnl: number;
  total_pnl: number;
  equity: number;
  trades_today: number;
  trading_enabled: boolean;
  risk_status: string;
  max_drawdown: number;
}

interface BotTradeEntry {
  timestamp: string;
  price: number;
  action: number;
  action_name: string;
  position_before: number;
  position_after: number;
  realized_pnl: number;
  unrealized_pnl: number;
  total_pnl: number;
  equity: number;
}

interface BotPriceBar {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BotEquityPoint {
  timestamp: string;
  equity: number;
  pnl: number;
}

// --- Fetcher ---

async function botFetch<T>(endpoint: string): Promise<T> {
  const url = `${env.botApiUrl}${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Bot API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// --- Public API ---

export const botApiService = {
  /** Check if bot API is configured */
  isConfigured(): boolean {
    return !!env.botApiUrl;
  },

  async getState(): Promise<BotLiveState> {
    return botFetch<BotLiveState>('/api/state');
  },

  /** Transform bot state into dashboard KPIs */
  async getKpis(): Promise<DashboardKpis> {
    const state = await this.getState();
    return {
      dailyPnL: state.total_pnl,
      weeklyPnL: state.total_pnl, // bot only tracks daily; same value for now
      winRate: 0, // not available from bot state
      accountBalance: state.equity,
      riskUsedToday: state.max_drawdown !== 0 ? Math.abs(state.max_drawdown / 20) : 0,
      openPositions: state.position !== 0 ? 1 : 0,
    };
  },

  /** Transform bot state into risk settings */
  async getRisk(): Promise<RiskSettings> {
    const state = await this.getState();
    return {
      maxDailyLoss: 2000,
      maxWeeklyLoss: 5000,
      maxTradesPerDay: 5,
      riskPerTrade: 1.5,
      currentDrawdown: state.max_drawdown,
      currentRiskUsage: state.max_drawdown !== 0 ? Math.min(100, Math.abs(state.max_drawdown / 20)) : 0,
      winStreak: 0,
      lossStreak: 0,
      disciplineScore: state.risk_status === 'OK' ? 100 : 50,
      todayTradeCount: state.trades_today,
      todayLoss: state.total_pnl < 0 ? Math.abs(state.total_pnl) : 0,
    };
  },

  /** Transform bot trades into EdgeFlow trades */
  async getTrades(date?: string): Promise<Trade[]> {
    const params = date ? `?date=${date}` : '';
    const botTrades = await botFetch<BotTradeEntry[]>(`/api/trades${params}`);

    return botTrades.map((t, i) => {
      const side = t.action_name.includes('BUY') ? 'Long' as const : 'Short' as const;
      return {
        id: String(i + 1),
        date: t.timestamp,
        symbol: 'MNQ',
        setup: t.action_name,
        side,
        entry: t.price,
        exit: t.price, // bot logs each action separately
        size: Math.abs(t.position_after - t.position_before) || 1,
        pnl: t.realized_pnl,
        rMultiple: 0,
        status: 'Closed' as const,
        session: 'NY AM',
        notes: `P&L: $${t.total_pnl.toFixed(2)} | Equity: $${t.equity.toFixed(2)}`,
      };
    });
  },

  /** Transform bot open position from state */
  async getOpenPositions(): Promise<OpenPosition[]> {
    const state = await this.getState();
    if (state.position === 0) return [];

    return [{
      symbol: 'MNQ',
      side: state.position > 0 ? 'Long' as const : 'Short' as const,
      entry: state.price, // approximate; bot doesn't expose entry price in state
      current: state.price,
      stop: 0,
      target: 0,
      unrealizedPnL: state.unrealized_pnl,
      size: Math.abs(state.position),
    }];
  },

  /** Get price bars as CandleData */
  async getPrices(limit = 200): Promise<CandleData[]> {
    const bars = await botFetch<BotPriceBar[]>(`/api/prices?limit=${limit}`);
    return bars.map((b, i) => ({
      time: i, // sequential index — matches mock format
      open: b.open,
      high: b.high,
      low: b.low,
      close: b.close,
      volume: b.volume,
    }));
  },

  /** Get equity curve */
  async getEquityCurve(date?: string): Promise<EquityCurvePoint[]> {
    const params = date ? `?date=${date}` : '';
    const points = await botFetch<BotEquityPoint[]>(`/api/equity${params}`);
    return points.map(p => ({
      date: p.timestamp,
      value: p.equity,
    }));
  },

  /** Build analytics from trades + equity (best-effort from bot data) */
  async getAnalytics(): Promise<AnalyticsData> {
    const trades = await this.getTrades();
    const equity = await this.getEquityCurve();

    const winners = trades.filter(t => t.pnl > 0);
    const losers = trades.filter(t => t.pnl < 0);
    const totalProfit = trades.reduce((s, t) => s + t.pnl, 0);

    return {
      equityCurve: equity,
      weekdayPerformance: [],
      setupPerformance: [],
      timePerformance: [],
      dailyHeatmap: [],
      stats: {
        totalTrades: trades.length,
        totalProfit,
        avgWinner: winners.length ? winners.reduce((s, t) => s + t.pnl, 0) / winners.length : 0,
        avgLoser: losers.length ? losers.reduce((s, t) => s + t.pnl, 0) / losers.length : 0,
        largestWin: winners.length ? Math.max(...winners.map(t => t.pnl)) : 0,
        largestLoss: losers.length ? Math.min(...losers.map(t => t.pnl)) : 0,
        avgRMultiple: 0,
        expectancy: trades.length ? totalProfit / trades.length : 0,
        profitFactor: losers.length
          ? Math.abs(winners.reduce((s, t) => s + t.pnl, 0) / losers.reduce((s, t) => s + t.pnl, 0))
          : 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
      },
    };
  },
};
