// ============================================
// Cloudflare Pages Function: /api/market-data
// ============================================
// Proxies market data requests through the provider abstraction.
// The API key never reaches the client.
//
// Environment variables (set in Cloudflare Dashboard):
//   MARKET_DATA_API_KEY    — provider API key
//   MARKET_DATA_PROVIDER   — 'polygon' | 'tradier' | 'alpaca'

import type { Env } from '../lib/db';
import { marketDataProvider } from '../lib/market-data-provider';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.MARKET_DATA_API_KEY;
  const provider = context.env.MARKET_DATA_PROVIDER || 'polygon';

  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/market-data', '');

  // Route: /api/market-data/quote/NQ
  const quoteMatch = path.match(/^\/quote\/(.+)$/);
  if (quoteMatch) {
    const quote = await marketDataProvider.getQuote(quoteMatch[1], apiKey, provider);
    return Response.json({ data: quote, meta: { mock: !apiKey } });
  }

  // Route: /api/market-data/quotes?symbols=NQ,ES
  if (path === '/quotes' || path === '') {
    const symbols = (url.searchParams.get('symbols') || '').split(',').filter(Boolean);
    if (symbols.length === 0) {
      return Response.json({ error: 'Missing symbols query parameter' }, { status: 400 });
    }
    const quotes = await marketDataProvider.getQuotes(symbols, apiKey, provider);
    return Response.json({ data: quotes, meta: { mock: !apiKey } });
  }

  return Response.json({ error: `Unknown market-data route: ${path}` }, { status: 404 });
};
