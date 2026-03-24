// ============================================
// Trades Repository
// ============================================
// All trade persistence logic. Route handlers call this — never raw SQL.

import { queryAll, queryOne, execute } from '../db';
import { mockTrades } from '../mock-data';

// ---- Types ----

export interface TradeRow {
  id: string;
  user_id: string;
  date: string;
  symbol: string;
  setup: string;
  side: string;
  entry: number;
  exit_price: number;
  size: number;
  pnl: number;
  r_multiple: number;
  status: string;
  session: string;
  notes: string;
  stop_loss: number | null;
  target: number | null;
  tags: string;
  screenshot_urls: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTradeInput {
  symbol: string;
  setup?: string;
  side: string;
  entry: number;
  exit: number;
  size: number;
  stopLoss?: number;
  target?: number;
  session?: string;
  notes?: string;
  tags?: string[];
}

// ---- Repository ----

export const tradesRepo = {
  /** List all trades for a user, newest first */
  async list(db: D1Database, userId: string): Promise<TradeRow[]> {
    return queryAll<TradeRow>(
      db,
      'SELECT * FROM trades WHERE user_id = ? ORDER BY date DESC',
      [userId],
    );
  },

  /** Get a single trade by ID */
  async getById(db: D1Database, userId: string, id: string): Promise<TradeRow | null> {
    return queryOne<TradeRow>(
      db,
      'SELECT * FROM trades WHERE id = ? AND user_id = ?',
      [id, userId],
    );
  },

  /** Insert a new trade */
  async create(db: D1Database, userId: string, input: CreateTradeInput): Promise<TradeRow> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const pnl = (input.exit - input.entry) * input.size * (input.side === 'Long' ? 1 : -1);
    const rMultiple = input.stopLoss
      ? Math.abs(pnl / ((input.entry - input.stopLoss) * input.size))
      : 0;

    await execute(
      db,
      `INSERT INTO trades
        (id, user_id, date, symbol, setup, side, entry, exit_price, size, pnl, r_multiple,
         status, session, notes, stop_loss, target, tags, screenshot_urls, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Closed', ?, ?, ?, ?, ?, '[]', ?, ?)`,
      [
        id, userId, now.slice(0, 16).replace('T', ' '),
        input.symbol, input.setup || '', input.side, input.entry, input.exit, input.size,
        pnl, rMultiple, input.session || '', input.notes || '',
        input.stopLoss ?? null, input.target ?? null,
        JSON.stringify(input.tags || []), now, now,
      ],
    );

    return (await this.getById(db, userId, id))!;
  },

  /** Update an existing trade */
  async update(db: D1Database, userId: string, id: string, fields: Record<string, unknown>): Promise<TradeRow | null> {
    // Build dynamic SET clause from provided fields
    const allowed = ['symbol', 'setup', 'side', 'entry', 'exit_price', 'size', 'pnl',
      'r_multiple', 'status', 'session', 'notes', 'stop_loss', 'target', 'tags'];
    const sets: string[] = [];
    const params: unknown[] = [];

    for (const key of allowed) {
      if (key in fields) {
        sets.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(fields[key]) : fields[key]);
      }
    }
    if (sets.length === 0) return this.getById(db, userId, id);

    sets.push("updated_at = datetime('now')");
    params.push(id, userId);

    await execute(db, `UPDATE trades SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, params);
    return this.getById(db, userId, id);
  },

  /** Delete a trade */
  async delete(db: D1Database, userId: string, id: string): Promise<boolean> {
    const result = await execute(db, 'DELETE FROM trades WHERE id = ? AND user_id = ?', [id, userId]);
    return (result.meta?.changes ?? 0) > 0;
  },

  // ---- Mock fallback ----
  getMockList(): TradeRow[] {
    return mockTrades as TradeRow[];
  },
};
