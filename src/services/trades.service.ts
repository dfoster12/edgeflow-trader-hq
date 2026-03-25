import { apiClient } from './api-client';
import { botApiService } from './bot-api.service';
import env from '@/config/env';
import { recentTrades, openPositions as mockPositions, analyticsData } from '@/data/mockData';
import type { Trade, OpenPosition, CreateTradeInput, UpdateTradeInput, ApiResponse } from '@/types';

export const tradesService = {
  async getAll(): Promise<ApiResponse<Trade[]>> {
    if (env.useMockData && !botApiService.isConfigured()) return { data: recentTrades as Trade[] };
    if (botApiService.isConfigured()) {
      try {
        return { data: await botApiService.getTrades() };
      } catch {
        console.warn('Bot trades API unavailable, using mock data');
        return { data: recentTrades as Trade[] };
      }
    }
    try {
      return await apiClient.get<Trade[]>('/trades');
    } catch {
      console.warn('Trades API unavailable, using mock data');
      return { data: recentTrades as Trade[] };
    }
  },

  async getById(id: string): Promise<ApiResponse<Trade>> {
    if (env.useMockData) {
      const trade = recentTrades.find(t => t.id === id);
      if (!trade) throw new Error('Trade not found');
      return { data: trade as Trade };
    }
    try {
      return await apiClient.get<Trade>(`/trades/${id}`);
    } catch {
      const trade = recentTrades.find(t => t.id === id);
      if (!trade) throw new Error('Trade not found');
      return { data: trade as Trade };
    }
  },

  async create(input: CreateTradeInput): Promise<ApiResponse<Trade>> {
    if (env.useMockData) {
      const pnl = (input.exit - input.entry) * input.size * (input.side === 'Long' ? 1 : -1);
      const newTrade: Trade = {
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        pnl,
        rMultiple: input.stopLoss ? Math.abs(pnl / ((input.entry - input.stopLoss) * input.size)) : 0,
        status: 'Closed',
        session: input.session || 'NY AM',
        notes: input.notes || '',
        createdAt: new Date().toISOString(),
        ...input,
      };
      return { data: newTrade };
    }
    return apiClient.post<Trade>('/trades', input);
  },

  async update(input: UpdateTradeInput): Promise<ApiResponse<Trade>> {
    if (env.useMockData) {
      const existing = recentTrades.find(t => t.id === input.id);
      if (!existing) throw new Error('Trade not found');
      return { data: { ...existing, ...input } as Trade };
    }
    return apiClient.put<Trade>(`/trades/${input.id}`, input);
  },

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    if (env.useMockData) return { data: { success: true } };
    return apiClient.delete(`/trades/${id}`);
  },

  async getOpenPositions(): Promise<ApiResponse<OpenPosition[]>> {
    if (env.useMockData && !botApiService.isConfigured()) return { data: mockPositions as OpenPosition[] };
    if (botApiService.isConfigured()) {
      try {
        return { data: await botApiService.getOpenPositions() };
      } catch {
        console.warn('Bot positions API unavailable, using mock data');
        return { data: mockPositions as OpenPosition[] };
      }
    }
    try {
      return await apiClient.get<OpenPosition[]>('/trades/positions');
    } catch {
      console.warn('Positions API unavailable, using mock data');
      return { data: mockPositions as OpenPosition[] };
    }
  },

  async getStats(): Promise<ApiResponse<typeof analyticsData.stats>> {
    if (env.useMockData) return { data: analyticsData.stats };
    try {
      return await apiClient.get('/trades/stats');
    } catch {
      console.warn('Trade stats API unavailable, using mock data');
      return { data: analyticsData.stats };
    }
  },
};
