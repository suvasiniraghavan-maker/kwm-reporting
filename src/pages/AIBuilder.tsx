import { useState } from 'react';
import { PromptPanel } from '@/components/ai/PromptPanel';
import { PreviewPanel } from '@/components/ai/PreviewPanel';
import type { HistoryItem } from '@/data/types';
import { mockHistory } from '@/data/mockHistory';

export function AIBuilder() {
  const [selected, setSelected] = useState<HistoryItem | null>(mockHistory[0]);

  return (
    <div className="animate-fade-in flex h-[calc(100vh-4rem)]">
      <div className="w-[340px] shrink-0 border-r border-border bg-muted/20">
        <PromptPanel onSelectHistory={setSelected} selectedHistoryId={selected?.id} />
      </div>
      <div className="flex-1 bg-white">
        <PreviewPanel item={selected} />
      </div>
    </div>
  );
}
