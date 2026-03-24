// ============================================
// Trades Repository (Production-Ready)
// ============================================
// All trade persistence logic lives here.
// Route handlers call this module — never raw SQL in handlers.
//
// AUTH TODO: Replace getUserId() in route handlers with your
// real auth system (Cloudflare Access JWT, Auth0, Clerk, etc.)

import { queryAll, queryOne, execute } from '../db';
import { mockTrades } from '../mock-data';

// ---- Row type (matches D1 schema exactly) ----

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
  tags: string;            // JSON array stored as TEXT in D1
  screenshot_urls: string; // JSON array stored as TEXT in D1
  created_at: string;
  updated_at: string;
}

export interface CreateTradeInput {
  symbol: string;
  setup?: string;
  side: 'Long' | 'Short';
  entry: number;
  exit: number;
  size: number;
  stopLoss?: number;
  target?: number;
  session?: string;
  notes?: string;
  tags?: string[];
}

// ---- Validation ----

export function validateCreateTrade(body: Record<string, unknown>): string | null {
  if (!body.symbol || typeof body.symbol !== 'string') return 'symbol is required (string)';
  if (!body.side || !['Long', 'Short'].includes(body.side as string)) return 'side must be "Long" or "Short"';
  if (typeof body.entry !== 'number' || isNaN(body.entry as number)) return 'entry must be a number';
  if (typeof body.exit !== 'number' || isNaN(body.exit as number)) return 'exit must be a number';
  if (typeof body.size !== 'number' || (body.size as number) <= 0) return 'size must be a positive number';
  return null;
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

  /** Get a single trade by ID (scoped to user) */
  async getById(db: D1Database, userId: string, id: string): Promise<TradeRow | null> {
    return queryOne<TradeRow>(
      db,
      'SELECT * FROM trades WHERE id = ? AND user_id = ?',
      [id, userId],
    );
  },

  /** Insert a new trade and return the created row */
  async create(db: D1Database, userId: string, input: CreateTradeInput): Promise<TradeRow> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const dateStr = now.slice(0, 16).replace('T', ' ');

    // Auto-calculate P&L and R-multiple
    const pnl = (input.exit - input.entry) * input.size * (input.side === 'Long' ? 1 : -1);
    const riskPerUnit = input.stopLoss ? Math.abs(input.entry - input.stopLoss) : 0;
    const rMultiple = riskPerUnit > 0 ? pnl / (riskPerUnit * input.size) : 0;

    await execute(
      db,
      `INSERT INTO trades
        (id, user_id, date, symbol, setup, side, entry, exit_price, size,
         pnl, r_multiple, status, session, notes, stop_loss, target,
         tags, screenshot_urls, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Closed', ?, ?, ?, ?, ?, '[]', ?, ?)`,
      [
        id, userId, dateStr,
        input.symbol.toUpperCase(), input.setup || '', input.side,
        input.entry, input.exit, input.size,
        pnl, rMultiple,
        input.session || '', input.notes || '',
        input.stopLoss ?? null, input.target ?? null,
        JSON.stringify(input.tags || []),
        now, now,
      ],
    );

    // Return the freshly inserted row
    const created = await this.getById(db, userId, id);
    if (!created) throw new Error('Failed to read back created trade');
    return created;
  },

  /** Update allowed fields on an existing trade */
  async update(
    db: D1Database,
    userId: string,
    id: string,
    fields: Record<string, unknown>,
  ): Promise<TradeRow | null> {
    // Whitelist of columns that can be updated
    const ALLOWED = [
      'symbol', 'setup', 'side', 'entry', 'exit_price', 'size',
      'pnl', 'r_multiple', 'status', 'session', 'notes',
      'stop_loss', 'target', 'tags',
    ];

    const sets: string[] = [];
    const params: unknown[] = [];

    for (const key of ALLOWED) {
      if (key in fields) {
        sets.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(fields[key]) : fields[key]);
      }
    }

    if (sets.length === 0) return this.getById(db, userId, id);

    sets.push("updated_at = datetime('now')");
    params.push(id, userId);

    await execute(
      db,
      `UPDATE trades SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
      params,
    );

    return this.getById(db, userId, id);
  },

  /** Delete a trade (scoped to user). Returns true if a row was removed. */
  async delete(db: D1Database, userId: string, id: string): Promise<boolean> {
    const result = await execute(
      db,
      'DELETE FROM trades WHERE id = ? AND user_id = ?',
      [id, userId],
    );
    return (result.meta?.changes ?? 0) > 0;
  },

  // ---- Mock fallback (no D1 binding) ----
  getMockList(): TradeRow[] {
    return mockTrades as TradeRow[];
  },
};
