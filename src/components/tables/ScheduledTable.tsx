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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  Pencil,
  Play,
  Trash2,
  Mail,
  Slack,
  MessageSquare,
  CalendarClock,
} from 'lucide-react';
import { mockScheduled } from '@/data/mockScheduled';
import type { ScheduledReport, DeliveryChannel } from '@/data/types';
import { useFavourites } from '@/context/FavouritesContext';
import { StarButton } from '@/components/shared/StarButton';
import { FrequencyBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { SortableHeader } from './SortableHeader';
import { TableSkeleton, TableWrapper, useDelayedLoading } from './TablePrimitives';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const frequencies = ['All', 'Daily', 'Weekly', 'Monthly', 'Quarterly'] as const;

const DeliveryIcon = ({ channel }: { channel: DeliveryChannel }) => {
  if (channel === 'Email') return <Mail size={16} />;
  if (channel === 'Slack') return <Slack size={16} />;
  return <MessageSquare size={16} />;
};

const schedFilter: FilterFn<ScheduledReport> = (row, _id, filter) => {
  const r = row.original;
  const matchesQ =
    !filter.q || r.name.toLowerCase().includes(filter.q.toLowerCase());
  const matchesFreq = filter.freq === 'All' || r.frequency === filter.freq;
  return matchesQ && matchesFreq;
};

export function ScheduledTable() {
  const { isFavourite, toggleFavourite } = useFavourites();
  const loading = useDelayedLoading();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filter, setFilter] = useState({ q: '', freq: 'All' as string });
  const [data, setData] = useState(mockScheduled);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = useMemo<ColumnDef<ScheduledReport>[]>(
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
            onClick={() => toast(`Opening ${row.original.name}`)}
            className="font-semibold text-foreground hover:text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'frequency',
        header: 'Frequency',
        cell: ({ row }) => <FrequencyBadge frequency={row.original.frequency} />,
      },
      {
        accessorKey: 'nextRun',
        header: 'Next Run',
        cell: ({ row }) => <span className="whitespace-nowrap text-foreground/80">{row.original.nextRun}</span>,
      },
      {
        id: 'recipients',
        header: 'Recipients',
        cell: ({ row }) => <RecipientStack recipients={row.original.recipients} />,
        enableSorting: false,
      },
      {
        accessorKey: 'delivery',
        header: 'Delivery',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5 text-foreground/80">
            <DeliveryIcon channel={row.original.delivery} /> {row.original.delivery}
          </span>
        ),
      },
      {
        id: 'active',
        header: 'Status',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Switch
              checked={row.original.active}
              onCheckedChange={(checked) => {
                setData((prev) =>
                  prev.map((s) => (s.id === row.original.id ? { ...s, active: checked } : s))
                );
                toast.success(checked ? 'Schedule activated' : 'Schedule paused');
              }}
            />
            <span className={cn('text-xs font-medium', row.original.active ? 'text-emerald-600' : 'text-muted-foreground')}>
              {row.original.active ? 'Active' : 'Paused'}
            </span>
          </div>
        ),
        enableSorting: false,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <ActionIcon title="Edit" onClick={() => toast(`Editing ${row.original.name}`)}><Pencil size={15} /></ActionIcon>
            <ActionIcon title="Run Now" onClick={() => toast.success(`Running ${row.original.name} now...`)}><Play size={15} /></ActionIcon>
            <ActionIcon title="Delete" destructive onClick={() => {
              setData((prev) => prev.filter((s) => s.id !== row.original.id));
              toast.success(`Deleted ${row.original.name}`);
            }}><Trash2 size={15} /></ActionIcon>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [isFavourite, toggleFavourite]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    globalFilterFn: schedFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            value={filter.q}
            onChange={(e) => setFilter((p) => ({ ...p, q: e.target.value }))}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter.freq} onValueChange={(v) => setFilter((p) => ({ ...p, freq: v }))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
            <CalendarPlus size={16} className="mr-1.5" /> Schedule New
          </Button>
        </div>
      </div>

      <TableWrapper>
        <thead className="border-b border-border bg-muted/30">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left first:pl-5">
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
                  icon={<CalendarClock size={28} />}
                  title="No scheduled reports"
                  description="Create a schedule to automatically deliver reports on a recurring basis."
                  action={
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setDialogOpen(true)}>
                      <CalendarPlus size={16} className="mr-1.5" /> Schedule New Report
                    </Button>
                  }
                />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={cn('border-b border-border transition-colors hover:bg-accent/50', i % 2 === 1 && 'bg-muted/20')}
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

      <ScheduleDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

function RecipientStack({ recipients }: { recipients: ScheduledReport['recipients'] }) {
  const max = 3;
  const shown = recipients.slice(0, max);
  const extra = recipients.length - max;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((r) => (
          <UserAvatar key={r.email} name={r.name} color={r.avatarColor} className="ring-2 ring-white" />
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-xs font-medium text-muted-foreground">+{extra} more</span>
      )}
    </div>
  );
}

function ActionIcon({
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

function ScheduleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const addRecipient = () => {
    const e = emailInput.trim();
    if (e && !recipients.includes(e)) {
      setRecipients((p) => [...p, e]);
    }
    setEmailInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule New Report</DialogTitle>
          <DialogDescription>Set up a recurring delivery for a report template.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Report</Label>
            <Select defaultValue="r1">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[
                  'Q4 Revenue Performance', 'Monthly P&L Statement', 'Sales Pipeline Forecast',
                  'Employee Headcount Report', 'Supply Chain Operations',
                ].map((n) => (
                  <SelectItem key={n} value={n.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map((f) => (
                    <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Time</Label>
              <Select defaultValue="9am">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['7:00 AM', '8:00 AM', '9:00 AM', '12:00 PM', '5:00 PM'].map((t) => (
                    <SelectItem key={t} value={t.replace(/[: ]/g, '').toLowerCase()}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Recipients</Label>
            <div className="flex gap-2">
              <Input
                placeholder="email@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRecipient();
                  }
                }}
              />
              <Button variant="outline" onClick={addRecipient}>Add</Button>
            </div>
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recipients.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground">
                    {r}
                    <button
                      onClick={() => setRecipients((p) => p.filter((x) => x !== r))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Delivery Channel</Label>
            <ToggleGroup type="multiple" defaultValue={['email']} className="justify-start">
              <ToggleGroupItem value="email" className="flex items-center gap-1.5"><Mail size={14} /> Email</ToggleGroupItem>
              <ToggleGroupItem value="slack" className="flex items-center gap-1.5"><Slack size={14} /> Slack</ToggleGroupItem>
              <ToggleGroupItem value="teams" className="flex items-center gap-1.5"><MessageSquare size={14} /> Teams</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              onOpenChange(false);
              setRecipients([]);
              toast.success('Schedule saved');
            }}
          >
            Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
