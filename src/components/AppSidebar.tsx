import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, LineChart, BookOpen, BarChart3, Shield, Bot, Settings,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Trades', icon: LineChart, path: '/trades' },
  { label: 'Journal', icon: BookOpen, path: '/journal' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Risk Manager', icon: Shield, path: '/risk' },
  { label: 'AI Assistant', icon: Bot, path: '/ai' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <Zap className="h-7 w-7 text-primary shrink-0" />
        {!collapsed && (
          <span className="ml-2.5 text-xl font-bold tracking-tight text-foreground">
            Edge<span className="text-primary">Flow</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', active && 'drop-shadow-[0_0_6px_hsl(207,90%,54%)]')} />
              {!collapsed && <span>{item.label}</span>}
              {active && (
                <div className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
