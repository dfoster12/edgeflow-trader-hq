import { useState } from 'react';
import { Search, Bell, Plus, User, TrendingUp, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notifications } from '@/data/mockData';

interface AppHeaderProps {
  onMenuToggle?: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 md:h-16 flex items-center justify-between px-3 md:px-6 border-b border-border bg-background/80 backdrop-blur-xl gap-2">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-80 hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search trades, symbols, notes..."
          className="w-full h-9 pl-10 pr-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono hidden lg:inline">⌘K</kbd>
      </div>

      {/* Mobile search icon */}
      <button className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
        <Search className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Market Status - hidden on small screens */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
          <div className="h-2 w-2 rounded-full bg-profit animate-pulse-subtle" />
          <span className="text-xs font-medium text-muted-foreground">Markets Open</span>
          <TrendingUp className="h-3.5 w-3.5 text-profit" />
        </div>

        {/* Quick Action */}
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hidden sm:flex">
          <Plus className="h-4 w-4" />
          Log Trade
        </Button>
        <Button size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 sm:hidden h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-2 animate-fade-in">
              <p className="text-xs font-semibold text-muted-foreground px-3 py-2">Notifications</p>
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                    n.type === 'alert' ? 'bg-warning' : n.type === 'trade' ? 'bg-profit' : n.type === 'risk' ? 'bg-primary' : 'bg-accent'
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </button>
      </div>
    </header>
  );
}
