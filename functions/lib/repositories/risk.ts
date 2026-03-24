// ============================================
// Risk Settings Repository
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

export const riskRepo = {
  async get(db: D1Database, userId: string): Promise<RiskRow | null> {
    return queryOne<RiskRow>(db, 'SELECT * FROM risk_settings WHERE user_id = ?', [userId]);
  },

  async upsert(db: D1Database, userId: string, fields: Partial<Omit<RiskRow, 'id' | 'user_id' | 'updated_at'>>): Promise<RiskRow> {
    const existing = await this.get(db, userId);
    if (existing) {
      const sets: string[] = [];
      const params: unknown[] = [];
      for (const [k, v] of Object.entries(fields)) {
        if (v !== undefined) { sets.push(`${k} = ?`); params.push(v); }
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
        [id, userId, fields.max_daily_loss ?? 2000, fields.max_weekly_loss ?? 5000,
         fields.max_trades_per_day ?? 5, fields.risk_per_trade ?? 1.5],
      );
    }
    return (await this.get(db, userId))!;
  },

  getMock(): RiskRow {
    return mockRiskSettings as RiskRow;
  },
};
