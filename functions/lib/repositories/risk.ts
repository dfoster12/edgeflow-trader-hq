// ============================================
// Risk Settings Repository (Production-Ready)
// ============================================

import { queryOne, execute } from '../db';
import { mockRiskSettings } from '../mock-data';

export interface RiskRow {
  id: string;
  user_id: string;
  max_daily_loss: number;
  max_weekly_loss: number;
  max_trades_per_day: number;
  risk_per_trade: number;
  updated_at: string;
}

// ---- Validation ----

export function validateRiskUpdate(body: Record<string, unknown>): string | null {
  const numFields = ['max_daily_loss', 'max_weekly_loss', 'max_trades_per_day', 'risk_per_trade'];
  for (const f of numFields) {
    if (f in body && (typeof body[f] !== 'number' || isNaN(body[f] as number))) {
      return `${f} must be a valid number`;
    }
  }
  if ('max_daily_loss' in body && (body.max_daily_loss as number) <= 0) return 'max_daily_loss must be positive';
  if ('max_weekly_loss' in body && (body.max_weekly_loss as number) <= 0) return 'max_weekly_loss must be positive';
  if ('max_trades_per_day' in body && (body.max_trades_per_day as number) < 1) return 'max_trades_per_day must be >= 1';
  if ('risk_per_trade' in body && (body.risk_per_trade as number) <= 0) return 'risk_per_trade must be positive';
  return null;
}

export const riskRepo = {
  async get(db: D1Database, userId: string): Promise<RiskRow | null> {
    return queryOne<RiskRow>(db, 'SELECT * FROM risk_settings WHERE user_id = ?', [userId]);
  },

  /** Insert or update risk settings for a user */
  async upsert(
    db: D1Database,
    userId: string,
    fields: Partial<Pick<RiskRow, 'max_daily_loss' | 'max_weekly_loss' | 'max_trades_per_day' | 'risk_per_trade'>>,
  ): Promise<RiskRow> {
    const existing = await this.get(db, userId);

    if (existing) {
      const ALLOWED = ['max_daily_loss', 'max_weekly_loss', 'max_trades_per_day', 'risk_per_trade'] as const;
      const sets: string[] = [];
      const params: unknown[] = [];

      for (const k of ALLOWED) {
        if (k in fields && fields[k] !== undefined) {
          sets.push(`${k} = ?`);
          params.push(fields[k]);
        }
      }

      if (sets.length > 0) {
        sets.push("updated_at = datetime('now')");
        params.push(userId);
        await execute(db, `UPDATE risk_settings SET ${sets.join(', ')} WHERE user_id = ?`, params);
      }
    } else {
      const id = crypto.randomUUID();
      await execute(db,
        `INSERT INTO risk_settings (id, user_id, max_daily_loss, max_weekly_loss, max_trades_per_day, risk_per_trade)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id, userId,
          fields.max_daily_loss ?? 2000,
          fields.max_weekly_loss ?? 5000,
          fields.max_trades_per_day ?? 5,
          fields.risk_per_trade ?? 1.5,
        ],
      );
    }

    const result = await this.get(db, userId);
    if (!result) throw new Error('Failed to read back risk settings');
    return result;
  },

  getMock(): RiskRow {
    return mockRiskSettings as RiskRow;
  },
};
