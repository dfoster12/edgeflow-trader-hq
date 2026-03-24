import { apiClient } from './api-client';
import env from '@/config/env';
import { watchlist as mockWatchlist, chartData as mockChartData } from '@/data/mockData';
import type { MarketQuote, CandleData, ApiResponse } from '@/types';

export const marketDataService = {
  async getWatchlist(): Promise<ApiResponse<MarketQuote[]>> {
    if (env.useMockData) return { data: mockWatchlist as MarketQuote[] };
    try {
      return await apiClient.get<MarketQuote[]>('/market-data/watchlist');
    } catch {
      console.warn('Watchlist API unavailable, using mock data');
      return { data: mockWatchlist as MarketQuote[] };
    }
  },

  async getQuote(symbol: string): Promise<ApiResponse<MarketQuote>> {
    if (env.useMockData) {
      const item = mockWatchlist.find(w => w.symbol === symbol);
      if (!item) throw new Error(`Symbol ${symbol} not found`);
      return { data: item as MarketQuote };
    }
    try {
      return await apiClient.get<MarketQuote>(`/market-data/quote/${symbol}`);
    } catch {
      const item = mockWatchlist.find(w => w.symbol === symbol);
      if (!item) throw new Error(`Symbol ${symbol} not found`);
      return { data: item as MarketQuote };
    }
  },

  async getCandles(symbol: string, timeframe = '5m'): Promise<ApiResponse<CandleData[]>> {
    if (env.useMockData) return { data: mockChartData as CandleData[] };
    try {
      return await apiClient.get<CandleData[]>(`/market-data/candles/${symbol}?tf=${timeframe}`);
    } catch {
      console.warn('Candles API unavailable, using mock data');
      return { data: mockChartData as CandleData[] };
    }
  },
};
