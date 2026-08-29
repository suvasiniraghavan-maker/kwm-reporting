import { useEffect, useState } from 'react';
import { Search, FileText, Bot, CalendarClock, CornerDownLeft } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { mockReports } from '@/data/mockReports';
import { mockHistory } from '@/data/mockHistory';
import { mockScheduled } from '@/data/mockScheduled';
import type { TabId } from '@/components/layout/TopNav';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: TabId) => void;
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  const go = (tab: TabId, name: string) => {
    onNavigate(tab);
    onOpenChange(false);
    setQuery('');
    toast(`Opening ${name}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search reports, schedules, history..." value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go('all-reports', 'All Reports')}>
            <FileText size={16} className="mr-2 text-muted-foreground" /> All Reports
          </CommandItem>
          <CommandItem onSelect={() => go('ai-builder', 'AI Builder')}>
            <Bot size={16} className="mr-2 text-muted-foreground" /> AI Builder
          </CommandItem>
          <CommandItem onSelect={() => go('scheduled', 'Scheduled')}>
            <CalendarClock size={16} className="mr-2 text-muted-foreground" /> Scheduled Reports
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Reports">
          {mockReports
            .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
            .map((r) => (
              <CommandItem key={r.id} onSelect={() => go('all-reports', r.name)}>
                <FileText size={16} className="mr-2 text-muted-foreground" /> {r.name}
                <span className="ml-auto text-xs text-muted-foreground">{r.category}</span>
              </CommandItem>
            ))}
        </CommandGroup>
        {query && (
          <CommandGroup heading="AI History">
            {mockHistory
              .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 3)
              .map((h) => (
                <CommandItem key={h.id} onSelect={() => go('ai-builder', h.name)}>
                  <Bot size={16} className="mr-2 text-muted-foreground" /> {h.name}
                </CommandItem>
              ))}
          </CommandGroup>
        )}
        {query && (
          <CommandGroup heading="Schedules">
            {mockScheduled
              .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 3)
              .map((s) => (
                <CommandItem key={s.id} onSelect={() => go('scheduled', s.name)}>
                  <CalendarClock size={16} className="mr-2 text-muted-foreground" /> {s.name}
                  <span className="ml-auto text-xs text-muted-foreground">{s.frequency}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
      <div className="flex items-center gap-1.5 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <CornerDownLeft size={12} /> to select · <Search size={12} /> to search · esc to close
      </div>
    </CommandDialog>
  );
}
