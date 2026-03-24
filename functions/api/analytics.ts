// ============================================
// Cloudflare Pages Function: /api/analytics
// ============================================
// Computes analytics directly from the trades table — no separate storage.

import type { Env } from '../lib/db';
import { hasDatabase } from '../lib/db';
import { analyticsRepo } from '../lib/repositories/analytics';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  if (!hasDatabase(context.env)) {
    return Response.json({ data: null, error: 'No database connected — using client-side mock data', meta: { mock: true } });
  }

  try {
    const [stats, equityCurve] = await Promise.all([
      analyticsRepo.getStats(context.env.DB!, userId),
      analyticsRepo.getEquityCurve(context.env.DB!, userId),
    ]);
    return Response.json({ data: { stats, equityCurve } });
  } catch { return Response.json({ error: 'Failed to compute analytics' }, { status: 500 }); }
};
