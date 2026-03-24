import { apiClient } from './api-client';
import env from '@/config/env';
import { analyticsData as mockAnalytics } from '@/data/mockData';
import type { AnalyticsData, ApiResponse } from '@/types';

export const analyticsService = {
  async getAll(): Promise<ApiResponse<AnalyticsData>> {
    if (env.useMockData) {
      return { data: mockAnalytics as AnalyticsData };
    }
    return apiClient.get<AnalyticsData>('/analytics');
  },
};
