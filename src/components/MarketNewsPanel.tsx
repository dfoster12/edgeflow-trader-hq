import { useNews } from '@/hooks/use-news';
import { LoadingState } from '@/components/StateViews';
import { Newspaper, ExternalLink, Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const filters = ['All', 'Macro', 'Tech', 'Earnings'] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MarketNewsPanel() {
  const { data: news, isLoading, error } = useNews();
  const [filter, setFilter] = useState<string>('All');

  const filtered = (news ?? []).filter(
    item => filter === 'All' || (item.tags ?? []).includes(filter)
  );

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Market News</h3>
        </div>
        {/* AI Summary placeholder */}
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors" title="AI Summary — coming soon">
          <Sparkles className="h-3 w-3" />
          <span className="hidden sm:inline">AI Summary</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 mb-4">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
              filter === f
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState message="Loading news..." />
      ) : error ? (
        <p className="text-sm text-muted-foreground text-center py-4">Unable to load news</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No news for this filter</p>
      ) : (
        <div className="space-y-1">
          {filtered.slice(0, 8).map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {item.isHighImpact && (
                    <Zap className="h-3 w-3 text-warning shrink-0" />
                  )}
                  <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{item.source}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(item.publishedAt)}</span>
                  {item.sentiment && item.sentiment !== 'neutral' && (
                    <Badge
                      className={cn(
                        'text-[10px] px-1.5 py-0 h-4 border-0',
                        item.sentiment === 'bullish'
                          ? 'bg-profit/10 text-profit'
                          : 'bg-loss/10 text-loss'
                      )}
                    >
                      {item.sentiment === 'bullish' ? '▲ Bullish' : '▼ Bearish'}
                    </Badge>
                  )}
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
