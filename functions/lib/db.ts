// ============================================
// Database Access Layer (Production-Ready)
// ============================================
// All repository modules use this layer — never raw SQL in route handlers.
//
// ┌─────────────────────────────────────────────────────────────┐
// │  CLOUDFLARE SETUP                                          │
// │                                                            │
// │  1. Create a D1 database:                                  │
// │     wrangler d1 create edgeflow-db                         │
// │                                                            │
// │  2. Add binding to wrangler.toml:                          │
// │     [[d1_databases]]                                       │
// │     binding = "DB"                                         │
// │     database_name = "edgeflow-db"                          │
// │     database_id = "<your-database-id>"                     │
// │                                                            │
// │  3. Run migration:                                         │
// │     wrangler d1 execute edgeflow-db \                      │
// │       --file=./migrations/0001_initial_schema.sql          │
// │                                                            │
// │  4. For production, add --remote flag:                     │
// │     wrangler d1 execute edgeflow-db --remote \             │
// │       --file=./migrations/0001_initial_schema.sql          │
// └─────────────────────────────────────────────────────────────┘
//
// When the DB binding is absent (local dev without wrangler, Lovable preview),
// all repositories automatically fall back to mock data.

export interface Env {
  /** Cloudflare D1 database binding — set in wrangler.toml [[d1_databases]] */
  DB?: D1Database;

  /** Market data provider API key — set in Cloudflare Dashboard > Pages > Settings > Environment Variables */
  MARKET_DATA_API_KEY?: string;

  /** Market data provider: 'polygon' | 'tradier' | 'alpaca' — defaults to 'polygon' */
  MARKET_DATA_PROVIDER?: string;
}

/** Check whether a real D1 database is bound */
export function hasDatabase(env: Env): boolean {
  return !!env.DB;
}

/**
 * Standardised API response envelope.
 * All route handlers should return this shape for frontend compatibility.
 */
export interface ApiEnvelope<T = unknown> {
  data?: T | null;
  error?: string;
  meta?: Record<string, unknown>;
}

/** Build a success response */
export function ok<T>(data: T, meta?: Record<string, unknown>, status = 200): Response {
  const body: ApiEnvelope<T> = { data };
  if (meta) body.meta = meta;
  return Response.json(body, { status });
}

/** Build an error response */
export function err(message: string, status = 500): Response {
  return Response.json({ error: message } as ApiEnvelope, { status });
}

// ---- D1 Query Helpers ----

/** Run a parameterised SELECT → all rows */
export async function queryAll<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    const { results } = await stmt.all<T>();
    return results ?? [];
  } catch (e) {
    console.error('[D1 queryAll]', sql, e);
    throw e;
  }
}

/** Run a parameterised SELECT → first row or null */
export async function queryOne<T = Record<string, unknown>>(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    const row = await stmt.first<T>();
    return row ?? null;
  } catch (e) {
    console.error('[D1 queryOne]', sql, e);
    throw e;
  }
}

/** Run an INSERT / UPDATE / DELETE → D1Result metadata */
export async function execute(
  db: D1Database,
  sql: string,
  params: unknown[] = [],
): Promise<D1Result> {
  try {
    const stmt = db.prepare(sql).bind(...params);
    return await stmt.run();
  } catch (e) {
    console.error('[D1 execute]', sql, e);
    throw e;
  }
}
