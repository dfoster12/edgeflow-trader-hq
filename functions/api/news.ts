// ============================================
// /api/news — Market News Endpoint
// ============================================
// Fetches financial news from Finnhub (primary) or NewsAPI (fallback).
// Falls back to mock data when no API keys are configured.
//
// Cloudflare environment variables needed:
//   FINNHUB_API_KEY  — Finnhub API key
//   NEWS_API_KEY     — NewsAPI key
//
// Query params:
//   ?keyword=... — optional search filter (default: nasdaq OR NQ OR futures OR fed)

import { ok, err } from '../lib/db';
import { getNews } from '../lib/repositories/news';

interface NewsEnv {
  FINNHUB_API_KEY?: string;
  NEWS_API_KEY?: string;
}

export const onRequestGet: PagesFunction<NewsEnv> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const keyword = url.searchParams.get('keyword') || undefined;

    const news = await getNews(context.env, keyword);
    return ok(news, { count: news.length });
  } catch (e: any) {
    console.error('News endpoint error:', e);
    return err(e.message || 'Failed to fetch news', 500);
  }
};
