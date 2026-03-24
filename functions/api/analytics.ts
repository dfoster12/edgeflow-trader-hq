// ============================================
// Cloudflare Pages Function: /api/analytics
// ============================================

interface Env {
  // DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: Compute analytics from trades table
  // SELECT COUNT(*), SUM(pnl), AVG(CASE WHEN pnl > 0 THEN pnl END), etc. FROM trades WHERE user_id = ?
  return Response.json({ data: null, error: 'Analytics endpoint — connect database to enable' });
};
