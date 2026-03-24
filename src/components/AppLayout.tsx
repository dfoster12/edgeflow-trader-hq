import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <AppSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'md:ml-[68px]' : 'md:ml-[240px]'
        }`}
      >
        <AppHeader onMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
