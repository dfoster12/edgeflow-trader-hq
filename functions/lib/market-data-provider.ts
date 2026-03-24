// ============================================
// Market Data Provider (Production-Ready, Provider-Agnostic)
// ============================================
// This is the SINGLE FILE you edit to connect a real market data provider.
//
// ┌─────────────────────────────────────────────────────────────┐
// │  HOW TO CONNECT A REAL PROVIDER                            │
// │                                                            │
// │  1. Set env vars in Cloudflare Dashboard:                  │
// │     MARKET_DATA_API_KEY = <your key>                       │
// │     MARKET_DATA_PROVIDER = 'polygon' | 'tradier' | etc.    │
// │                                                            │
// │  2. Implement the fetch logic in the TODO blocks below.    │
// │     Each method has a clearly marked section.              │
// │                                                            │
// │  3. The route handlers and frontend DO NOT change.         │
// │     All normalisation happens here.                        │
// └─────────────────────────────────────────────────────────────┘
//
// Supported response types align with the frontend's existing types:
//   Quote  → used by watchlist, dashboard, header market status
//   Candle → used by chart panels (OHLCV)

// ---- Provider Registry ----

const PROVIDER_URLS: Record<string, string> = {
  polygon: 'https://api.polygon.io',
  tradier: 'https://api.tradier.com',
  alpaca: 'https://data.alpaca.markets',
  // Add more providers here as needed
};

// ---- Normalised Types (match frontend expectations) ----

export interface Quote {
  symbol: string;
  price: number;
  change: number;   // Percentage change
  volume: string;   // Human-readable e.g. "1.2M"
}

export interface Candle {
  time: number;     // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ---- Mock Data (used when MARKET_DATA_API_KEY is not set) ----

const MOCK_QUOTES: Record<string, Quote> = {
  NQ:  { symbol: 'NQ',  price: 21485.50, change: 0.42,  volume: '1.2M' },
  ES:  { symbol: 'ES',  price: 5892.25,  change: 0.28,  volume: '845K' },
  YM:  { symbol: 'YM',  price: 43150.00, change: -0.15, volume: '320K' },
  RTY: { symbol: 'RTY', price: 2245.80,  change: 0.61,  volume: '210K' },
  CL:  { symbol: 'CL',  price: 78.42,    change: -0.33, volume: '560K' },
  GC:  { symbol: 'GC',  price: 2345.10,  change: 0.18,  volume: '180K' },
};

function generateMockCandles(symbol: string, count = 100): Candle[] {
  const base = MOCK_QUOTES[symbol.toUpperCase()]?.price ?? 100;
  const now = Math.floor(Date.now() / 1000);
  const candles: Candle[] = [];
  let price = base;

  for (let i = count; i > 0; i--) {
    const variance = base * 0.002;
    const open = price;
    const close = open + (Math.random() - 0.48) * variance;
    const high = Math.max(open, close) + Math.random() * variance * 0.5;
    const low = Math.min(open, close) - Math.random() * variance * 0.5;
    candles.push({
      time: now - i * 300, // 5-minute candles
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(Math.random() * 5000 + 500),
    });
    price = close;
  }
  return candles;
}

// ---- Provider Implementation ----

export const marketDataProvider = {
  /** Whether a real API key is configured */
  isConfigured(apiKey?: string): boolean {
    return !!apiKey;
  },

  /**
   * Fetch quotes for multiple symbols.
   * Returns normalised Quote[] regardless of provider.
   */
  async getQuotes(
    symbols: string[],
    apiKey?: string,
    provider = 'polygon',
  ): Promise<Quote[]> {
    if (!apiKey) {
      return symbols.map(s => MOCK_QUOTES[s.toUpperCase()] ?? {
        symbol: s.toUpperCase(), price: 0, change: 0, volume: '0',
      });
    }

    const baseUrl = PROVIDER_URLS[provider];
    if (!baseUrl) throw new Error(`Unknown market data provider: ${provider}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TODO: REPLACE THIS BLOCK with real provider fetch + normalisation
    //
    // Example — Polygon.io snapshot:
    //   const res = await fetch(
    //     `${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers?` +
    //     `tickers=${symbols.join(',')}&apiKey=${apiKey}`
    //   );
    //   const json = await res.json();
    //   if (!res.ok) throw new Error(json.error || 'Provider error');
    //   return json.tickers.map(t => ({
    //     symbol: t.ticker,
    //     price: t.lastTrade?.p ?? t.day?.c ?? 0,
    //     change: t.todaysChangePerc ?? 0,
    //     volume: formatVolume(t.day?.v ?? 0),
    //   }));
    //
    // Example — Tradier:
    //   const res = await fetch(
    //     `${baseUrl}/v1/markets/quotes?symbols=${symbols.join(',')}`,
    //     { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' } }
    //   );
    //   ...normalise response...
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Fallback while no provider is implemented
    return symbols.map(s => MOCK_QUOTES[s.toUpperCase()] ?? {
      symbol: s.toUpperCase(), price: 0, change: 0, volume: '0',
    });
  },

  /** Fetch a single quote */
  async getQuote(
    symbol: string,
    apiKey?: string,
    provider = 'polygon',
  ): Promise<Quote> {
    const quotes = await this.getQuotes([symbol], apiKey, provider);
    return quotes[0];
  },

  /**
   * Fetch OHLCV candle data for charting.
   * @param symbol  Ticker symbol
   * @param timeframe  e.g. '1m', '5m', '15m', '1h', '1d'
   * @param count  Number of candles to return
   */
  async getCandles(
    symbol: string,
    timeframe = '5m',
    count = 100,
    apiKey?: string,
    provider = 'polygon',
  ): Promise<Candle[]> {
    if (!apiKey) {
      return generateMockCandles(symbol, count);
    }

    const baseUrl = PROVIDER_URLS[provider];
    if (!baseUrl) throw new Error(`Unknown market data provider: ${provider}`);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TODO: REPLACE THIS BLOCK with real candle fetch + normalisation
    //
    // Example — Polygon.io aggregates:
    //   const multiplier = parseTimeframe(timeframe); // { size: 5, unit: 'minute' }
    //   const to = new Date().toISOString().slice(0, 10);
    //   const from = /* subtract appropriate range */;
    //   const res = await fetch(
    //     `${baseUrl}/v2/aggs/ticker/${symbol}/range/${multiplier.size}/${multiplier.unit}/${from}/${to}?` +
    //     `limit=${count}&sort=asc&apiKey=${apiKey}`
    //   );
    //   const json = await res.json();
    //   return json.results.map(r => ({
    //     time: Math.floor(r.t / 1000),
    //     open: r.o, high: r.h, low: r.l, close: r.c, volume: r.v,
    //   }));
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    return generateMockCandles(symbol, count);
  },
};
