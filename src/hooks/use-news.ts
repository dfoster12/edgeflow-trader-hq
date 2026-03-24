import { useQuery } from '@tanstack/react-query';
import { newsService, type NewsItem } from '@/services/news.service';

export function useNews(keyword?: string) {
  return useQuery<NewsItem[]>({
    queryKey: ['news', keyword],
    queryFn: () => newsService.getNews(keyword),
    refetchInterval: 90_000, // refresh every 90 seconds
    staleTime: 60_000,
  });
}
