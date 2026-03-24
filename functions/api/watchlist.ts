// ============================================
// Cloudflare Pages Function: /api/watchlist
// ============================================

import { type Env, hasDatabase, ok, err } from '../lib/db';
import { watchlistRepo } from '../lib/repositories/watchlist';
import { marketDataProvider } from '../lib/market-data-provider';

const getUserId = (_ctx: EventContext<Env, string, unknown>) => 'dev';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);

  // 1. Get saved symbols from D1 or mock
  let symbols: string[];
  if (hasDatabase(context.env)) {
    const rows = await watchlistRepo.list(context.env.DB!, userId);
    symbols = rows.map(r => r.symbol);
  } else {
    symbols = watchlistRepo.getMockList().map(r => r.symbol);
  }

  // 2. Enrich with live quotes via provider abstraction
  try {
    const quotes = await marketDataProvider.getQuotes(
      symbols,
      context.env.MARKET_DATA_API_KEY,
      context.env.MARKET_DATA_PROVIDER || 'polygon',
    );
    return ok(quotes, {
      mock: !hasDatabase(context.env),
      liveQuotes: marketDataProvider.isConfigured(context.env.MARKET_DATA_API_KEY),
    });
  } catch (e) {
    console.error('[/api/watchlist GET]', e);
    return err('Failed to fetch watchlist quotes');
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  let body: Record<string, unknown>;
  try { body = await context.request.json() as Record<string, unknown>; }
  catch { return err('Invalid JSON body', 400); }

  if (!body.symbol || typeof body.symbol !== 'string' || !body.symbol.trim()) {
    return err('symbol is required (non-empty string)', 400);
  }

  if (!hasDatabase(context.env)) {
    return ok({ symbol: (body.symbol as string).toUpperCase().trim() }, { mock: true }, 201);
  }

  try {
    const row = await watchlistRepo.add(context.env.DB!, userId, body.symbol as string);
    return ok(row, undefined, 201);
  } catch (e) {
    console.error('[/api/watchlist POST]', e);
    return err('Failed to add symbol to watchlist');
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const userId = getUserId(context);
  const url = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol');
  if (!symbol) return err('Missing symbol query parameter', 400);
  if (!hasDatabase(context.env)) return ok({ success: true }, { mock: true });

  try {
    const success = await watchlistRepo.remove(context.env.DB!, userId, symbol);
    if (!success) return err('Symbol not found in watchlist', 404);
    return ok({ success: true });
  } catch (e) {
    console.error('[/api/watchlist DELETE]', e);
    return err('Failed to remove symbol from watchlist');
  }
};
