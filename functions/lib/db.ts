// ============================================
// Database Access Layer
// ============================================
// Provides a unified interface to Cloudflare D1.
// All repository modules use this layer — never raw SQL in route handlers.
//
// Cloudflare Binding Required:
//   DB: D1Database  — bind in wrangler.toml or Cloudflare Dashboard
//
// When DB binding is missing, repositories fall back to mock data
// so the app still runs in local dev / preview without a database.

export interface Env {
  /** Cloudflare D1 database binding */
  DB?: D1Database;

  /** Market data provider API key (server-side only) */
  MARKET_DATA_API_KEY?: string;

  /** Market data provider name: 'polygon' | 'tradier' | 'alpaca' */
  MARKET_DATA_PROVIDER?: string;
}

/** Check whether a real database is available */
export function hasDatabase(env: Env): boolean {
  return !!env.DB;
}

/** Helper: run a parameterised SELECT and return all rows */
export async function queryAll<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const stmt = db.prepare(sql).bind(...params);
  const { results } = await stmt.all<T>();
  return results ?? [];
}

/** Helper: run a parameterised SELECT and return the first row or null */
export async function queryOne<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const stmt = db.prepare(sql).bind(...params);
  const row = await stmt.first<T>();
  return row ?? null;
}

/** Helper: run an INSERT / UPDATE / DELETE and return metadata */
export async function execute(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<D1Result> {
  const stmt = db.prepare(sql).bind(...params);
  return stmt.run();
}
