import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  Share2,
  FileText,
} from 'lucide-react';
import type { Report } from '@/data/types';
import { reportR1Data, type ReportTableRow } from '@/data/reportData';
import { CategoryBadge, StatusBadge } from '@/components/shared/StatusBadge';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReportViewProps {
  report: Report;
  onBack: () => void;
}

const barColors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export function ReportView({ report, onBack }: ReportViewProps) {
  const data = reportR1Data;

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} /> Back to All Reports
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{report.name}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{report.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <CategoryBadge category={report.category} />
            <StatusBadge status={report.status} />
            <span className="text-xs text-muted-foreground">Updated {report.lastModified}</span>
            <div className="flex items-center gap-1.5">
              <UserAvatar name={report.createdBy.name} color={report.createdBy.avatarColor} />
              <span className="text-xs text-muted-foreground">{report.createdBy.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Share link copied')}>
            <Share2 size={14} className="mr-1.5" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download size={14} className="mr-1.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('PDF exported')}>
            <FileText size={14} className="mr-1.5" /> PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">{kpi.value}</p>
            <div className={cn('mt-1.5 flex items-center gap-1 text-xs font-medium', kpi.positive ? 'text-emerald-600' : 'text-red-500')}>
              {kpi.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Revenue trend */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Revenue vs Target Trend</h3>
          <p className="mb-4 text-xs text-muted-foreground">Monthly revenue and profit ($M)</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.trendChart} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                formatter={(v: number) => `$${v}M`}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: '#7c3aed' }} name="Revenue" />
              <Line type="monotone" dataKey="target" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Region breakdown */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Revenue by Region</h3>
          <p className="mb-4 text-xs text-muted-foreground">Q4 revenue distribution ($K)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.regionChart} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                formatter={(v: number) => `$${v}K`}
                cursor={{ fill: '#f5f3ff' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Revenue">
                {data.regionChart.map((_, i) => (
                  <Cell key={i} fill={barColors[i % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data table */}
      <ReportDataTable />
    </div>
  );

  function exportCSV() {
    const cols = data.table.columns.map((c) => c.label);
    const header = cols.join(',');
    const lines = data.table.rows.map((r) =>
      data.table.columns.map((c) => {
        const v = r[c.key];
        if (c.key === 'revenue') return v;
        if (c.key === 'avgDeal') return v;
        if (c.key === 'growth') return `${v}%`;
        return `"${v}"`;
      }).join(',')
    );
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  }
}

function ReportDataTable() {
  const { columns, rows } = reportR1Data.table;
  const [sortKey, setSortKey] = useState<keyof ReportTableRow | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [query, setQuery] = useState('');

  const sortedFiltered = useMemo(() => {
    let result = [...rows];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.region.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.rep.toLowerCase().includes(q)
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        let cmp = 0;
        if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
        else cmp = String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [rows, sortKey, sortDir, query]);

  const toggleSort = (key: keyof ReportTableRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const totalRevenue = sortedFiltered.reduce((s, r) => s + r.revenue, 0);
  const totalDeals = sortedFiltered.reduce((s, r) => s + r.deals, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      {/* Table toolbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Revenue Breakdown Detail</h3>
        <div className="relative w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter rows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-9 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-2.5 text-left">
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground',
                        col.align === 'right' && 'flex-row-reverse'
                      )}
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ArrowUp size={12} className="text-primary" /> : <ArrowDown size={12} className="text-primary" />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedFiltered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No matching rows.
                </td>
              </tr>
            ) : (
              sortedFiltered.map((row, i) => (
                <tr key={i} className={cn('border-b border-border last:border-0 transition-colors hover:bg-accent/40', i % 2 === 1 && 'bg-muted/20')}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-4 py-2.5 text-foreground/80', col.align === 'right' && 'text-right tabular-nums')}
                    >
                      {formatCell(col.key, row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          {sortedFiltered.length > 0 && (
            <tfoot className="border-t-2 border-border bg-muted/30">
              <tr className="font-semibold text-foreground">
                <td className="px-4 py-2.5">Total ({sortedFiltered.length} rows)</td>
                <td className="px-4 py-2.5" />
                <td className="px-4 py-2.5 text-right tabular-nums">${totalRevenue.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right tabular-nums">{totalDeals}</td>
                <td className="px-4 py-2.5" />
                <td className="px-4 py-2.5" />
                <td className="px-4 py-2.5" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

function formatCell(key: keyof ReportTableRow, value: string | number): string {
  if (key === 'revenue') return `$${Number(value).toLocaleString()}`;
  if (key === 'avgDeal') return `$${Number(value).toLocaleString()}`;
  if (key === 'growth') return `${value}%`;
  return String(value);
}
