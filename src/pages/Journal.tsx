import { journalEntries } from '@/data/mockData';
import { BookOpen, Calendar, Plus, Tag, Smile, Meh, Frown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const tagColors: Record<string, string> = {
  'followed plan': 'bg-profit/10 text-profit',
  'good patience': 'bg-accent/10 text-accent',
  'strong execution': 'bg-primary/10 text-primary',
  'FOMO': 'bg-loss/10 text-loss',
  'overtrading': 'bg-warning/10 text-warning',
  'revenge trading': 'bg-loss/10 text-loss',
};

const emotionIcons: Record<string, typeof Smile> = {
  Focused: Smile,
  Confident: Smile,
  Mixed: Meh,
  Anxious: Frown,
  Frustrated: Frown,
};

export default function Journal() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Journal</h1>
          <p className="text-sm text-muted-foreground mt-1">Reflect, learn, and improve your trading</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-border text-muted-foreground hover:text-foreground">
            <Calendar className="h-4 w-4" /> Calendar View
          </Button>
          <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Entry
          </Button>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalEntries.map((entry) => {
          const EmotionIcon = emotionIcons[entry.emotionalState] || Meh;
          const isPositive = entry.pnl >= 0;

          return (
            <div key={entry.id} className="glass-card-hover p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border">
                    <EmotionIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">{entry.emotionalState}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{entry.trades} trades</span>
                  <div className={cn('flex items-center gap-1 text-sm font-semibold font-mono', isPositive ? 'text-profit' : 'text-loss')}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {isPositive ? '+' : ''}${entry.pnl.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Pre-Market Plan</h4>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{entry.premarketPlan}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Post-Market Review</h4>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{entry.postmarketReview}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Notes</h4>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{entry.marketNotes}</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-warning uppercase tracking-wider">Lessons Learned</h4>
                  <p className="text-sm text-secondary-foreground leading-relaxed">{entry.lessons}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                {entry.tags.map(tag => (
                  <span key={tag} className={cn('px-2.5 py-1 rounded-full text-xs font-medium', tagColors[tag] || 'bg-muted text-muted-foreground')}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Screenshots placeholder */}
              <div className="flex gap-3 pt-2">
                {[1, 2].map(i => (
                  <div key={i} className="w-24 h-16 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">Screenshot</span>
                  </div>
                ))}
                <button className="w-24 h-16 rounded-lg border border-dashed border-border flex items-center justify-center hover:border-primary/30 transition-colors">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
