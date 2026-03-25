// ============================================
// Environment Configuration
// ============================================
// For Cloudflare Pages deployment:
//   - Set environment variables in Cloudflare Dashboard > Pages > Settings > Environment Variables
//   - Variables prefixed with VITE_ are available in client-side code
//   - Secret API keys should NEVER be prefixed with VITE_ — keep them server-side only
//
// For local development:
//   - Create a .env.local file (gitignored) with your variables
//
// Server-side secrets (Cloudflare Pages Functions / Workers):
//   - MARKET_DATA_API_KEY: Your market data provider API key
//   - DATABASE_URL: Database connection string (D1, Turso, Neon, etc.)
//   - AI_API_KEY: AI provider key for the assistant feature
//   - These are accessed via context.env in Cloudflare Functions

const env = {
  /** Base URL for API calls. In production, this is the same origin (Cloudflare Pages Functions). */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',

  /** Base URL for the NQ trading bot API (e.g. http://192.168.1.141:8080) */
  botApiUrl: import.meta.env.VITE_BOT_API_URL || '',

  /** Whether to use mock data instead of real API calls */
  useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false',

  /** App environment */
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,

  /** Public-safe app config */
  appName: 'EdgeFlow',
  appVersion: '1.0.0',
} as const;

export default env;
