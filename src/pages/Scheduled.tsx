import { ScheduledTable } from '@/components/tables/ScheduledTable';

export function Scheduled() {
  return (
    <div className="animate-fade-in space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Scheduled Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Automate recurring report delivery across email, Slack, and Teams.
        </p>
      </div>
      <ScheduledTable />
    </div>
  );
}
