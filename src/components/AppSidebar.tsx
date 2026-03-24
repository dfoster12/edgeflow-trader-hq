import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, LineChart, BookOpen, BarChart3, Shield, Bot, Settings,
  ChevronLeft, ChevronRight, Zap, X
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

interface AppSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export function AppSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: AppSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300',
          // Mobile: slide in/out
          'max-md:w-[260px]',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
          // Desktop: collapse
          'hidden md:flex',
          collapsed ? 'md:w-[68px]' : 'md:w-[240px]'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center">
            <Zap className="h-7 w-7 text-primary shrink-0" />
            {(!collapsed || mobileOpen) && (
              <span className="ml-2.5 text-xl font-bold tracking-tight text-foreground">
                Edge<span className="text-primary">Flow</span>
              </span>
            )}
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
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
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', active && 'drop-shadow-[0_0_6px_hsl(207,90%,54%)]')} />
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                {active && (
                  <div className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle - desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile sidebar (separate element so it renders even when desktop sidebar is hidden) */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border bg-sidebar transition-transform duration-300 w-[260px] md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center">
            <Zap className="h-7 w-7 text-primary shrink-0" />
            <span className="ml-2.5 text-xl font-bold tracking-tight text-foreground">
              Edge<span className="text-primary">Flow</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', active && 'drop-shadow-[0_0_6px_hsl(207,90%,54%)]')} />
                <span>{item.label}</span>
                {active && <div className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
