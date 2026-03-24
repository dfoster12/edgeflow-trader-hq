// ============================================
// Market Data Provider (Server-Side, Provider-Agnostic)
// ============================================
// To swap providers: update the fetch logic in each method below.
// The route handlers and frontend never change.
//
// Environment variables needed:
//   MARKET_DATA_API_KEY    — your provider's API key
//   MARKET_DATA_PROVIDER   — 'polygon' | 'tradier' | 'alpaca' | etc.

const PROVIDER_URLS: Record<string, string> = {
  polygon: 'https://api.polygon.io',
  tradier: 'https://api.tradier.com',
  alpaca: 'https://data.alpaca.markets',
};

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

// ---- Mock quotes (returned when no API key is set) ----
const MOCK_QUOTES: Record<string, Quote> = {
  NQ: { symbol: 'NQ', price: 21485.50, change: 0.42, volume: '1.2M' },
  ES: { symbol: 'ES', price: 5892.25, change: 0.28, volume: '845K' },
  YM: { symbol: 'YM', price: 43150.00, change: -0.15, volume: '320K' },
  RTY: { symbol: 'RTY', price: 2245.80, change: 0.61, volume: '210K' },
  CL: { symbol: 'CL', price: 78.42, change: -0.33, volume: '560K' },
  GC: { symbol: 'GC', price: 2345.10, change: 0.18, volume: '180K' },
};

export const marketDataProvider = {
  /** Check if a real provider is configured */
  isConfigured(apiKey?: string): boolean {
    return !!apiKey;
  },

  /** Get quotes for a list of symbols */
  async getQuotes(symbols: string[], apiKey?: string, provider = 'polygon'): Promise<Quote[]> {
    if (!apiKey) {
      // Return mock data when no provider credentials are set
      return symbols.map(s => MOCK_QUOTES[s.toUpperCase()] ?? {
        symbol: s.toUpperCase(), price: 0, change: 0, volume: '0',
      });
    }

    const baseUrl = PROVIDER_URLS[provider];
    if (!baseUrl) throw new Error(`Unknown market data provider: ${provider}`);

    // ---------------------------------------------------------------
    // TODO: Implement real provider fetch here.
    // Example for Polygon.io:
    //   const res = await fetch(`${baseUrl}/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols.join(',')}&apiKey=${apiKey}`);
    //   const json = await res.json();
    //   return json.tickers.map(t => ({ symbol: t.ticker, price: t.lastTrade.p, ... }));
    // ---------------------------------------------------------------

    // Placeholder — swap this block with the real provider call
    return symbols.map(s => MOCK_QUOTES[s.toUpperCase()] ?? {
      symbol: s.toUpperCase(), price: 0, change: 0, volume: '0',
    });
  },

  /** Get a single quote */
  async getQuote(symbol: string, apiKey?: string, provider = 'polygon'): Promise<Quote> {
    const quotes = await this.getQuotes([symbol], apiKey, provider);
    return quotes[0];
  },
};
