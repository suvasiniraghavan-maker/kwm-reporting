export interface ReportKPI {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
  target?: number;
}

export interface TrendPoint {
  month: string;
  revenue: number;
  target: number;
  profit: number;
}

export interface ReportTableRow {
  region: string;
  product: string;
  revenue: number;
  deals: number;
  avgDeal: number;
  growth: number;
  rep: string;
}

export interface ReportDataset {
  kpis: ReportKPI[];
  regionChart: ChartSeriesPoint[];
  trendChart: TrendPoint[];
  table: {
    columns: { key: keyof ReportTableRow; label: string; sortable: boolean; align?: 'right' | 'left' }[];
    rows: ReportTableRow[];
  };
}

export const reportR1Data: ReportDataset = {
  kpis: [
    { label: 'Total Revenue', value: '$12.4M', change: '+15.2% YoY', positive: true },
    { label: 'Deals Closed', value: '1,284', change: '+8.7% QoQ', positive: true },
    { label: 'Avg Deal Size', value: '$9,656', change: '+5.1% MoM', positive: true },
    { label: 'Win Rate', value: '34.2%', change: '-2.1% vs target', positive: false },
  ],
  regionChart: [
    { label: 'North America', value: 5200 },
    { label: 'EMEA', value: 3800 },
    { label: 'APAC', value: 2400 },
    { label: 'LATAM', value: 720 },
    { label: 'Middle East', value: 280 },
  ],
  trendChart: [
    { month: 'Jul', revenue: 3.1, target: 3.0, profit: 1.1 },
    { month: 'Aug', revenue: 3.4, target: 3.2, profit: 1.3 },
    { month: 'Sep', revenue: 3.6, target: 3.4, profit: 1.4 },
    { month: 'Oct', revenue: 3.8, target: 3.5, profit: 1.5 },
    { month: 'Nov', revenue: 4.2, target: 3.8, profit: 1.7 },
    { month: 'Dec', revenue: 4.5, target: 4.0, profit: 1.9 },
  ],
  table: {
    columns: [
      { key: 'region', label: 'Region', sortable: true },
      { key: 'product', label: 'Product Line', sortable: true },
      { key: 'revenue', label: 'Revenue', sortable: true, align: 'right' },
      { key: 'deals', label: 'Deals', sortable: true, align: 'right' },
      { key: 'avgDeal', label: 'Avg Deal', sortable: true, align: 'right' },
      { key: 'growth', label: 'Growth %', sortable: true, align: 'right' },
      { key: 'rep', label: 'Sales Rep', sortable: true },
    ],
    rows: [
      { region: 'North America', product: 'Enterprise Suite', revenue: 1_840_000, deals: 142, avgDeal: 12_958, growth: 18.2, rep: 'Marcus Reid' },
      { region: 'North America', product: 'Cloud Platform', revenue: 1_620_000, deals: 198, avgDeal: 8_182, growth: 12.4, rep: 'Sarah Chen' },
      { region: 'North America', product: 'Analytics Pro', revenue: 1_740_000, deals: 156, avgDeal: 11_154, growth: 15.8, rep: 'Alex Morgan' },
      { region: 'EMEA', product: 'Enterprise Suite', revenue: 1_380_000, deals: 112, avgDeal: 12_321, growth: 9.6, rep: 'Emma Wilson' },
      { region: 'EMEA', product: 'Cloud Platform', revenue: 1_240_000, deals: 168, avgDeal: 7_381, growth: 7.2, rep: 'Liam Becker' },
      { region: 'EMEA', product: 'Analytics Pro', revenue: 1_180_000, deals: 94, avgDeal: 12_553, growth: 11.0, rep: 'Sofia Garcia' },
      { region: 'APAC', product: 'Enterprise Suite', revenue: 920_000, deals: 68, avgDeal: 13_529, growth: 22.1, rep: 'Ken Tanaka' },
      { region: 'APAC', product: 'Cloud Platform', revenue: 880_000, deals: 124, avgDeal: 7_097, growth: 16.5, rep: 'Yuki Sato' },
      { region: 'APAC', product: 'Analytics Pro', revenue: 600_000, deals: 52, avgDeal: 11_538, growth: 14.3, rep: 'Mei Lin' },
      { region: 'LATAM', product: 'Enterprise Suite', revenue: 420_000, deals: 32, avgDeal: 13_125, growth: 6.8, rep: 'Carlos Diaz' },
      { region: 'LATAM', product: 'Cloud Platform', revenue: 300_000, deals: 54, avgDeal: 5_556, growth: 4.2, rep: 'Isabella Rocha' },
      { region: 'Middle East', product: 'Enterprise Suite', revenue: 280_000, deals: 18, avgDeal: 15_556, growth: 24.5, rep: 'Omar Hassan' },
    ],
  },
};
