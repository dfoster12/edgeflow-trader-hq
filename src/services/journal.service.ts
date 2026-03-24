import { apiClient } from './api-client';
import env from '@/config/env';
import { journalEntries as mockEntries } from '@/data/mockData';
import type { JournalEntry, CreateJournalInput, UpdateJournalInput, ApiResponse } from '@/types';

const normalizeTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) return tags.filter((tag): tag is string => typeof tag === 'string');
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeJournalEntry = (entry: any): JournalEntry => ({
  id: entry.id,
  date: entry.date,
  emotionalState: entry.emotionalState ?? entry.emotional_state ?? 'Mixed',
  premarketPlan: entry.premarketPlan ?? entry.premarket_plan ?? '',
  postmarketReview: entry.postmarketReview ?? entry.postmarket_review ?? '',
  marketNotes: entry.marketNotes ?? entry.market_notes ?? '',
  lessons: entry.lessons ?? '',
  tags: normalizeTags(entry.tags),
  trades: entry.trades ?? entry.trades_count ?? 0,
  pnl: entry.pnl ?? 0,
  createdAt: entry.createdAt ?? entry.created_at ?? new Date().toISOString(),
});

export const journalService = {
  async getAll(): Promise<ApiResponse<JournalEntry[]>> {
    if (env.useMockData) return { data: mockEntries as JournalEntry[] };
    try {
      const res = await apiClient.get<JournalEntry[]>('/journal');
      return { ...res, data: (res.data ?? []).map(normalizeJournalEntry) };
    } catch {
      console.warn('Journal API unavailable, using mock data');
      return { data: mockEntries as JournalEntry[] };
    }
  },

  async getById(id: string): Promise<ApiResponse<JournalEntry>> {
    if (env.useMockData) {
      const entry = mockEntries.find(e => e.id === id);
      if (!entry) throw new Error('Journal entry not found');
      return { data: entry as JournalEntry };
    }
    try {
      const res = await apiClient.get<JournalEntry>(`/journal/${id}`);
      return { ...res, data: normalizeJournalEntry(res.data) };
    } catch {
      const entry = mockEntries.find(e => e.id === id);
      if (!entry) throw new Error('Journal entry not found');
      return { data: entry as JournalEntry };
    }
  },

  async create(input: CreateJournalInput): Promise<ApiResponse<JournalEntry>> {
    if (env.useMockData) {
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        postmarketReview: '',
        marketNotes: '',
        lessons: '',
        tags: [],
        trades: 0,
        pnl: 0,
        createdAt: new Date().toISOString(),
        ...input,
      };
      return { data: newEntry };
    }
    const res = await apiClient.post<JournalEntry>('/journal', input);
    return { ...res, data: normalizeJournalEntry(res.data) };
  },

  async update(input: UpdateJournalInput): Promise<ApiResponse<JournalEntry>> {
    if (env.useMockData) {
      const existing = mockEntries.find(e => e.id === input.id);
      if (!existing) throw new Error('Journal entry not found');
      return { data: { ...existing, ...input } as JournalEntry };
    }
    const res = await apiClient.put<JournalEntry>(`/journal/${input.id}`, input);
    return { ...res, data: normalizeJournalEntry(res.data) };
  },

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (env.useMockData) return { data: { success: true } };
    return apiClient.delete(`/journal/${id}`);
  },
};
