import { Download, FileText, Share2, Bot, Sparkles, Cpu, Hash } from 'lucide-react';
import type { HistoryItem } from '@/data/types';
import { useFavourites } from '@/context/FavouritesContext';
import { StarButton } from '@/components/shared/StarButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PreviewPanelProps {
  item: HistoryItem | null;
}

export function PreviewPanel({ item }: PreviewPanelProps) {
  const { isFavourite, toggleFavourite } = useFavourites();

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="flex max-w-sm flex-col items-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-8 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
            <Bot size={30} />
          </div>
          <h3 className="text-base font-semibold text-foreground">Select or generate a report to preview it</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your AI-generated report preview will appear here with charts, data tables, and export options.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={13} className="text-primary" /> Powered by ReportAI
          </div>
        </div>
      </div>
    );
  }

  const isGen = item.status === 'Generated' && item.previewData.columns.length > 0;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Action bar */}
      <div className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
        <h2 className="truncate text-base font-semibold text-foreground">{item.name}</h2>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" disabled={!isGen} onClick={() => toast.success('CSV downloaded')}>
            <Download size={14} className="mr-1.5" /> CSV
          </Button>
          <Button variant="outline" size="sm" disabled={!isGen} onClick={() => toast.success('PDF downloaded')}>
            <FileText size={14} className="mr-1.5" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success('Share link copied')}>
            <Share2 size={14} />
          </Button>
          <StarButton
            starred={isFavourite(item.id)}
            onToggle={() => {
              const wasFav = isFavourite(item.id);
              toggleFavourite({ id: item.id, name: item.name });
              toast.success(wasFav ? 'Report unstarred' : 'Report starred');
            }}
            size={18}
            className="border border-border"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-5">
        {/* Metadata row */}
        <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>Generated {item.date}</span>
          <span className="flex items-center gap-1"><Cpu size={13} /> {item.model}</span>
          <span className="flex items-center gap-1"><Hash size={13} /> {item.tokens.toLocaleString()} tokens</span>
        </div>

        {/* Prompt */}
        <div className="mb-5 rounded-lg bg-muted/40 p-3 text-sm text-foreground/70">
          <span className="font-medium text-muted-foreground">Prompt: </span>
          {item.prompt}
        </div>

        {isGen ? (
          <div className="animate-fade-in space-y-5">
            {/* Chart placeholder */}
            <div className="flex h-56 items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Chart preview</p>
                <p className="text-xs text-muted-foreground/70">Bar chart visualization would render here</p>
              </div>
            </div>

            {/* Data table */}
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      {item.previewData.columns.map((col) => (
                        <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {item.previewData.rows.map((row, i) => (
                      <tr key={i} className={cn('border-b border-border last:border-0', i % 2 === 1 && 'bg-muted/20')}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5 text-foreground/80">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sparkles size={22} />
            </div>
            <p className="text-sm font-medium text-foreground">
              {item.status === 'Pending' ? 'Generation in progress...' : 'Generation failed'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.status === 'Pending'
                ? 'This report is still being generated. Check back shortly.'
                : 'Something went wrong. Try regenerating this report.'}
            </p>
            {item.status === 'Failed' && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => toast.success('Regenerating report...')}
              >
                <Sparkles size={14} className="mr-1.5" /> Regenerate
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
