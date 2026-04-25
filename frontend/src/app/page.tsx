'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/StatCard';
import HeatmapGrid from '@/components/HeatmapGrid';
import ModelComparison from '@/components/ModelComparison';
import SessionTable from '@/components/SessionTable';
import { fetchSessions, fetchOverviewStats, fetchHeatmap, fetchModels } from '@/lib/api';
import type { Session, HeatmapData, ModelMetrics, OverviewStats } from '@/types';
import styles from './page.module.css';

const SIGNAL_BREAKDOWN = [
  { label: 'Mouse move', pct: 71, color: '#6366f1' },
  { label: 'Idle fix', pct: 12, color: '#22d3a5' },
  { label: 'Click', pct: 9, color: '#f59e0b' },
  { label: 'Scroll', pct: 8, color: '#f43f5e' },
];

const SIGNAL_WEIGHTS = [
  { key: 'idle_fixation', weight: '5.0×' },
  { key: 'click', weight: '4.0×' },
  { key: 'mouse_move', weight: '1.0×' },
  { key: 'scroll', weight: '0.5×' },
];

export default function OverviewPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [models, setModels] = useState<ModelMetrics[]>([]);
  const [heatmap, setHeatmap] = useState<HeatmapData | null>(null);
  const [activeSession, setActiveSession] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSessions(), fetchOverviewStats(), fetchModels()]).then(
      ([s, o, m]) => {
        setSessions(s);
        setStats(o);
        setModels(m);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!sessions.length) return;
    const sid = sessions[activeSession]?.session_id;
    if (sid) fetchHeatmap(sid).then(setHeatmap);
  }, [sessions, activeSession]);

  const topSessions = sessions.slice(0, 3);
  const currentSession = sessions[activeSession];
  const aucColor =
    (currentSession?.auc_judd ?? 0) > 0.72
      ? 'green'
      : (currentSession?.auc_judd ?? 0) > 0.65
      ? 'amber'
      : '';

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <h1 className={styles.pageTitle}>Overview</h1>
          <span className={styles.pageSubtitle}>
            {loading ? 'Loading…' : `${stats?.total_sessions ?? 0} sessions tracked`}
          </span>
        </div>
        <div className={styles.topRight}>
          <div className={styles.trackingPill}>
            <span className={styles.trackingDot} />
            Live tracking
          </div>
          <button className={styles.newBtn}>+ New Session</button>
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Sessions"
          value={stats?.total_sessions ?? '—'}
          accent="indigo"
        />
        <StatCard
          label="Signals Collected"
          value={stats ? stats.total_signals.toLocaleString() : '—'}
          accent="green"
          mono
        />
        <StatCard
          label="Avg AUC-Judd"
          value={stats ? stats.avg_auc_judd.toFixed(3) : '—'}
          sub="higher is better"
          accent="amber"
          mono
        />
        <StatCard
          label="Total Idle Fixations"
          value={stats ? stats.total_idle_fixations.toLocaleString() : '—'}
          accent="red"
        />
      </div>

      {/* Middle 3-column row */}
      <div className={styles.midRow}>
        {/* Heatmap card */}
        <div className={styles.heatmapCard}>
          <div className={styles.heatmapCardTitle}>Attention Heatmap</div>
          <div className={styles.sessionPills}>
            {topSessions.map((s, i) => (
              <button
                key={s.session_id}
                className={`${styles.sessionPill} ${i === activeSession ? styles.active : ''}`}
                onClick={() => setActiveSession(i)}
              >
                S{i + 1}
              </button>
            ))}
          </div>
          {heatmap ? (
            <HeatmapGrid grid={heatmap.grid} width={240} height={240} />
          ) : (
            <div style={{ width: 240, height: 240, background: 'var(--bg-raised)', borderRadius: 6 }} />
          )}
          <div className={styles.heatmapMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Top Zone</span>
              <span className={styles.metaValue}>{currentSession?.top_zone ?? '—'}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>AUC-Judd</span>
              <span className={`${styles.metaValue} ${aucColor}`}>
                {currentSession?.auc_judd?.toFixed(3) ?? '—'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>NSS</span>
              <span className={styles.metaValue}>2.14</span>
            </div>
          </div>
        </div>

        {/* Signal breakdown */}
        <div className={styles.signalCard}>
          <div className={styles.cardTitle}>Signal Breakdown</div>
          <div className={styles.barChart}>
            {SIGNAL_BREAKDOWN.map((item) => (
              <div key={item.label} className={styles.barRow}>
                <div className={styles.barRowHeader}>
                  <span className={styles.barRowLabel}>{item.label}</span>
                  <span className={styles.barRowPct}>{item.pct}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.pct}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.weightTable}>
            <div className={styles.weightTableTitle}>Signal Weights</div>
            {SIGNAL_WEIGHTS.map((w) => (
              <div key={w.key} className={styles.weightRow}>
                <span className={styles.weightKey}>{w.key}</span>
                <span className={styles.weightVal}>{w.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model comparison */}
        <ModelComparison models={models} />
      </div>

      {/* Session table */}
      <SessionTable
        sessions={sessions}
        onRowClick={(id) => router.push(`/sessions/${id}`)}
      />
    </div>
  );
}
