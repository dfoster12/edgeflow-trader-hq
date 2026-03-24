// ============================================
// Cloudflare Pages Function: /api/watchlist
// ============================================

import type { Env } from '../lib/db';
import { hasDatabase } from '../lib/db';
import { watchlistRepo } from '../lib/repositories/watchlist';
import { marketDataProvider } from '../lib/market-data-provider';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  // 1. Get symbols from DB or mock
  let symbols: string[];
  if (hasDatabase(context.env)) {
    const rows = await watchlistRepo.list(context.env.DB!, userId);
    symbols = rows.map(r => r.symbol);
  } else {
    symbols = watchlistRepo.getMockList().map(r => r.symbol);
  }

  // 2. Fetch live quotes via the provider abstraction
  const quotes = await marketDataProvider.getQuotes(
    symbols,
    context.env.MARKET_DATA_API_KEY,
    context.env.MARKET_DATA_PROVIDER || 'polygon',
  );

  return Response.json({ data: quotes, meta: { mock: !hasDatabase(context.env) } });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: 'Invalid request body' }, { status: 400 }); }

  if (!body.symbol) return Response.json({ error: 'Missing symbol' }, { status: 400 });

  if (!hasDatabase(context.env)) {
    return Response.json({ data: { symbol: (body.symbol as string).toUpperCase() }, meta: { mock: true } }, { status: 201 });
  }

  try {
    const row = await watchlistRepo.add(context.env.DB!, userId, body.symbol as string);
    return Response.json({ data: row }, { status: 201 });
  } catch { return Response.json({ error: 'Failed to add symbol' }, { status: 500 }); }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');
  if (!symbol) return Response.json({ error: 'Missing symbol' }, { status: 400 });

  if (!hasDatabase(context.env)) return Response.json({ data: { success: true }, meta: { mock: true } });

  try {
    const ok = await watchlistRepo.remove(context.env.DB!, userId, symbol);
    if (!ok) return Response.json({ error: 'Symbol not found' }, { status: 404 });
    return Response.json({ data: { success: true } });
  } catch { return Response.json({ error: 'Failed to remove symbol' }, { status: 500 }); }
};
