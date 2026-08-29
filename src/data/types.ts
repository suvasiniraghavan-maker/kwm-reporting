export type ReportCategory = 'Financial' | 'Operations' | 'Sales' | 'HR' | 'Executive';
export type ReportStatus = 'Active' | 'Draft' | 'Archived';
export type GenerationStatus = 'Generated' | 'Pending' | 'Failed';
export type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
export type DeliveryChannel = 'Email' | 'Slack' | 'Teams';

export interface Report {
  id: string;
  name: string;
  category: ReportCategory;
  lastModified: string;
  createdBy: { name: string; avatarColor: string };
  status: ReportStatus;
  description: string;
  rows: number;
  columns: number;
}

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  status: GenerationStatus;
  model: string;
  tokens: number;
  prompt: string;
  previewData: { columns: string[]; rows: (string | number)[][] };
}

export interface ScheduledReport {
  id: string;
  reportId: string;
  name: string;
  frequency: Frequency;
  nextRun: string;
  recipients: { name: string; avatarColor: string; email: string }[];
  delivery: DeliveryChannel;
  active: boolean;
}

export const currentUser = { name: 'Alex Morgan', avatarColor: '#7c3aed' };
