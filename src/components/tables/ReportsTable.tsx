import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type FilterFn,
} from '@tanstack/react-table';
import {
  Pencil,
  Copy,
  Clock,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { mockReports } from '@/data/mockReports';
import type { Report } from '@/data/types';
import { useFavourites } from '@/context/FavouritesContext';
import { StarButton } from '@/components/shared/StarButton';
import { CategoryBadge, StatusBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { SortableHeader } from './SortableHeader';
import { TableSkeleton, TableWrapper, useDelayedLoading } from './TablePrimitives';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

const categories = ['All', 'Financial', 'Operations', 'Sales', 'HR', 'Executive'] as const;
const statuses = ['All', 'Active', 'Draft', 'Archived'] as const;

const multiFilter: FilterFn<Report> = (row, _columnId, filterValue: { q: string; cat: string; stat: string }) => {
  const r = row.original;
  const matchesQ =
    !filterValue.q ||
    r.name.toLowerCase().includes(filterValue.q.toLowerCase()) ||
    r.createdBy.name.toLowerCase().includes(filterValue.q.toLowerCase());
  const matchesCat = filterValue.cat === 'All' || r.category === filterValue.cat;
  const matchesStat = filterValue.stat === 'All' || r.status === filterValue.stat;
  return matchesQ && matchesCat && matchesStat;
};

interface ReportsTableProps {
  onOpenReport?: (id: string) => void;
}

export function ReportsTable({ onOpenReport }: ReportsTableProps = {}) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const loading = useDelayedLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState({ q: '', cat: 'All' as string, stat: 'All' as string });
  const [selected, setSelected] = useState<Report | null>(null);

  const handleOpen = (report: Report) => {
    if (onOpenReport) {
      onOpenReport(report.id);
    } else {
      toast.success(`Opening ${report.name}`);
    }
  };

  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        id: 'fav',
        header: '★',
        cell: ({ row }) => (
          <StarButton
            starred={isFavourite(row.original.id)}
            onToggle={() => {
              const r = row.original;
              const wasFav = isFavourite(r.id);
              toggleFavourite({ id: r.id, name: r.name });
              toast.success(wasFav ? 'Report unstarred' : 'Report starred');
            }}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Report Name',
        cell: ({ row }) => (
          <button
            onClick={() => setSelected(row.original)}
            className="font-semibold text-foreground hover:text-primary hover:underline"
          >
            {row.original.name}
            {row.original.id === 'r1' && (
              <span className="ml-2 inline-flex items-center rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Sample
              </span>
            )}
          </button>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <CategoryBadge category={row.original.category} />,
      },
      {
        accessorKey: 'lastModified',
        header: 'Last Modified',
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.lastModified}</span>,
      },
      {
        accessorKey: 'createdBy.name',
        id: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <UserAvatar name={row.original.createdBy.name} color={row.original.createdBy.avatarColor} />
            <span className="text-foreground/80">{row.original.createdBy.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionRow report={row.original} />,
        enableSorting: false,
      },
    ],
    [isFavourite, toggleFavourite]
  );

  const table = useReactTable({
    data: mockReports,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: multiFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, filteredCount);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={globalFilter.q}
            onChange={(e) => setGlobalFilter((p) => ({ ...p, q: e.target.value }))}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={globalFilter.cat} onValueChange={(v) => setGlobalFilter((p) => ({ ...p, cat: v }))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={globalFilter.stat} onValueChange={(v) => setGlobalFilter((p) => ({ ...p, stat: v }))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => toast.success('New report created')}
          >
            <FileText size={16} className="mr-1.5" /> New Report
          </Button>
        </div>
      </div>

      <TableWrapper>
        <thead className="border-b border-border bg-muted/30">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left first:pl-5">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                  icon={<FileText size={28} />}
                  title="No reports found"
                  description="Try adjusting your search or filters, or create a new report."
                  action={
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setGlobalFilter({ q: '', cat: 'All', stat: 'All' });
                        toast.success('New report created');
                      }}
                    >
                      <FileText size={16} className="mr-1.5" /> New Report
                    </Button>
                  }
                />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border transition-colors hover:bg-accent/50',
                  i % 2 === 1 && 'bg-muted/20'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 first:pl-5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </TableWrapper>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {start}–{end} of {filteredCount} results
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft size={16} /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Detail sheet */}
      <ReportSheet report={selected} onClose={() => setSelected(null)} onOpenReport={handleOpen} />
    </div>
  );
}

function ActionRow({ report }: { report: Report }) {
  return (
    <div className="flex items-center gap-1">
      <IconBtn title="Edit" onClick={() => toast(`Editing ${report.name}`)}><Pencil size={15} /></IconBtn>
      <IconBtn title="Duplicate" onClick={() => toast.success(`Duplicated ${report.name}`)}><Copy size={15} /></IconBtn>
      <IconBtn title="Schedule" onClick={() => toast(`Scheduling ${report.name}`)}><Clock size={15} /></IconBtn>
      <IconBtn title="Delete" destructive onClick={() => toast.success(`Deleted ${report.name}`)}><Trash2 size={15} /></IconBtn>
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  destructive,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent',
        destructive && 'hover:bg-red-50 hover:text-destructive'
      )}
    >
      {children}
    </button>
  );
}

function ReportSheet({
  report,
  onClose,
  onOpenReport,
}: {
  report: Report | null;
  onClose: () => void;
  onOpenReport: (report: Report) => void;
}) {
  const { isFavourite, toggleFavourite } = useFavourites();
  return (
    <Sheet open={!!report} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {report && (
          <>
            <SheetHeader>
              <SheetTitle className="text-xl">{report.name}</SheetTitle>
              <SheetDescription>{report.description}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <CategoryBadge category={report.category} />
                <StatusBadge status={report.status} />
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Last Modified" value={report.lastModified} />
                <Field label="Created By" value={report.createdBy.name} />
                <Field label="Total Rows" value={report.rows.toLocaleString()} />
                <Field label="Columns" value={String(report.columns)} />
              </dl>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onOpenReport(report)}>
                  <FileText size={16} className="mr-1.5" /> Open Report
                  {report.id !== 'r1' && (
                    <span className="ml-1 text-[10px] font-normal opacity-80">(sample)</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const wasFav = isFavourite(report.id);
                    toggleFavourite({ id: report.id, name: report.name });
                    toast.success(wasFav ? 'Report unstarred' : 'Report starred');
                  }}
                >
                  {isFavourite(report.id) ? 'Unstar' : 'Star'}
                </Button>
              </div>
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-accent"
                onClick={() => toast.success('Generating with AI...')}
              >
                <Sparkles size={16} className="mr-1.5" /> Generate with AI
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
