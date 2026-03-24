// ============================================
// Market Data Service (Provider-Agnostic)
// ============================================
// This service abstracts market data access. The frontend calls this service,
// which routes through the server-side API layer. The server-side function
// handles the actual external API call with secret keys.
//
// To swap market data providers:
//   1. Update the Cloudflare Pages Function at functions/api/market-data.ts
//   2. The provider config and API key live server-side only
//   3. This client-side service does NOT change
//
// Supported future providers: Polygon.io, Tradier, CQG, Rithmic, etc.

import { apiClient } from './api-client';
import env from '@/config/env';
import { watchlist as mockWatchlist, chartData as mockChartData } from '@/data/mockData';
import type { MarketQuote, CandleData, ApiResponse } from '@/types';

export const marketDataService = {
  async getWatchlist(): Promise<ApiResponse<MarketQuote[]>> {
    if (env.useMockData) {
      return { data: mockWatchlist as MarketQuote[] };
    }
    return apiClient.get<MarketQuote[]>('/market-data/watchlist');
  },

  async getQuote(symbol: string): Promise<ApiResponse<MarketQuote>> {
    if (env.useMockData) {
      const item = mockWatchlist.find(w => w.symbol === symbol);
      if (!item) throw new Error(`Symbol ${symbol} not found`);
      return { data: item as MarketQuote };
    }
    return apiClient.get<MarketQuote>(`/market-data/quote/${symbol}`);
  },

  async getCandles(symbol: string, timeframe = '5m'): Promise<ApiResponse<CandleData[]>> {
    if (env.useMockData) {
      return { data: mockChartData as CandleData[] };
    }
    return apiClient.get<CandleData[]>(`/market-data/candles/${symbol}?tf=${timeframe}`);
  },
};
