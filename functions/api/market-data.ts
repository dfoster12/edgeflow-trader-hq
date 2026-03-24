// ============================================
// Cloudflare Pages Function: /api/market-data
// ============================================
// Proxies all market data through the provider abstraction.
// The MARKET_DATA_API_KEY never reaches the client.
//
// Routes:
//   GET /api/market-data/quote/:symbol    → single quote
//   GET /api/market-data/quotes?symbols=  → multiple quotes
//   GET /api/market-data/candles/:symbol?tf=5m&count=100 → OHLCV candles

import { type Env, ok, err } from '../lib/db';
import { marketDataProvider } from '../lib/market-data-provider';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.MARKET_DATA_API_KEY;
  const provider = context.env.MARKET_DATA_PROVIDER || 'polygon';
  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/market-data', '');

  try {
    // ---- Single quote: /api/market-data/quote/NQ ----
    const quoteMatch = path.match(/^\/quote\/([A-Za-z0-9]+)$/);
    if (quoteMatch) {
      const quote = await marketDataProvider.getQuote(quoteMatch[1], apiKey, provider);
      return ok(quote, { liveData: !!apiKey });
    }

    // ---- Multiple quotes: /api/market-data/quotes?symbols=NQ,ES ----
    if (path === '/quotes' || path === '') {
      const raw = url.searchParams.get('symbols');
      if (!raw) return err('Missing "symbols" query parameter (comma-separated)', 400);
      const symbols = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (symbols.length === 0) return err('No valid symbols provided', 400);
      const quotes = await marketDataProvider.getQuotes(symbols, apiKey, provider);
      return ok(quotes, { liveData: !!apiKey });
    }

    // ---- Candles: /api/market-data/candles/NQ?tf=5m&count=100 ----
    const candleMatch = path.match(/^\/candles\/([A-Za-z0-9]+)$/);
    if (candleMatch) {
      const tf = url.searchParams.get('tf') || '5m';
      const count = Math.min(parseInt(url.searchParams.get('count') || '100', 10), 500);
      const candles = await marketDataProvider.getCandles(candleMatch[1], tf, count, apiKey, provider);
      return ok(candles, { liveData: !!apiKey });
    }

    return err(`Unknown market-data route: ${path}`, 404);
  } catch (e) {
    console.error('[/api/market-data]', e);
    return err('Failed to fetch market data');
  }
};
