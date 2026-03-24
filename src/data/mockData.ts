export const kpiData = {
  dailyPnL: 1847.50,
  weeklyPnL: 5234.00,
  winRate: 68.4,
  accountBalance: 127450.00,
  riskUsedToday: 1.8,
  openPositions: 2,
};

export const recentTrades = [
  { id: '1', date: '2026-03-24 09:32', symbol: 'NQ', setup: 'Breakout', side: 'Long' as const, entry: 21456.25, exit: 21502.50, size: 2, pnl: 1850.00, rMultiple: 2.4, status: 'Closed' as const, session: 'NY AM', notes: 'Clean breakout above resistance. Followed plan perfectly.' },
  { id: '2', date: '2026-03-24 10:15', symbol: 'NQ', setup: 'Pullback', side: 'Long' as const, entry: 21478.00, exit: 21465.25, size: 1, pnl: -255.00, rMultiple: -0.6, status: 'Closed' as const, session: 'NY AM', notes: 'Entered too early on pullback. Should have waited for confirmation.' },
  { id: '3', date: '2026-03-23 14:22', symbol: 'ES', setup: 'Reversal', side: 'Short' as const, entry: 5845.50, exit: 5832.00, size: 2, pnl: 675.00, rMultiple: 1.8, status: 'Closed' as const, session: 'NY PM', notes: 'Great reversal at daily level.' },
  { id: '4', date: '2026-03-23 09:45', symbol: 'NQ', setup: 'Range Break', side: 'Long' as const, entry: 21389.00, exit: 21425.75, size: 3, pnl: 2201.25, rMultiple: 3.1, status: 'Closed' as const, session: 'NY AM', notes: 'Strong volume on break. Best trade of the week.' },
  { id: '5', date: '2026-03-22 11:30', symbol: 'NQ', setup: 'VWAP Bounce', side: 'Long' as const, entry: 21312.50, exit: 21345.00, size: 2, pnl: 1300.00, rMultiple: 2.0, status: 'Closed' as const, session: 'NY AM', notes: 'Textbook VWAP bounce setup.' },
  { id: '6', date: '2026-03-22 13:05', symbol: 'NQ', setup: 'Breakdown', side: 'Short' as const, entry: 21290.00, exit: 21305.50, size: 1, pnl: -310.00, rMultiple: -0.8, status: 'Closed' as const, session: 'NY PM', notes: 'Chased the move. FOMO entry.' },
  { id: '7', date: '2026-03-21 09:50', symbol: 'ES', setup: 'Gap Fill', side: 'Long' as const, entry: 5798.25, exit: 5812.00, size: 2, pnl: 687.50, rMultiple: 1.5, status: 'Closed' as const, session: 'NY AM', notes: 'Gap fill play worked well.' },
  { id: '8', date: '2026-03-21 10:40', symbol: 'NQ', setup: 'Pullback', side: 'Long' as const, entry: 21245.00, exit: 21278.50, size: 2, pnl: 1340.00, rMultiple: 2.2, status: 'Closed' as const, session: 'NY AM', notes: 'Patience paid off on this pullback entry.' },
];

export const openPositions = [
  { symbol: 'NQ', side: 'Long' as const, entry: 21485.00, current: 21512.75, stop: 21460.00, target: 21550.00, unrealizedPnL: 555.00, size: 1 },
  { symbol: 'ES', side: 'Short' as const, entry: 5852.00, current: 5848.50, stop: 5862.00, target: 5830.00, unrealizedPnL: 175.00, size: 1 },
];

export const watchlist = [
  { symbol: 'NQ', price: 21512.75, change: 0.82, volume: '1.2M' },
  { symbol: 'ES', price: 5848.50, change: 0.34, volume: '890K' },
  { symbol: 'YM', price: 42156.00, change: -0.12, volume: '320K' },
  { symbol: 'RTY', price: 2189.40, change: 1.24, volume: '445K' },
  { symbol: 'CL', price: 78.45, change: -0.56, volume: '670K' },
  { symbol: 'GC', price: 2945.80, change: 0.18, volume: '280K' },
];

export const journalEntries = [
  {
    id: '1',
    date: '2026-03-24',
    emotionalState: 'Focused',
    premarketPlan: 'Looking for NQ breakout above 21450 level. Key support at 21380. Will focus on NY AM session only. Max 3 trades today.',
    postmarketReview: 'Solid day overall. Hit my target on the breakout trade. Small loss on the pullback was acceptable - just entered slightly early.',
    marketNotes: 'Strong bullish bias. Tech leading. Volume above average. FOMC minutes released - hawkish tone but market shrugged it off.',
    lessons: 'Need to wait for candle close confirmation on pullback entries. The early entry cost me a full R.',
    tags: ['followed plan', 'good patience', 'strong execution'],
    trades: 2,
    pnl: 1595.00,
  },
  {
    id: '2',
    date: '2026-03-23',
    emotionalState: 'Confident',
    premarketPlan: 'Range day expected. Looking for range break setups. ES reversal possible at 5850 level.',
    postmarketReview: 'Excellent day. Both trades hit targets. The range break on NQ was the highlight - 3.1R winner. ES reversal also clean.',
    marketNotes: 'Choppy morning, then strong trend in PM session. Good volume on the break.',
    lessons: 'When the range is clear, size up on the break. Conviction paid off today.',
    tags: ['followed plan', 'strong execution'],
    trades: 2,
    pnl: 2876.25,
  },
  {
    id: '3',
    date: '2026-03-22',
    emotionalState: 'Mixed',
    premarketPlan: 'VWAP bounce setups in focus. Will avoid PM session if morning goes well.',
    postmarketReview: 'Good VWAP bounce trade in AM. Then made an emotional trade in PM - FOMO on the breakdown. Should have stopped after the first trade.',
    marketNotes: 'Trend day that faded in the afternoon. Classic overextension pattern.',
    lessons: 'Stick to the plan about stopping after AM session. The PM FOMO trade was unnecessary and costly.',
    tags: ['FOMO', 'overtrading'],
    trades: 2,
    pnl: 990.00,
  },
];

export const analyticsData = {
  equityCurve: [
    { date: 'Mar 1', value: 120000 },
    { date: 'Mar 3', value: 120850 },
    { date: 'Mar 5', value: 121200 },
    { date: 'Mar 7', value: 120600 },
    { date: 'Mar 10', value: 121900 },
    { date: 'Mar 12', value: 123100 },
    { date: 'Mar 14', value: 122400 },
    { date: 'Mar 17', value: 124200 },
    { date: 'Mar 19', value: 125100 },
    { date: 'Mar 21', value: 126050 },
    { date: 'Mar 23', value: 125600 },
    { date: 'Mar 24', value: 127450 },
  ],
  weekdayPerformance: [
    { day: 'Mon', pnl: 2340, trades: 12 },
    { day: 'Tue', pnl: 1890, trades: 10 },
    { day: 'Wed', pnl: -450, trades: 8 },
    { day: 'Thu', pnl: 3200, trades: 14 },
    { day: 'Fri', pnl: 870, trades: 6 },
  ],
  setupPerformance: [
    { setup: 'Breakout', winRate: 74, avgR: 2.1, trades: 18 },
    { setup: 'Pullback', winRate: 62, avgR: 1.4, trades: 15 },
    { setup: 'Reversal', winRate: 58, avgR: 1.8, trades: 10 },
    { setup: 'VWAP Bounce', winRate: 71, avgR: 1.9, trades: 12 },
    { setup: 'Range Break', winRate: 67, avgR: 2.5, trades: 8 },
    { setup: 'Gap Fill', winRate: 65, avgR: 1.3, trades: 7 },
  ],
  timePerformance: [
    { hour: '9:30', pnl: 4200 },
    { hour: '10:00', pnl: 2800 },
    { hour: '10:30', pnl: 1200 },
    { hour: '11:00', pnl: -300 },
    { hour: '11:30', pnl: 400 },
    { hour: '12:00', pnl: -600 },
    { hour: '13:00', pnl: 800 },
    { hour: '14:00', pnl: 1500 },
    { hour: '15:00', pnl: 900 },
  ],
  dailyHeatmap: [
    { date: 'Mar 17', pnl: 2100 }, { date: 'Mar 18', pnl: -450 }, { date: 'Mar 19', pnl: 890 },
    { date: 'Mar 20', pnl: 1650 }, { date: 'Mar 21', pnl: 2027 }, { date: 'Mar 22', pnl: 990 },
    { date: 'Mar 23', pnl: 2876 }, { date: 'Mar 24', pnl: 1595 },
  ],
  stats: {
    totalTrades: 70,
    totalProfit: 7450,
    avgWinner: 1245,
    avgLoser: -380,
    largestWin: 3200,
    largestLoss: -890,
    avgRMultiple: 1.6,
    expectancy: 106.4,
    profitFactor: 2.8,
    maxDrawdown: -2100,
    sharpeRatio: 1.92,
  },
};

export const riskSettings = {
  maxDailyLoss: 2000,
  maxWeeklyLoss: 5000,
  maxTradesPerDay: 5,
  riskPerTrade: 1.5,
  currentDrawdown: -450,
  currentRiskUsage: 37,
  winStreak: 3,
  lossStreak: 0,
  disciplineScore: 87,
  todayTradeCount: 2,
  todayLoss: 255,
};

export const notifications = [
  { id: '1', type: 'alert' as const, message: 'NQ approaching daily high resistance at 21,530', time: '2 min ago' },
  { id: '2', type: 'trade' as const, message: 'Trade closed: NQ Long +$1,850 (2.4R)', time: '28 min ago' },
  { id: '3', type: 'risk' as const, message: 'Risk usage at 37% — within limits', time: '1 hr ago' },
  { id: '4', type: 'insight' as const, message: 'Weekly recap ready — 68% win rate this week', time: '3 hr ago' },
];

export const aiSuggestedPrompts = [
  'Review today\'s trades',
  'Summarize my performance this week',
  'What mistakes am I repeating?',
  'Analyze my best setup',
  'Help me build a trading plan',
  'Should this setup qualify based on my rules?',
];

export const aiInsights = [
  { title: 'Recurring Pattern', description: 'You tend to overtrade in PM sessions. Your win rate drops from 72% (AM) to 48% (PM).', type: 'warning' as const },
  { title: 'Strongest Setup', description: 'Breakout trades have a 74% win rate with an avg 2.1R. This is your edge.', type: 'success' as const },
  { title: 'Focus Area', description: 'Pullback entries need better timing. Consider waiting for candle close confirmation.', type: 'info' as const },
  { title: 'Emotional Pattern', description: 'After a loss, you have a 40% chance of taking a FOMO trade within 30 minutes.', type: 'warning' as const },
];

export const chartData = Array.from({ length: 100 }, (_, i) => {
  const base = 21300 + Math.sin(i / 10) * 100 + i * 1.5;
  const volatility = Math.random() * 40 - 20;
  return {
    time: i,
    open: base + volatility,
    high: base + Math.abs(volatility) + Math.random() * 20,
    low: base - Math.abs(volatility) - Math.random() * 20,
    close: base + volatility + (Math.random() - 0.4) * 30,
    volume: Math.floor(Math.random() * 5000 + 1000),
  };
});
