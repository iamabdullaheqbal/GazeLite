import type {
  Session,
  SessionStats,
  HeatmapData,
  ModelMetrics,
  HealthStatus,
  OverviewStats,
} from '@/types';
import {
  mockSessions,
  mockOverviewStats,
  mockHeatmaps,
  mockSessionStats,
  mockModels,
} from './mock';

const BASE_URL = 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    return await apiFetch<HealthStatus>('/health');
  } catch {
    return { status: 'offline' };
  }
}

export async function fetchSessions(): Promise<Session[]> {
  try {
    return await apiFetch<Session[]>('/api/sessions');
  } catch {
    return mockSessions;
  }
}

export async function fetchOverviewStats(): Promise<OverviewStats> {
  try {
    return await apiFetch<OverviewStats>('/api/stats/overview');
  } catch {
    return mockOverviewStats;
  }
}

export async function fetchSessionStats(sessionId: string): Promise<SessionStats | null> {
  try {
    return await apiFetch<SessionStats>(`/api/sessions/${sessionId}/stats`);
  } catch {
    return mockSessionStats[sessionId] ?? null;
  }
}

export async function fetchHeatmap(
  sessionId: string,
  cols = 20,
  rows = 20
): Promise<HeatmapData | null> {
  try {
    return await apiFetch<HeatmapData>(
      `/api/heatmap?session_id=${encodeURIComponent(sessionId)}&cols=${cols}&rows=${rows}`
    );
  } catch {
    return (
      mockHeatmaps[sessionId] ?? {
        session_id: sessionId,
        grid: mockHeatmaps['sess_a1b2c3d4e5f6'].grid,
        rows,
        cols,
      }
    );
  }
}

export async function fetchModels(): Promise<ModelMetrics[]> {
  try {
    return await apiFetch<ModelMetrics[]>('/api/models');
  } catch {
    return mockModels;
  }
}
