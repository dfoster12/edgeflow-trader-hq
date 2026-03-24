import { apiClient } from './api-client';
import env from '@/config/env';
import { journalEntries as mockEntries } from '@/data/mockData';
import type { JournalEntry, CreateJournalInput, UpdateJournalInput, ApiResponse } from '@/types';

export const journalService = {
  async getAll(): Promise<ApiResponse<JournalEntry[]>> {
    if (env.useMockData) return { data: mockEntries as JournalEntry[] };
    try {
      return await apiClient.get<JournalEntry[]>('/journal');
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
      return await apiClient.get<JournalEntry>(`/journal/${id}`);
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
    return apiClient.post<JournalEntry>('/journal', input);
  },

  async update(input: UpdateJournalInput): Promise<ApiResponse<JournalEntry>> {
    if (env.useMockData) {
      const existing = mockEntries.find(e => e.id === input.id);
      if (!existing) throw new Error('Journal entry not found');
      return { data: { ...existing, ...input } as JournalEntry };
    }
    return apiClient.put<JournalEntry>(`/journal/${input.id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (env.useMockData) return { data: { success: true } };
    return apiClient.delete(`/journal/${id}`);
  },
};
