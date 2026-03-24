// ============================================
// Watchlist Repository (Production-Ready)
// ============================================

import { queryAll, queryOne, execute } from '../db';
import { mockWatchlist } from '../mock-data';

export interface WatchlistRow {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
}

export const watchlistRepo = {
  async list(db: D1Database, userId: string): Promise<WatchlistRow[]> {
    return queryAll<WatchlistRow>(
      db,
      'SELECT * FROM watchlist WHERE user_id = ? ORDER BY created_at',
      [userId],
    );
  },

  async add(db: D1Database, userId: string, symbol: string): Promise<WatchlistRow> {
    const normalized = symbol.toUpperCase().trim();
    if (!normalized) throw new Error('Symbol cannot be empty');

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    // INSERT OR IGNORE handles the UNIQUE(user_id, symbol) constraint
    await execute(db,
      'INSERT OR IGNORE INTO watchlist (id, user_id, symbol, created_at) VALUES (?, ?, ?, ?)',
      [id, userId, normalized, now],
    );

    // Always return the row (may be pre-existing if IGNORE triggered)
    const row = await queryOne<WatchlistRow>(db,
      'SELECT * FROM watchlist WHERE user_id = ? AND symbol = ?',
      [userId, normalized],
    );
    if (!row) throw new Error('Failed to read back watchlist entry');
    return row;
  },

  async remove(db: D1Database, userId: string, symbol: string): Promise<boolean> {
    const result = await execute(
      db,
      'DELETE FROM watchlist WHERE user_id = ? AND symbol = ?',
      [userId, symbol.toUpperCase().trim()],
    );
    return (result.meta?.changes ?? 0) > 0;
  },

  getMockList(): WatchlistRow[] {
    return mockWatchlist as WatchlistRow[];
  },
};
