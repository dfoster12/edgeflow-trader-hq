import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { riskService } from '@/services/risk.service';
import type { RiskSettings } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useRiskSettings() {
  return useQuery({
    queryKey: ['risk'],
    queryFn: async () => {
      const res = await riskService.getSettings();
      return res.data;
    },
  });
}

export function useUpdateRiskSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<RiskSettings>) => riskService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk'] });
      toast({ title: 'Risk settings updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating risk settings', description: error.message, variant: 'destructive' });
    },
  });
}
