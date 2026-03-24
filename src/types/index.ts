// ============================================
// EdgeFlow Data Models & TypeScript Interfaces
// ============================================
// These types define the data architecture for the entire application.
// When integrating a real database (e.g., PostgreSQL, D1, Turso),
// create tables matching these interfaces.

// ---- Trade ----
export type TradeSide = 'Long' | 'Short';
export type TradeStatus = 'Open' | 'Closed' | 'Cancelled';
export type TradeSession = 'Pre-Market' | 'NY AM' | 'NY PM' | 'London' | 'Asian' | 'After Hours';

export interface Trade {
  id: string;
  userId?: string; // TODO: Add when auth is implemented
  date: string;
  symbol: string;
  setup: string;
  side: TradeSide;
  entry: number;
  exit: number;
  size: number;
  pnl: number;
  rMultiple: number;
  status: TradeStatus;
  session: string;
  notes: string;
  stopLoss?: number;
  target?: number;
  screenshotUrls?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTradeInput {
  symbol: string;
  setup: string;
  side: TradeSide;
  entry: number;
  exit: number;
  size: number;
  stopLoss?: number;
  target?: number;
  session?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateTradeInput extends Partial<CreateTradeInput> {
  id: string;
}

// ---- Open Position ----
export interface OpenPosition {
  id?: string;
  symbol: string;
  side: TradeSide;
  entry: number;
  current: number;
  stop: number;
  target: number;
  unrealizedPnL: number;
  size: number;
}

// ---- Journal ----
export type EmotionalState = 'Focused' | 'Confident' | 'Mixed' | 'Anxious' | 'Frustrated' | 'Calm';

export interface JournalEntry {
  id: string;
  userId?: string;
  date: string;
  emotionalState: string;
  premarketPlan: string;
  postmarketReview: string;
  marketNotes: string;
  lessons: string;
  tags: string[];
  trades: number;
  pnl: number;
  screenshotUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJournalInput {
  date: string;
  emotionalState: string;
  premarketPlan: string;
  postmarketReview?: string;
  marketNotes?: string;
  lessons?: string;
  tags?: string[];
}

export interface UpdateJournalInput extends Partial<CreateJournalInput> {
  id: string;
}

// ---- Analytics ----
export interface EquityCurvePoint {
  date: string;
  value: number;
}

export interface WeekdayPerformance {
  day: string;
  pnl: number;
  trades: number;
}

export interface SetupPerformance {
  setup: string;
  winRate: number;
  avgR: number;
  trades: number;
}

export interface TimePerformance {
  hour: string;
  pnl: number;
}

export interface DailyHeatmapEntry {
  date: string;
  pnl: number;
}

export interface AnalyticsStats {
  totalTrades: number;
  totalProfit: number;
  avgWinner: number;
  avgLoser: number;
  largestWin: number;
  largestLoss: number;
  avgRMultiple: number;
  expectancy: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  equityCurve: EquityCurvePoint[];
  weekdayPerformance: WeekdayPerformance[];
  setupPerformance: SetupPerformance[];
  timePerformance: TimePerformance[];
  dailyHeatmap: DailyHeatmapEntry[];
}

// ---- Risk ----
export interface RiskSettings {
  maxDailyLoss: number;
  maxWeeklyLoss: number;
  maxTradesPerDay: number;
  riskPerTrade: number;
  currentDrawdown: number;
  currentRiskUsage: number;
  winStreak: number;
  lossStreak: number;
  disciplineScore: number;
  todayTradeCount: number;
  todayLoss: number;
}

// ---- Market Data ----
export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent?: number;
  volume: string;
  high?: number;
  low?: number;
  open?: number;
  timestamp?: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ---- KPIs ----
export interface DashboardKpis {
  dailyPnL: number;
  weeklyPnL: number;
  winRate: number;
  accountBalance: number;
  riskUsedToday: number;
  openPositions: number;
}

// ---- Notifications ----
export type NotificationType = 'alert' | 'trade' | 'risk' | 'insight';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read?: boolean;
}

// ---- User Preferences ----
export interface UserPreferences {
  defaultMarket: string;
  defaultPositionSize: number;
  autoJournal: boolean;
  sessionAlerts: boolean;
  theme: 'dark' | 'light' | 'system';
  chartColorScheme: string;
  compactMode: boolean;
  primarySession: string;
  showPreMarket: boolean;
  newsFilter: boolean;
}

// ---- API Response Wrapper ----
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

// ---- AI Assistant ----
export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AiInsight {
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
}
