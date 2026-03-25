import { apiClient } from './api-client';
import { botApiService } from './bot-api.service';
import env from '@/config/env';
import { analyticsData as mockAnalytics } from '@/data/mockData';
import type { AnalyticsData, ApiResponse } from '@/types';

export const analyticsService = {
  async getAll(): Promise<ApiResponse<AnalyticsData>> {
    if (env.useMockData && !botApiService.isConfigured()) return { data: mockAnalytics as AnalyticsData };
    if (botApiService.isConfigured()) {
      try {
        return { data: await botApiService.getAnalytics() };
      } catch {
        console.warn('Bot analytics unavailable, using mock data');
        return { data: mockAnalytics as AnalyticsData };
      }
    }
    try {
      return await apiClient.get<AnalyticsData>('/analytics');
    } catch {
      console.warn('Analytics API unavailable, using mock data');
      return { data: mockAnalytics as AnalyticsData };
    }
  },
};
