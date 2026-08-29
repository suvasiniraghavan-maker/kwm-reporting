import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReportsTable } from '@/components/tables/ReportsTable';
import { ReportView } from '@/components/reports/ReportView';
import { mockReports } from '@/data/mockReports';

export function AllReports() {
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  const openReport = openReportId ? mockReports.find((r) => r.id === openReportId) : null;

  useEffect(() => {
    if (openReport && openReport.id !== 'r1') {
      toast.info('Only "Q4 Revenue Performance" has a live sample. Other reports are placeholders.');
      setOpenReportId(null);
    }
  }, [openReport]);

  if (openReport && openReport.id === 'r1') {
    return <ReportView report={openReport} onBack={() => setOpenReportId(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">All Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse, filter, and manage all your report templates.
        </p>
      </div>
      <ReportsTable onOpenReport={(id) => setOpenReportId(id)} />
    </div>
  );
}
