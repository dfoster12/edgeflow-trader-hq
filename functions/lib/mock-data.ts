// ============================================
// Server-Side Mock Data (fallback when DB is not bound)
// ============================================

export const mockTrades = [
  {
    id: 'mock-t1', user_id: 'dev', date: '2025-03-20 09:32', symbol: 'NQ', setup: 'Break & Retest',
    side: 'Long', entry: 21450.25, exit_price: 21498.75, size: 2, pnl: 97.0, r_multiple: 2.1,
    status: 'Closed', session: 'NY AM', notes: 'Clean break of supply zone', stop_loss: 21427.0,
    target: 21510.0, tags: '["momentum"]', screenshot_urls: '[]',
    created_at: '2025-03-20T14:32:00Z', updated_at: '2025-03-20T14:32:00Z',
  },
  {
    id: 'mock-t2', user_id: 'dev', date: '2025-03-20 10:15', symbol: 'NQ', setup: 'Order Block',
    side: 'Short', entry: 21510.0, exit_price: 21475.5, size: 1, pnl: 34.5, r_multiple: 1.3,
    status: 'Closed', session: 'NY AM', notes: 'Rejected at previous high', stop_loss: 21530.0,
    target: 21460.0, tags: '["reversal"]', screenshot_urls: '[]',
    created_at: '2025-03-20T15:15:00Z', updated_at: '2025-03-20T15:15:00Z',
  },
];

export const mockJournalEntries = [
  {
    id: 'mock-j1', user_id: 'dev', date: '2025-03-20',
    emotional_state: 'Focused', premarket_plan: 'Wait for NY open, look for NQ break & retest setups.',
    postmarket_review: 'Executed plan well. Two clean trades.', market_notes: 'NQ trending up into key supply.',
    lessons: 'Patience at open paid off.', tags: '["discipline"]', trades_count: 2, pnl: 131.5,
    screenshot_urls: '[]', created_at: '2025-03-20T06:00:00Z', updated_at: '2025-03-20T20:00:00Z',
  },
];

export const mockRiskSettings = {
  id: 'mock-r1', user_id: 'dev', max_daily_loss: 2000, max_weekly_loss: 5000,
  max_trades_per_day: 5, risk_per_trade: 1.5, updated_at: '2025-03-20T00:00:00Z',
};

export const mockWatchlist = [
  { id: 'mock-w1', user_id: 'dev', symbol: 'NQ', created_at: '2025-03-18T00:00:00Z' },
  { id: 'mock-w2', user_id: 'dev', symbol: 'ES', created_at: '2025-03-18T00:00:00Z' },
  { id: 'mock-w3', user_id: 'dev', symbol: 'YM', created_at: '2025-03-18T00:00:00Z' },
];
