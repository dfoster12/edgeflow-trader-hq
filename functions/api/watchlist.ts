// ============================================
// Cloudflare Pages Function: /api/watchlist
// ============================================

interface Env {
  MARKET_DATA_API_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: Fetch watchlist symbols from database, then get live quotes from market data provider
  return Response.json({ data: [] });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    if (!body.symbol) {
      return Response.json({ error: 'Missing symbol' }, { status: 400 });
    }
    // TODO: INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)
    return Response.json({ data: { symbol: body.symbol } }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');
  if (!symbol) return Response.json({ error: 'Missing symbol' }, { status: 400 });
  // TODO: DELETE FROM watchlist WHERE user_id = ? AND symbol = ?
  return Response.json({ data: { success: true } });
};
