import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalService } from '@/services/journal.service';
import type { CreateJournalInput, UpdateJournalInput } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useJournalEntries() {
  return useQuery({
    queryKey: ['journal'],
    queryFn: async () => {
      const res = await journalService.getAll();
      return res.data;
    },
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateJournalInput) => journalService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast({ title: 'Journal entry saved' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error saving entry', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateJournalInput) => journalService.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast({ title: 'Journal entry updated' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error updating entry', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => journalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast({ title: 'Journal entry deleted' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting entry', description: error.message, variant: 'destructive' });
    },
  });
}
