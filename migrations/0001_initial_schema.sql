-- ============================================
-- EdgeFlow D1 Migration: 0001_initial_schema.sql
-- ============================================
-- Apply with:
--   wrangler d1 execute edgeflow-db --file=./migrations/0001_initial_schema.sql
--
-- Or via Cloudflare Dashboard: D1 > edgeflow-db > Console > paste & run

-- ---- Trades ----
CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  symbol TEXT NOT NULL,
  setup TEXT NOT NULL DEFAULT '',
  side TEXT NOT NULL CHECK (side IN ('Long', 'Short')),
  entry REAL NOT NULL,
  exit_price REAL NOT NULL,
  size INTEGER NOT NULL DEFAULT 1,
  pnl REAL NOT NULL DEFAULT 0,
  r_multiple REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Closed' CHECK (status IN ('Open', 'Closed', 'Cancelled')),
  session TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  stop_loss REAL,
  target REAL,
  tags TEXT DEFAULT '[]',
  screenshot_urls TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_user_date ON trades(user_id, date);

-- ---- Journal Entries ----
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  emotional_state TEXT DEFAULT '',
  premarket_plan TEXT DEFAULT '',
  postmarket_review TEXT DEFAULT '',
  market_notes TEXT DEFAULT '',
  lessons TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  trades_count INTEGER DEFAULT 0,
  pnl REAL DEFAULT 0,
  screenshot_urls TEXT DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON journal_entries(user_id, date);

-- ---- Risk Settings ----
CREATE TABLE IF NOT EXISTS risk_settings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE,
  max_daily_loss REAL NOT NULL DEFAULT 2000,
  max_weekly_loss REAL NOT NULL DEFAULT 5000,
  max_trades_per_day INTEGER NOT NULL DEFAULT 5,
  risk_per_trade REAL NOT NULL DEFAULT 1.5,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---- User Preferences ----
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE,
  default_market TEXT DEFAULT 'NQ',
  default_position_size INTEGER DEFAULT 2,
  auto_journal INTEGER DEFAULT 1,
  session_alerts INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'dark',
  chart_color_scheme TEXT DEFAULT 'Blue / Teal',
  compact_mode INTEGER DEFAULT 0,
  primary_session TEXT DEFAULT 'New York AM',
  show_pre_market INTEGER DEFAULT 1,
  news_filter INTEGER DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ---- Watchlist ----
CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, symbol)
);

-- ---- Daily Stats (aggregated cache) ----
CREATE TABLE IF NOT EXISTS daily_stats (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  total_trades INTEGER DEFAULT 0,
  total_pnl REAL DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  loss_count INTEGER DEFAULT 0,
  largest_win REAL DEFAULT 0,
  largest_loss REAL DEFAULT 0,
  discipline_score INTEGER DEFAULT 100,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date);
