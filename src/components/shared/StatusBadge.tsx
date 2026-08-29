import { cn } from '@/lib/utils';
import type { ReportCategory, ReportStatus, Frequency, GenerationStatus } from '@/data/types';

const categoryStyles: Record<ReportCategory, string> = {
  Financial: 'bg-blue-50 text-blue-700 ring-blue-200',
  Operations: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  Sales: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  HR: 'bg-orange-50 text-orange-700 ring-orange-200',
  Executive: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function CategoryBadge({ category }: { category: ReportCategory }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        categoryStyles[category]
      )}
    >
      {category}
    </span>
  );
}

const statusStyles: Record<ReportStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Draft: 'bg-amber-50 text-amber-700 ring-amber-200',
  Archived: 'bg-gray-100 text-gray-600 ring-gray-200',
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        statusStyles[status]
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'Active' && 'bg-emerald-500',
          status === 'Draft' && 'bg-amber-500',
          status === 'Archived' && 'bg-gray-400'
        )}
      />
      {status}
    </span>
  );
}

const frequencyStyles: Record<Frequency, string> = {
  Daily: 'bg-blue-50 text-blue-700 ring-blue-200',
  Weekly: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Monthly: 'bg-violet-50 text-violet-700 ring-violet-200',
  Quarterly: 'bg-orange-50 text-orange-700 ring-orange-200',
};

export function FrequencyBadge({ frequency }: { frequency: Frequency }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        frequencyStyles[frequency]
      )}
    >
      {frequency}
    </span>
  );
}

const genStatusStyles: Record<GenerationStatus, string> = {
  Generated: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Failed: 'bg-red-50 text-red-700 ring-red-200',
};

export function GenerationStatusBadge({ status }: { status: GenerationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        genStatusStyles[status]
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'Generated' && 'bg-emerald-500',
          status === 'Pending' && 'bg-amber-500 animate-pulse',
          status === 'Failed' && 'bg-red-500'
        )}
      />
      {status}
    </span>
  );
}
