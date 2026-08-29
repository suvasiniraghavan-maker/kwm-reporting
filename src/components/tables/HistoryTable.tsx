import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type FilterFn,
} from '@tanstack/react-table';
import { Search, Eye, Trash2, Inbox } from 'lucide-react';
import { mockHistory } from '@/data/mockHistory';
import type { HistoryItem } from '@/data/types';
import { useFavourites } from '@/context/FavouritesContext';
import { StarButton } from '@/components/shared/StarButton';
import { GenerationStatusBadge } from '@/components/shared/StatusBadge';
import { SortableHeader } from './SortableHeader';
import { TableSkeleton, TableWrapper, useDelayedLoading } from './TablePrimitives';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const histFilter: FilterFn<HistoryItem> = (row, _id, q: string) => {
  if (!q) return true;
  return row.original.name.toLowerCase().includes(q.toLowerCase());
};

interface HistoryTableProps {
  onSelect: (item: HistoryItem) => void;
  selectedId?: string;
}

export function HistoryTable({ onSelect, selectedId }: HistoryTableProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const loading = useDelayedLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [query, setQuery] = useState('');
  const [data, setData] = useState(mockHistory);

  const columns = useMemo<ColumnDef<HistoryItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <button
            onClick={() => onSelect(row.original)}
            className={cn(
              'font-medium hover:underline',
              selectedId === row.original.id ? 'text-primary' : 'text-foreground hover:text-primary'
            )}
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.date}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <GenerationStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              title="View"
              onClick={() => onSelect(row.original)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Eye size={15} />
            </button>
            <StarButton
              starred={isFavourite(row.original.id)}
              onToggle={() => {
                const r = row.original;
                const wasFav = isFavourite(r.id);
                toggleFavourite({ id: r.id, name: r.name });
                toast.success(wasFav ? 'Report unstarred' : 'Report starred');
              }}
            />
            <button
              title="Delete"
              onClick={() => {
                setData((prev) => prev.filter((d) => d.id !== row.original.id));
                toast.success('Report deleted');
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isFavourite, toggleFavourite, onSelect, selectedId]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    globalFilterFn: histFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search previous reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 pl-9 text-sm"
        />
      </div>
      <TableWrapper>
        <thead className="border-b border-border bg-muted/30">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-3 py-2.5 text-left">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton cols={columns.length} />
          ) : filteredCount === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState
                  icon={<Inbox size={28} />}
                  title="No reports found"
                  description="Your generated reports will appear here."
                />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelect(row.original)}
                className={cn(
                  'cursor-pointer border-b border-border transition-colors hover:bg-accent/50',
                  selectedId === row.original.id && 'bg-accent/40'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2.5 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </TableWrapper>
    </div>
  );
}
