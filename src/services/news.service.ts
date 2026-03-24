// ============================================
// News Service — Client-side
// ============================================

import { apiClient } from './api-client';
import env from '@/config/env';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image: string | null;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral' | null;
  tags: string[];
  isHighImpact?: boolean;
}

// Mock data for development when API is unavailable
const mockNews: NewsItem[] = [
  {
    id: 'mock-1', title: 'Fed Holds Rates Steady, Signals Two Cuts Later This Year',
    summary: 'The Federal Reserve kept interest rates unchanged but signaled potential cuts in the second half of the year.',
    source: 'Reuters', url: '#', image: null,
    publishedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    sentiment: 'bullish', tags: ['Macro'], isHighImpact: true,
  },
  {
    id: 'mock-2', title: 'Nasdaq Futures Rally on AI Chip Demand Surge',
    summary: 'NQ futures surged 1.2% in pre-market trading as semiconductor companies reported record AI chip orders.',
    source: 'Bloomberg', url: '#', image: null,
    publishedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    sentiment: 'bullish', tags: ['Tech'],
  },
  {
    id: 'mock-3', title: 'Oil Prices Drop Amid Global Demand Concerns',
    summary: 'Crude oil fell 2.3% as OPEC revised demand forecasts downward.',
    source: 'CNBC', url: '#', image: null,
    publishedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    sentiment: 'bearish', tags: ['Commodities'],
  },
  {
    id: 'mock-4', title: 'NVIDIA Reports Record Q4 Earnings, Beats Expectations',
    summary: 'NVIDIA posted revenue of $22.1B, beating analyst estimates by 12%.',
    source: 'MarketWatch', url: '#', image: null,
    publishedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    sentiment: 'bullish', tags: ['Tech', 'Earnings'],
  },
  {
    id: 'mock-5', title: 'Treasury Yields Rise as Inflation Data Comes in Hot',
    summary: 'The 10-year yield climbed to 4.35% after CPI data showed inflation ticking higher than expected.',
    source: 'WSJ', url: '#', image: null,
    publishedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    sentiment: 'bearish', tags: ['Macro'], isHighImpact: true,
  },
  {
    id: 'mock-6', title: 'Apple Announces New AI Features for iPhone 17 Lineup',
    summary: 'Apple unveiled on-device AI capabilities that will ship with the upcoming iPhone 17 series.',
    source: 'TechCrunch', url: '#', image: null,
    publishedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    sentiment: 'neutral', tags: ['Tech'],
  },
  {
    id: 'mock-7', title: 'S&P 500 Hits All-Time High on Strong Jobs Data',
    summary: 'The S&P 500 closed at a record high after nonfarm payrolls exceeded expectations.',
    source: 'Financial Times', url: '#', image: null,
    publishedAt: new Date(Date.now() - 300 * 60000).toISOString(),
    sentiment: 'bullish', tags: ['Macro'],
  },
  {
    id: 'mock-8', title: 'China Trade Tensions Weigh on Global Markets',
    summary: 'New tariff announcements sent emerging market indices lower amid escalating trade uncertainty.',
    source: 'Reuters', url: '#', image: null,
    publishedAt: new Date(Date.now() - 360 * 60000).toISOString(),
    sentiment: 'bearish', tags: ['Macro'],
  },
];

export const newsService = {
  async getNews(keyword?: string): Promise<NewsItem[]> {
    if (env.useMockData) return mockNews;
    try {
      const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
      const res = await apiClient.get<NewsItem[]>(`/news${params}`);
      return res.data ?? mockNews;
    } catch {
      return mockNews;
    }
  },
};
