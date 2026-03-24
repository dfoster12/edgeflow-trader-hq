import { apiClient } from './api-client';
import env from '@/config/env';
import { kpiData as mockKpis, notifications as mockNotifications } from '@/data/mockData';
import type { DashboardKpis, Notification, ApiResponse } from '@/types';

export const dashboardService = {
  async getKpis(): Promise<ApiResponse<DashboardKpis>> {
    if (env.useMockData) {
      return { data: mockKpis };
    }
    return apiClient.get<DashboardKpis>('/analytics/kpis');
  },

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    if (env.useMockData) {
      return { data: mockNotifications as Notification[] };
    }
    return apiClient.get<Notification[]>('/notifications');
  },
};
