// ============================================
// Cloudflare Pages Function: /api/risk
// ============================================

interface Env {
  // DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: SELECT * FROM risk_settings WHERE user_id = ?
  return Response.json({ data: null });
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    // TODO: UPDATE risk_settings SET ... WHERE user_id = ?
    return Response.json({ data: body });
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
};
