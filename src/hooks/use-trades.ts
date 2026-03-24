import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tradesService } from '@/services/trades.service';
import type { CreateTradeInput, UpdateTradeInput } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useTrades() {
  return useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const res = await tradesService.getAll();
      return res.data;
    },
  });
}

export function useTradeById(id: string) {
  return useQuery({
    queryKey: ['trades', id],
    queryFn: async () => {
      const res = await tradesService.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useOpenPositions() {
  return useQuery({
    queryKey: ['openPositions'],
    queryFn: async () => {
      const res = await tradesService.getOpenPositions();
      return res.data;
    },
  });
}

export function useTradeStats() {
  return useQuery({
    queryKey: ['tradeStats'],
    queryFn: async () => {
      const res = await tradesService.getStats();
      return res.data;
    },
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTradeInput) => tradesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['tradeStats'] });
      queryClient.invalidateQueries({ queryKey: ['openPositions'] });
      toast({ title: 'Trade saved', description: 'Your trade has been logged successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error saving trade', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTradeInput) => tradesService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['tradeStats'] });
      toast({ title: 'Trade updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating trade', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tradesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['tradeStats'] });
      toast({ title: 'Trade deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting trade', description: error.message, variant: 'destructive' });
    },
  });
}
