import { apiClient } from './api-client';
import env from '@/config/env';
import { kpiData as mockKpis, notifications as mockNotifications } from '@/data/mockData';
import type { DashboardKpis, Notification, ApiResponse } from '@/types';

export const dashboardService = {
  async getKpis(): Promise<ApiResponse<DashboardKpis>> {
    if (env.useMockData) return { data: mockKpis };
    try {
      return await apiClient.get<DashboardKpis>('/analytics/kpis');
    } catch {
      console.warn('KPIs API unavailable, using mock data');
      return { data: mockKpis };
    }
  },

  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    if (env.useMockData) return { data: mockNotifications as Notification[] };
    try {
      return await apiClient.get<Notification[]>('/notifications');
    } catch {
      console.warn('Notifications API unavailable, using mock data');
      return { data: mockNotifications as Notification[] };
    }
  },
};
