// ============================================
// Watchlist Repository
// ============================================

import { queryAll, execute } from '../db';
import { mockWatchlist } from '../mock-data';

export interface WatchlistRow {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
}

export const watchlistRepo = {
  async list(db: D1Database, userId: string): Promise<WatchlistRow[]> {
    return queryAll<WatchlistRow>(db, 'SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at', [userId]);
  },

  async add(db: D1Database, userId: string, symbol: string): Promise<WatchlistRow> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await execute(db,
      'INSERT OR IGNORE INTO watchlist (id, user_id, symbol, created_at) VALUES (?, ?, ?, ?)',
      [id, userId, symbol.toUpperCase(), now],
    );
    const rows = await queryAll<WatchlistRow>(db,
      'SELECT * FROM watchlist WHERE user_id = ? AND symbol = ?', [userId, symbol.toUpperCase()]);
    return rows[0];
  },

  async remove(db: D1Database, userId: string, symbol: string): Promise<boolean> {
    const result = await execute(db, 'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?',
      [userId, symbol.toUpperCase()]);
    return (result.meta?.changes ?? 0) > 0;
  },

  getMockList(): WatchlistRow[] {
    return mockWatchlist as WatchlistRow[];
  },
};
