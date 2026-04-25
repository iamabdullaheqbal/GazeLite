export interface Session {
  session_id: string;
  page_url: string;
  signal_count: number;
  idle_fixations: number;
  duration: number; // seconds
  auc_judd: number;
  top_zone: string;
  created_at: string;
}

export interface SessionStats {
  session_id: string;
  page_url: string;
  duration: number;
  signal_count: number;
  idle_fixations: number;
  auc_judd: number;
  nss: number;
  cc: number;
  kld: number;
  signals_by_type: Record<string, number>;
  top_zones: Array<{ zone: string; value: number }>;
  timeline: Array<{ minute: number; count: number }>;
}

export interface HeatmapData {
  grid: number[][];
  cols: number;
  rows: number;
  session_id: string;
}

export interface ModelMetrics {
  name: string;
  auc_judd: number;
  nss: number;
  cc: number;
  kld: number;
}

export interface HealthStatus {
  status: string;
  version?: string;
}

export interface OverviewStats {
  total_sessions: number;
  total_signals: number;
  avg_auc_judd: number;
  total_idle_fixations: number;
}

export type AccentColor = 'indigo' | 'green' | 'amber' | 'red';
