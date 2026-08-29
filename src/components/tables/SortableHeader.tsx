import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Header } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface SortableHeaderProps<TData> {
  header: Header<TData, unknown>;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader<TData>({ header, children, className }: SortableHeaderProps<TData>) {
  const sorted = header.column.getIsSorted();
  return (
    <button
      className={cn(
        'flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
        className
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {children}
      {sorted === 'asc' ? (
        <ArrowUp size={13} className="text-primary" />
      ) : sorted === 'desc' ? (
        <ArrowDown size={13} className="text-primary" />
      ) : (
        <ArrowUpDown size={13} className="opacity-40" />
      )}
    </button>
  );
}
