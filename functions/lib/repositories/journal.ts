// ============================================
// Journal Repository (Production-Ready)
// ============================================

import { queryAll, queryOne, execute } from '../db';
import { mockJournalEntries } from '../mock-data';

export interface JournalRow {
  id: string;
  user_id: string;
  date: string;
  emotional_state: string;
  premarket_plan: string;
  postmarket_review: string;
  market_notes: string;
  lessons: string;
  tags: string;            // JSON array as TEXT
  trades_count: number;
  pnl: number;
  screenshot_urls: string; // JSON array as TEXT
  created_at: string;
  updated_at: string;
}

export interface CreateJournalInput {
  date: string;
  emotionalState: string;
  premarketPlan: string;
  postmarketReview?: string;
  marketNotes?: string;
  lessons?: string;
  tags?: string[];
}

// ---- Validation ----

export function validateCreateJournal(body: Record<string, unknown>): string | null {
  if (!body.date || typeof body.date !== 'string') return 'date is required (string, YYYY-MM-DD)';
  if (!body.emotionalState || typeof body.emotionalState !== 'string') return 'emotionalState is required';
  if (!body.premarketPlan || typeof body.premarketPlan !== 'string') return 'premarketPlan is required';
  return null;
}

export const journalRepo = {
  async list(db: D1Database, userId: string): Promise<JournalRow[]> {
    return queryAll<JournalRow>(
      db,
      'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY date DESC',
      [userId],
    );
  },

  async getById(db: D1Database, userId: string, id: string): Promise<JournalRow | null> {
    return queryOne<JournalRow>(
      db,
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [id, userId],
    );
  },

  async create(db: D1Database, userId: string, input: CreateJournalInput): Promise<JournalRow> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await execute(db,
      `INSERT INTO journal_entries
        (id, user_id, date, emotional_state, premarket_plan, postmarket_review,
         market_notes, lessons, tags, trades_count, pnl, screenshot_urls,
         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, '[]', ?, ?)`,
      [
        id, userId, input.date,
        input.emotionalState, input.premarketPlan,
        input.postmarketReview || '', input.marketNotes || '',
        input.lessons || '', JSON.stringify(input.tags || []),
        now, now,
      ],
    );

    const created = await this.getById(db, userId, id);
    if (!created) throw new Error('Failed to read back created journal entry');
    return created;
  },

  async update(
    db: D1Database,
    userId: string,
    id: string,
    fields: Record<string, unknown>,
  ): Promise<JournalRow | null> {
    const ALLOWED = [
      'date', 'emotional_state', 'premarket_plan', 'postmarket_review',
      'market_notes', 'lessons', 'tags', 'trades_count', 'pnl',
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
    await execute(db, `UPDATE journal_entries SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, params);
    return this.getById(db, userId, id);
  },

  async delete(db: D1Database, userId: string, id: string): Promise<boolean> {
    const result = await execute(db, 'DELETE FROM journal_entries WHERE id = ? AND user_id = ?', [id, userId]);
    return (result.meta?.changes ?? 0) > 0;
  },

  getMockList(): JournalRow[] {
    return mockJournalEntries as JournalRow[];
  },
};
