// ============================================
// Cloudflare Pages Function: /api/market-data
// ============================================
// This function proxies market data requests to the external provider.
// The API key is stored as a Cloudflare environment variable and
// NEVER exposed to the client.
//
// To configure:
//   1. Set MARKET_DATA_API_KEY in Cloudflare Dashboard > Pages > Settings > Environment Variables
//   2. Set MARKET_DATA_PROVIDER (e.g., 'polygon', 'tradier', 'alpaca')
//   3. Update the provider-specific logic below
//
// Provider swap: Change MARKET_DATA_PROVIDER env var and update the
// fetch URL/headers in this file. The client-side code does not change.

interface Env {
  MARKET_DATA_API_KEY: string;
  MARKET_DATA_PROVIDER: string; // 'polygon' | 'tradier' | 'alpaca' | etc.
}

// Provider base URLs — add more as needed
const PROVIDER_URLS: Record<string, string> = {
  polygon: 'https://api.polygon.io',
  tradier: 'https://api.tradier.com',
  alpaca: 'https://data.alpaca.markets',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.MARKET_DATA_API_KEY;
  const provider = context.env.MARKET_DATA_PROVIDER || 'polygon';

  if (!apiKey) {
    // Return a clear error so the developer knows to set the env var
    return Response.json(
      { data: null, error: 'MARKET_DATA_API_KEY is not configured. Set it in Cloudflare Pages environment variables.' },
      { status: 503 }
    );
  }

  const url = new URL(context.request.url);
  const path = url.pathname.replace('/api/market-data', '');

  try {
    // TODO: Map the incoming path to the provider's API format
    // Example for Polygon: GET /v2/aggs/ticker/{symbol}/range/1/minute/...
    const baseUrl = PROVIDER_URLS[provider];
    if (!baseUrl) {
      return Response.json({ data: null, error: `Unknown provider: ${provider}` }, { status: 400 });
    }

    // Placeholder: proxy the request to the provider
    // const providerResponse = await fetch(`${baseUrl}${path}?apiKey=${apiKey}`);
    // const data = await providerResponse.json();
    // return Response.json({ data });

    return Response.json({
      data: null,
      error: 'Market data provider not yet integrated. Mock data is being used on the client.',
    }, { status: 503 });
  } catch (error) {
    return Response.json({ data: null, error: 'Failed to fetch market data' }, { status: 500 });
  }
};
