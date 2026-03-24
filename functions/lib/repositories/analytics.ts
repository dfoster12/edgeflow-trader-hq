// ============================================
// Analytics Repository (Production-Ready)
// ============================================
// Computes analytics on-the-fly from the trades table.
// No separate analytics storage needed — all derived from persisted trades.

import { queryAll, queryOne } from '../db';

export interface AnalyticsStats {
  totalTrades: number;
  totalProfit: number;
  avgWinner: number;
  avgLoser: number;
  largestWin: number;
  largestLoss: number;
  winRate: number;
  profitFactor: number;
  avgRMultiple: number;
  expectancy: number;
  maxDrawdown: number;
}

export interface EquityCurvePoint {
  date: string;
  pnl: number;
  cumulative: number;
}

export interface WeekdayPerformance {
  day: string;
  pnl: number;
  trades: number;
}

export interface SetupPerformance {
  setup: string;
  winRate: number;
  avgR: number;
  trades: number;
}

export const analyticsRepo = {
  /** Aggregate stats computed from all user trades */
  async getStats(db: D1Database, userId: string): Promise<AnalyticsStats> {
    const row = await queryOne<Record<string, number>>(db, `
      SELECT
        COUNT(*)                                                   AS total_trades,
        COALESCE(SUM(pnl), 0)                                     AS total_profit,
        COALESCE(AVG(CASE WHEN pnl > 0 THEN pnl END), 0)          AS avg_winner,
        COALESCE(AVG(CASE WHEN pnl < 0 THEN pnl END), 0)          AS avg_loser,
        COALESCE(MAX(pnl), 0)                                      AS largest_win,
        COALESCE(MIN(pnl), 0)                                      AS largest_loss,
        COALESCE(SUM(CASE WHEN pnl > 0 THEN pnl ELSE 0 END), 0)   AS gross_profit,
        COALESCE(ABS(SUM(CASE WHEN pnl < 0 THEN pnl ELSE 0 END)), 0) AS gross_loss,
        COALESCE(SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END), 0)    AS win_count,
        COALESCE(AVG(r_multiple), 0)                               AS avg_r
      FROM trades WHERE user_id = ? AND status = 'Closed'
    `, [userId]);

    const empty: AnalyticsStats = {
      totalTrades: 0, totalProfit: 0, avgWinner: 0, avgLoser: 0,
      largestWin: 0, largestLoss: 0, winRate: 0, profitFactor: 0,
      avgRMultiple: 0, expectancy: 0, maxDrawdown: 0,
    };

    if (!row || row.total_trades === 0) return empty;

    const winRate = (row.win_count / row.total_trades) * 100;
    const lossRate = 100 - winRate;
    const profitFactor = row.gross_loss > 0 ? row.gross_profit / row.gross_loss : 0;
    const expectancy = (winRate / 100) * row.avg_winner + (lossRate / 100) * row.avg_loser;

    return {
      totalTrades: row.total_trades,
      totalProfit: row.total_profit,
      avgWinner: row.avg_winner,
      avgLoser: row.avg_loser,
      largestWin: row.largest_win,
      largestLoss: row.largest_loss,
      winRate,
      profitFactor,
      avgRMultiple: row.avg_r,
      expectancy,
      maxDrawdown: 0, // TODO: compute from running cumulative P&L
    };
  },

  /** Daily P&L for equity curve charting */
  async getEquityCurve(db: D1Database, userId: string): Promise<EquityCurvePoint[]> {
    const rows = await queryAll<{ date: string; daily_pnl: number }>(db,
      `SELECT date, SUM(pnl) AS daily_pnl
       FROM trades WHERE user_id = ? AND status = 'Closed'
       GROUP BY date ORDER BY date`,
      [userId],
    );

    let cumulative = 0;
    return rows.map(r => {
      cumulative += r.daily_pnl;
      return { date: r.date, pnl: r.daily_pnl, cumulative };
    });
  },

  /** Performance broken down by day of week */
  async getWeekdayPerformance(db: D1Database, userId: string): Promise<WeekdayPerformance[]> {
    // D1 uses SQLite strftime — %w gives 0=Sunday..6=Saturday
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rows = await queryAll<{ dow: number; pnl: number; cnt: number }>(db,
      `SELECT CAST(strftime('%w', date) AS INTEGER) AS dow, SUM(pnl) AS pnl, COUNT(*) AS cnt
       FROM trades WHERE user_id = ? AND status = 'Closed'
       GROUP BY dow ORDER BY dow`,
      [userId],
    );
    return rows.map(r => ({ day: dayNames[r.dow] || 'Unknown', pnl: r.pnl, trades: r.cnt }));
  },

  /** Win rate and avg R by setup type */
  async getSetupPerformance(db: D1Database, userId: string): Promise<SetupPerformance[]> {
    return queryAll<SetupPerformance>(db,
      `SELECT
         setup,
         ROUND(SUM(CASE WHEN pnl > 0 THEN 1.0 ELSE 0 END) / COUNT(*) * 100, 1) AS winRate,
         ROUND(AVG(r_multiple), 2) AS avgR,
         COUNT(*) AS trades
       FROM trades WHERE user_id = ? AND status = 'Closed' AND setup != ''
       GROUP BY setup ORDER BY trades DESC`,
      [userId],
    );
  },
};
