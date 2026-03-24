import { useQuery } from '@tanstack/react-query';
import { marketDataService } from '@/services/market-data.service';
import { dashboardService } from '@/services/dashboard.service';

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const res = await marketDataService.getWatchlist();
      return res.data;
    },
    // Market data can be refreshed more frequently when live
    refetchInterval: false, // TODO: Set to 5000 (5s) when live market data is connected
  });
}

export function useMarketQuote(symbol: string) {
  return useQuery({
    queryKey: ['quote', symbol],
    queryFn: async () => {
      const res = await marketDataService.getQuote(symbol);
      return res.data;
    },
    enabled: !!symbol,
  });
}

export function useCandles(symbol: string, timeframe = '5m') {
  return useQuery({
    queryKey: ['candles', symbol, timeframe],
    queryFn: async () => {
      const res = await marketDataService.getCandles(symbol, timeframe);
      return res.data;
    },
    enabled: !!symbol,
  });
}

export function useDashboardKpis() {
  return useQuery({
    queryKey: ['dashboardKpis'],
    queryFn: async () => {
      const res = await dashboardService.getKpis();
      return res.data;
    },
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await dashboardService.getNotifications();
      return res.data;
    },
  });
}
