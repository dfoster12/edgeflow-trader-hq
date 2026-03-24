// ============================================
// News Repository — Finnhub / NewsAPI Integration
// ============================================
// Provider priority: Finnhub → NewsAPI → Mock fallback
//
// Environment variables (set in Cloudflare Dashboard):
//   FINNHUB_API_KEY  — https://finnhub.io  (free tier available)
//   NEWS_API_KEY     — https://newsapi.org  (free tier available)
//
// To swap providers later, edit the fetch functions below.

import type { Env } from '../db';

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

// ---- Finnhub ----
// Docs: https://finnhub.io/docs/api/market-news
async function fetchFinnhub(apiKey: string, category = 'general'): Promise<NewsItem[]> {
  const url = `https://finnhub.io/api/v1/news?category=${category}&token=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Finnhub ${res.status}`);
  const items: any[] = await res.json();

  return items.slice(0, 15).map((item, i) => ({
    id: `fh-${item.id || i}`,
    title: item.headline ?? '',
    summary: item.summary ?? '',
    source: item.source ?? 'Finnhub',
    url: item.url ?? '',
    image: item.image || null,
    publishedAt: item.datetime ? new Date(item.datetime * 1000).toISOString() : new Date().toISOString(),
    sentiment: inferSentiment(item.headline + ' ' + (item.summary ?? '')),
    tags: deriveTags(item.headline + ' ' + (item.summary ?? '')),
    isHighImpact: isHighImpact(item.headline ?? ''),
  }));
}

// ---- NewsAPI ----
// Docs: https://newsapi.org/docs/endpoints/everything
async function fetchNewsApi(apiKey: string, query = 'nasdaq OR futures OR fed'): Promise<NewsItem[]> {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsAPI ${res.status}`);
  const body: any = await res.json();

  return (body.articles ?? []).slice(0, 15).map((a: any, i: number) => ({
    id: `na-${i}-${Date.now()}`,
    title: a.title ?? '',
    summary: a.description ?? '',
    source: a.source?.name ?? 'NewsAPI',
    url: a.url ?? '',
    image: a.urlToImage || null,
    publishedAt: a.publishedAt ?? new Date().toISOString(),
    sentiment: inferSentiment((a.title ?? '') + ' ' + (a.description ?? '')),
    tags: deriveTags((a.title ?? '') + ' ' + (a.description ?? '')),
    isHighImpact: isHighImpact(a.title ?? ''),
  }));
}

// ---- Simple keyword-based sentiment (placeholder for real NLP) ----
function inferSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const t = text.toLowerCase();
  const bull = ['rally', 'surge', 'gain', 'bull', 'record high', 'optimis', 'boost', 'breakout', 'upgrade'];
  const bear = ['crash', 'plunge', 'drop', 'bear', 'recession', 'sell-off', 'downgrade', 'risk', 'fear', 'decline'];
  const bs = bull.filter(w => t.includes(w)).length;
  const be = bear.filter(w => t.includes(w)).length;
  if (bs > be) return 'bullish';
  if (be > bs) return 'bearish';
  return 'neutral';
}

function deriveTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];
  if (/fed|fomc|powell|rate/.test(t)) tags.push('Macro');
  if (/nasdaq|nq|tech|apple|nvidia|microsoft/.test(t)) tags.push('Tech');
  if (/earning|eps|revenue|report/.test(t)) tags.push('Earnings');
  if (/oil|gold|commodity|crude/.test(t)) tags.push('Commodities');
  if (tags.length === 0) tags.push('General');
  return tags;
}

function isHighImpact(title: string): boolean {
  const t = title.toLowerCase();
  return /fomc|fed rate|cpi|nonfarm|gdp|emergency|crash|circuit breaker/.test(t);
}

// ---- Public API ----
export async function getNews(env: Env & { FINNHUB_API_KEY?: string; NEWS_API_KEY?: string }, keyword?: string): Promise<NewsItem[]> {
  // 1. Try Finnhub
  if (env.FINNHUB_API_KEY) {
    try {
      return await fetchFinnhub(env.FINNHUB_API_KEY);
    } catch (e) {
      console.error('Finnhub fetch failed, trying NewsAPI fallback:', e);
    }
  }

  // 2. Try NewsAPI
  if (env.NEWS_API_KEY) {
    try {
      return await fetchNewsApi(env.NEWS_API_KEY, keyword);
    } catch (e) {
      console.error('NewsAPI fetch failed, using mock data:', e);
    }
  }

  // 3. Mock fallback
  return getMockNews();
}

// ---- Mock Data ----
export function getMockNews(): NewsItem[] {
  return [
    {
      id: 'mock-1', title: 'Fed Holds Rates Steady, Signals Two Cuts Later This Year',
      summary: 'The Federal Reserve kept interest rates unchanged but signaled potential cuts in the second half of the year amid cooling inflation.',
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
      summary: 'Crude oil fell 2.3% as OPEC revised demand forecasts downward citing slowdowns in key economies.',
      source: 'CNBC', url: '#', image: null,
      publishedAt: new Date(Date.now() - 90 * 60000).toISOString(),
      sentiment: 'bearish', tags: ['Commodities'],
    },
    {
      id: 'mock-4', title: 'NVIDIA Reports Record Q4 Earnings, Beats Expectations',
      summary: 'NVIDIA posted revenue of $22.1B, beating analyst estimates by 12%, driven by data center GPU sales.',
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
      summary: 'Apple unveiled on-device AI capabilities that will ship with the upcoming iPhone 17 series this fall.',
      source: 'TechCrunch', url: '#', image: null,
      publishedAt: new Date(Date.now() - 240 * 60000).toISOString(),
      sentiment: 'neutral', tags: ['Tech'],
    },
    {
      id: 'mock-7', title: 'S&P 500 Hits All-Time High on Strong Jobs Data',
      summary: 'The S&P 500 closed at a record high after nonfarm payrolls exceeded expectations, easing recession fears.',
      source: 'Financial Times', url: '#', image: null,
      publishedAt: new Date(Date.now() - 300 * 60000).toISOString(),
      sentiment: 'bullish', tags: ['Macro'],
    },
    {
      id: 'mock-8', title: 'China Trade Tensions Weigh on Global Markets',
      summary: 'New tariff announcements from Washington sent emerging market indices lower amid escalating trade uncertainty.',
      source: 'Reuters', url: '#', image: null,
      publishedAt: new Date(Date.now() - 360 * 60000).toISOString(),
      sentiment: 'bearish', tags: ['Macro'],
    },
  ];
}
