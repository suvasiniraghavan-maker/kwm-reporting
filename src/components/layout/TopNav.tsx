import { LayoutGrid, Bot, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'all-reports' | 'ai-builder' | 'scheduled';

interface TopNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'all-reports', label: 'All Reports', icon: LayoutGrid },
  { id: 'ai-builder', label: 'AI Builder', icon: Bot },
  { id: 'scheduled', label: 'Scheduled', icon: CalendarClock },
];

export function TopNav({ active, onChange }: TopNavProps) {
  return (
    <nav className="flex h-16 items-center gap-1 border-b border-border bg-white px-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon size={16} />
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
