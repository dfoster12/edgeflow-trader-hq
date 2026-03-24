// ============================================
// Analytics Repository
// ============================================
// Computes analytics from the trades table. No separate analytics storage needed.

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
}

export const analyticsRepo = {
  async getStats(db: D1Database, userId: string): Promise<AnalyticsStats> {
    const row = await queryOne<Record<string, number>>(db, `
      SELECT
        COUNT(*) AS total_trades,
        COALESCE(SUM(pnl), 0) AS total_profit,
        COALESCE(AVG(CASE WHEN pnl > 0 THEN pnl END), 0) AS avg_winner,
        COALESCE(AVG(CASE WHEN pnl < 0 THEN pnl END), 0) AS avg_loser,
        COALESCE(MAX(pnl), 0) AS largest_win,
        COALESCE(MIN(pnl), 0) AS largest_loss,
        COALESCE(SUM(CASE WHEN pnl > 0 THEN pnl ELSE 0 END), 0) AS gross_profit,
        COALESCE(ABS(SUM(CASE WHEN pnl < 0 THEN pnl ELSE 0 END)), 1) AS gross_loss,
        COALESCE(SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END), 0) AS win_count
      FROM trades WHERE user_id = ?
    `, [userId]);

    if (!row || row.total_trades === 0) {
      return { totalTrades: 0, totalProfit: 0, avgWinner: 0, avgLoser: 0,
        largestWin: 0, largestLoss: 0, winRate: 0, profitFactor: 0 };
    }

    return {
      totalTrades: row.total_trades,
      totalProfit: row.total_profit,
      avgWinner: row.avg_winner,
      avgLoser: row.avg_loser,
      largestWin: row.largest_win,
      largestLoss: row.largest_loss,
      winRate: row.total_trades > 0 ? (row.win_count / row.total_trades) * 100 : 0,
      profitFactor: row.gross_loss > 0 ? row.gross_profit / row.gross_loss : 0,
    };
  },

  async getEquityCurve(db: D1Database, userId: string) {
    return queryAll<{ date: string; pnl: number }>(db,
      `SELECT date, SUM(pnl) as pnl FROM trades WHERE user_id = ? GROUP BY date ORDER BY date`, [userId]);
  },
};
