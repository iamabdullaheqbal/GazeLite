import type {
  Session,
  SessionStats,
  HeatmapData,
  ModelMetrics,
  OverviewStats,
} from '@/types';

export const mockSessions: Session[] = [
  {
    session_id: 'sess_a1b2c3d4e5f6',
    page_url: 'https://example.com/products/laptop',
    signal_count: 1842,
    idle_fixations: 217,
    duration: 312,
    auc_judd: 0.791,
    top_zone: 'center-top',
    created_at: '2026-04-25T10:14:22Z',
  },
  {
    session_id: 'sess_b2c3d4e5f6a1',
    page_url: 'https://example.com/checkout',
    signal_count: 934,
    idle_fixations: 98,
    duration: 178,
    auc_judd: 0.682,
    top_zone: 'center-mid',
    created_at: '2026-04-25T09:47:11Z',
  },
  {
    session_id: 'sess_c3d4e5f6a1b2',
    page_url: 'https://example.com/',
    signal_count: 2310,
    idle_fixations: 301,
    duration: 445,
    auc_judd: 0.734,
    top_zone: 'top-left',
    created_at: '2026-04-24T16:32:08Z',
  },
  {
    session_id: 'sess_d4e5f6a1b2c3',
    page_url: 'https://example.com/blog/article-42',
    signal_count: 3105,
    idle_fixations: 412,
    duration: 621,
    auc_judd: 0.812,
    top_zone: 'left-mid',
    created_at: '2026-04-24T14:05:55Z',
  },
  {
    session_id: 'sess_e5f6a1b2c3d4',
    page_url: 'https://example.com/search?q=keyboard',
    signal_count: 567,
    idle_fixations: 44,
    duration: 89,
    auc_judd: 0.641,
    top_zone: 'center-top',
    created_at: '2026-04-23T11:20:33Z',
  },
  {
    session_id: 'sess_f6a1b2c3d4e5',
    page_url: 'https://example.com/account/settings',
    signal_count: 412,
    idle_fixations: 21,
    duration: 65,
    auc_judd: 0.598,
    top_zone: 'top-right',
    created_at: '2026-04-22T08:55:19Z',
  },
];

export const mockOverviewStats: OverviewStats = {
  total_sessions: 6,
  total_signals: 9170,
  avg_auc_judd: 0.71,
  total_idle_fixations: 1093,
};

function makeHeatmapGrid(rows: number, cols: number, seed: number): number[][] {
  const grid: number[][] = [];
  // Create a gaussian-ish blob near center with seed variation
  const cx = cols / 2 + (seed % 3) * 2;
  const cy = rows / 3 + (seed % 4);
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const dx = (c - cx) / (cols / 4);
      const dy = (r - cy) / (rows / 4);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const noise = Math.sin(r * 3.7 + c * 2.1 + seed) * 0.08;
      const val = Math.max(0, Math.min(1, Math.exp(-dist * 1.2) + noise));
      row.push(Math.round(val * 1000) / 1000);
    }
    grid.push(row);
  }
  return grid;
}

export const mockHeatmaps: Record<string, HeatmapData> = {
  'sess_a1b2c3d4e5f6': {
    session_id: 'sess_a1b2c3d4e5f6',
    grid: makeHeatmapGrid(20, 20, 1),
    rows: 20,
    cols: 20,
  },
  'sess_b2c3d4e5f6a1': {
    session_id: 'sess_b2c3d4e5f6a1',
    grid: makeHeatmapGrid(20, 20, 2),
    rows: 20,
    cols: 20,
  },
  'sess_c3d4e5f6a1b2': {
    session_id: 'sess_c3d4e5f6a1b2',
    grid: makeHeatmapGrid(20, 20, 3),
    rows: 20,
    cols: 20,
  },
};

export const mockSessionStats: Record<string, SessionStats> = {
  'sess_a1b2c3d4e5f6': {
    session_id: 'sess_a1b2c3d4e5f6',
    page_url: 'https://example.com/products/laptop',
    duration: 312,
    signal_count: 1842,
    idle_fixations: 217,
    auc_judd: 0.791,
    nss: 2.14,
    cc: 0.68,
    kld: 0.31,
    signals_by_type: {
      mouse_move: 1308,
      idle_fixation: 217,
      click: 166,
      scroll: 151,
    },
    top_zones: [
      { zone: 'center-top', value: 0.91 },
      { zone: 'center-mid', value: 0.74 },
      { zone: 'top-left', value: 0.62 },
      { zone: 'right-mid', value: 0.51 },
      { zone: 'bottom-center', value: 0.38 },
    ],
    timeline: [
      { minute: 0, count: 312 },
      { minute: 1, count: 445 },
      { minute: 2, count: 398 },
      { minute: 3, count: 287 },
      { minute: 4, count: 264 },
      { minute: 5, count: 136 },
    ],
  },
  'sess_b2c3d4e5f6a1': {
    session_id: 'sess_b2c3d4e5f6a1',
    page_url: 'https://example.com/checkout',
    duration: 178,
    signal_count: 934,
    idle_fixations: 98,
    auc_judd: 0.682,
    nss: 1.87,
    cc: 0.55,
    kld: 0.47,
    signals_by_type: {
      mouse_move: 663,
      idle_fixation: 98,
      click: 84,
      scroll: 89,
    },
    top_zones: [
      { zone: 'center-mid', value: 0.88 },
      { zone: 'center-top', value: 0.71 },
      { zone: 'top-right', value: 0.55 },
      { zone: 'center-bottom', value: 0.42 },
      { zone: 'left-mid', value: 0.29 },
    ],
    timeline: [
      { minute: 0, count: 288 },
      { minute: 1, count: 391 },
      { minute: 2, count: 255 },
    ],
  },
};

export const mockModels: ModelMetrics[] = [
  { name: 'GBR', auc_judd: 0.812, nss: 2.41, cc: 0.71, kld: 0.28 },
  { name: 'RF', auc_judd: 0.791, nss: 2.19, cc: 0.66, kld: 0.33 },
  { name: 'Linear', auc_judd: 0.734, nss: 1.88, cc: 0.58, kld: 0.49 },
  { name: 'Center Bias', auc_judd: 0.641, nss: 1.22, cc: 0.44, kld: 0.71 },
  { name: 'Random', auc_judd: 0.501, nss: 0.31, cc: 0.12, kld: 1.42 },
];
