import { useState } from 'react';
import { Mic, Send, Sparkles } from 'lucide-react';
import type { HistoryItem } from '@/data/types';
import { currentUser } from '@/data/types';
import { HistoryTable } from '@/components/tables/HistoryTable';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface PromptPanelProps {
  onSelectHistory: (item: HistoryItem) => void;
  selectedHistoryId?: string;
}

const quickPrompts = [
  'Sales Summary',
  'Monthly P&L',
  'Team Performance',
  'Customer Churn',
  'Inventory Status',
];

export function PromptPanel({ onSelectHistory, selectedHistoryId }: PromptPanelProps) {
  const [prompt, setPrompt] = useState('');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-bold text-foreground">
          {greeting}, {currentUser.name.split(' ')[0]}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Which report would you like to build?</p>
      </div>

      {/* Prompt input */}
      <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
        <Textarea
          placeholder="Describe the report you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0"
        />
        <div className="flex items-center justify-between pt-2">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
            title="Voice input"
          >
            <Mic size={16} />
          </button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={!prompt.trim()}
            onClick={() => {
              if (prompt.trim()) {
                setPrompt('');
                // Simulate generating
                const event = new CustomEvent('ai-generate', { detail: prompt });
                window.dispatchEvent(event);
              }
            }}
          >
            <Send size={14} className="mr-1.5" /> Generate
          </Button>
        </div>
      </div>

      {/* Quick prompts */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Quick prompts</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => setPrompt(`Generate a ${q} report for the current period.`)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary"
            >
              <Sparkles size={12} className="text-primary" /> {q}
            </button>
          ))}
        </div>
      </div>

      {/* Previous reports */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Previous Reports</h3>
        <HistoryTable onSelect={onSelectHistory} selectedId={selectedHistoryId} />
      </div>
    </div>
  );
}
