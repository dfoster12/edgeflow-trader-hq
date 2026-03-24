import { User, Palette, Bell, Shield, BarChart3, Link, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'trading', label: 'Trading Preferences', icon: BarChart3 },
  { id: 'risk', label: 'Risk Defaults', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Link },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'market', label: 'Market Preferences', icon: Globe },
];

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn('h-6 w-11 rounded-full transition-colors relative', on ? 'bg-primary' : 'bg-muted')}
    >
      <div className={cn('h-5 w-5 rounded-full bg-foreground absolute top-0.5 transition-transform', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Sidebar */}
      <div className="w-56 shrink-0 space-y-1">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all',
              activeSection === s.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            )}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 glass-card p-6 max-w-3xl">
        {activeSection === 'profile' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
            <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/30">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Trader Profile</p>
                <p className="text-xs text-muted-foreground">trader@edgeflow.com</p>
              </div>
            </div>
            {[
              { label: 'Display Name', placeholder: 'Your Name' },
              { label: 'Email', placeholder: 'trader@edgeflow.com' },
              { label: 'Timezone', placeholder: 'Eastern Time (ET)' },
            ].map(f => (
              <div key={f.label} className="mb-4">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{f.label}</label>
                <input
                  placeholder={f.placeholder}
                  defaultValue={f.placeholder}
                  className="w-full h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'trading' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Trading Preferences</h2>
            <SettingRow label="Default Market" description="Primary market you trade">
              <select className="h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                <option>NQ (Nasdaq Futures)</option>
                <option>ES (S&P Futures)</option>
                <option>YM (Dow Futures)</option>
              </select>
            </SettingRow>
            <SettingRow label="Default Position Size" description="Standard contract size">
              <input defaultValue="2" className="w-20 h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-center" />
            </SettingRow>
            <SettingRow label="Auto-Journal Trades" description="Automatically create journal entries">
              <Toggle defaultOn />
            </SettingRow>
            <SettingRow label="Session Alerts" description="Notify on session open/close">
              <Toggle defaultOn />
            </SettingRow>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
            <SettingRow label="Trade Alerts" description="Get notified when trades execute"><Toggle defaultOn /></SettingRow>
            <SettingRow label="Risk Warnings" description="Alert when approaching risk limits"><Toggle defaultOn /></SettingRow>
            <SettingRow label="AI Insights" description="Daily AI-generated trading insights"><Toggle defaultOn /></SettingRow>
            <SettingRow label="Market News" description="Breaking market news alerts"><Toggle /></SettingRow>
            <SettingRow label="Daily Recap" description="End of day performance summary"><Toggle defaultOn /></SettingRow>
          </div>
        )}

        {activeSection === 'risk' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Risk Defaults</h2>
            <SettingRow label="Max Daily Loss" description="Maximum allowed loss per day">
              <input defaultValue="$2,000" className="w-28 h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-center" />
            </SettingRow>
            <SettingRow label="Max Weekly Loss" description="Maximum allowed loss per week">
              <input defaultValue="$5,000" className="w-28 h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-center" />
            </SettingRow>
            <SettingRow label="Risk Per Trade" description="Percentage of account per trade">
              <input defaultValue="1.5%" className="w-28 h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-center" />
            </SettingRow>
            <SettingRow label="Max Trades Per Day" description="Daily trade count limit">
              <input defaultValue="5" className="w-28 h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-center" />
            </SettingRow>
            <SettingRow label="Auto-Lockout" description="Automatically lock trading when limits hit"><Toggle defaultOn /></SettingRow>
          </div>
        )}

        {activeSection === 'appearance' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Appearance</h2>
            <SettingRow label="Theme" description="Application color scheme">
              <select className="h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </SettingRow>
            <SettingRow label="Chart Color Scheme" description="Default chart colors">
              <select className="h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                <option>Blue / Teal</option>
                <option>Green / Red</option>
                <option>Monochrome</option>
              </select>
            </SettingRow>
            <SettingRow label="Compact Mode" description="Reduce spacing for more data density"><Toggle /></SettingRow>
          </div>
        )}

        {activeSection === 'integrations' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Integrations</h2>
            {[
              { name: 'NinjaTrader', desc: 'Import trades automatically', connected: false },
              { name: 'TradingView', desc: 'Sync charts and alerts', connected: true },
              { name: 'Discord', desc: 'Send trade alerts to your server', connected: false },
              { name: 'Webhook API', desc: 'Custom integrations via webhooks', connected: false },
            ].map(int => (
              <div key={int.name} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{int.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{int.desc}</p>
                </div>
                <button className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  int.connected ? 'bg-profit/10 text-profit border-profit/20' : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/30'
                )}>
                  {int.connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'data' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Data Management</h2>
            <SettingRow label="Export Trades" description="Download your trade history as CSV">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all">Export</button>
            </SettingRow>
            <SettingRow label="Import Trades" description="Import trades from a CSV file">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground border border-border hover:border-primary/30 transition-all">Import</button>
            </SettingRow>
            <SettingRow label="Backup Data" description="Create a full backup of your data">
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground border border-border hover:border-primary/30 transition-all">Backup</button>
            </SettingRow>
          </div>
        )}

        {activeSection === 'market' && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-6">Market Preferences</h2>
            <SettingRow label="Primary Session" description="Your main trading session">
              <select className="h-9 px-3 rounded-lg bg-muted/50 border border-border text-sm text-foreground">
                <option>New York AM</option>
                <option>New York PM</option>
                <option>London</option>
                <option>Asian</option>
              </select>
            </SettingRow>
            <SettingRow label="Show Pre-Market Data" description="Display pre-market price action"><Toggle defaultOn /></SettingRow>
            <SettingRow label="News Filter" description="Filter news by relevance"><Toggle defaultOn /></SettingRow>
          </div>
        )}
      </div>
    </div>
  );
}
