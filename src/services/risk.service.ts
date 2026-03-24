import { apiClient } from './api-client';
import env from '@/config/env';
import { riskSettings as mockRisk } from '@/data/mockData';
import type { RiskSettings, ApiResponse } from '@/types';

export const riskService = {
  async getSettings(): Promise<ApiResponse<RiskSettings>> {
    if (env.useMockData) return { data: mockRisk };
    try {
      return await apiClient.get<RiskSettings>('/risk');
    } catch {
      console.warn('Risk API unavailable, using mock data');
      return { data: mockRisk };
    }
  },

  async updateSettings(settings: Partial<RiskSettings>): Promise<ApiResponse<RiskSettings>> {
    if (env.useMockData) return { data: { ...mockRisk, ...settings } };
    return apiClient.put<RiskSettings>('/risk', settings);
  },
};
