// ============================================
// Cloudflare Pages Function: /api/analytics
// ============================================
// All analytics are computed on-the-fly from persisted trades.
// No separate analytics table needed.

import { type Env, hasDatabase, ok, err } from '../lib/db';
import { analyticsRepo } from '../lib/repositories/analytics';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  if (!hasDatabase(context.env)) {
    return ok(null, { mock: true, message: 'No D1 database bound — frontend uses client-side mock data' });
  }

  try {
    const [stats, equityCurve, weekdayPerformance, setupPerformance] = await Promise.all([
      analyticsRepo.getStats(context.env.DB!, userId),
      analyticsRepo.getEquityCurve(context.env.DB!, userId),
      analyticsRepo.getWeekdayPerformance(context.env.DB!, userId),
      analyticsRepo.getSetupPerformance(context.env.DB!, userId),
    ]);

    return ok({ stats, equityCurve, weekdayPerformance, setupPerformance });
  } catch (e) {
    console.error('[/api/analytics GET]', e);
    return err('Failed to compute analytics');
  }
};
