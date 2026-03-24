import { useState } from 'react';
import { aiSuggestedPrompts, aiInsights } from '@/data/mockData';
import { Bot, Send, Sparkles, AlertTriangle, TrendingUp, Info, Lightbulb, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const insightIcons = { warning: AlertTriangle, success: TrendingUp, info: Info };
const insightColors = { warning: 'text-warning border-warning/20 bg-warning/5', success: 'text-profit border-profit/20 bg-profit/5', info: 'text-primary border-primary/20 bg-primary/5' };

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Good morning! I've analyzed your recent trading data. You had a strong session today with a $1,847 profit. Your breakout strategy continues to be your best performer with a 74% win rate.\n\nI noticed you entered slightly early on your pullback trade. Would you like me to review your pullback entry criteria and suggest improvements?" },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    const botMsg: Message = {
      role: 'assistant',
      content: "Based on your trading history, I can see some interesting patterns. Your AM session trades have a significantly higher win rate (72%) compared to PM trades (48%). I'd recommend focusing your energy on the first 2.5 hours of the NY session where your edge is strongest.\n\nYour average R-multiple on breakout trades is 2.1, which is excellent. However, your pullback entries could improve with better timing — specifically waiting for a candle close above the key level before entering."
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] animate-fade-in">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">EdgeFlow AI</h3>
            <p className="text-xs text-muted-foreground">Your trading copilot</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full bg-profit/10">
            <div className="h-1.5 w-1.5 rounded-full bg-profit animate-pulse-subtle" />
            <span className="text-[10px] text-profit font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted/50 text-foreground rounded-bl-sm border border-border'
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="px-5 py-3 border-t border-border/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {aiSuggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your trading..."
              className="flex-1 h-10 px-4 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              onClick={sendMessage}
              className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 space-y-4 overflow-y-auto shrink-0 hidden xl:block">
        {/* AI Insights */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => {
              const Icon = insightIcons[insight.type];
              return (
                <div key={i} className={cn('p-3 rounded-lg border', insightColors[insight.type])}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{insight.title}</span>
                  </div>
                  <p className="text-xs text-secondary-foreground leading-relaxed">{insight.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Recap */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Daily Recap</h3>
          </div>
          <div className="space-y-2 text-xs text-secondary-foreground">
            <p>• 2 trades taken (within limit)</p>
            <p>• Net P&L: <span className="text-profit font-semibold">+$1,595</span></p>
            <p>• Win rate today: 50% (1W / 1L)</p>
            <p>• Best trade: Breakout +$1,850 (2.4R)</p>
            <p>• Discipline score: 87/100</p>
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-foreground">Weekly Focus</h3>
          </div>
          <div className="space-y-2.5">
            {[
              'Focus on breakout setups only',
              'Improve pullback entry timing',
              'Avoid PM session trades',
              'Maintain 3-trade daily limit',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                <span className="text-xs text-secondary-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
