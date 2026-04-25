'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HeatmapGrid from '@/components/HeatmapGrid';
import { fetchSessionStats, fetchHeatmap } from '@/lib/api';
import type { SessionStats, HeatmapData } from '@/types';
import styles from './page.module.css';

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const SIGNAL_COLORS: Record<string, string> = {
  mouse_move: '#6366f1',
  idle_fixation: '#22d3a5',
  click: '#f59e0b',
  scroll: '#f43f5e',
};

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.session_id as string;

  const [stats, setStats] = useState<SessionStats | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    Promise.all([
      fetchSessionStats(sessionId),
      fetchHeatmap(sessionId, 20, 20),
    ]).then(([s, h]) => {
      setStats(s);
      setHeatmap(h);
    });
  }, [sessionId]);

  const totalSignals = stats
    ? Object.values(stats.signals_by_type).reduce((a, b) => a + b, 0)
    : 0;

  const maxTimeline = stats
    ? Math.max(...stats.timeline.map((t) => t.count))
    : 1;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => router.push('/sessions')}>
        ← Back to sessions
      </button>

      <div className={styles.header}>
        <span className={styles.sessionId}>{sessionId}</span>
        <h1 className={styles.pageTitle}>{stats?.page_url ?? 'Loading…'}</h1>
        {stats && (
          <span className={styles.pageMeta}>
            Duration: {fmtDuration(stats.duration)} · {stats.signal_count.toLocaleString()} signals
          </span>
        )}
      </div>

      <div className={styles.mainGrid}>
        {/* Left: heatmap */}
        <div className={styles.heatmapCard}>
          <div className={styles.cardTitle}>Attention Heatmap</div>
          {heatmap ? (
            <HeatmapGrid grid={heatmap.grid} width={360} height={360} />
          ) : (
            <div
              style={{
                width: 360,
                height: 360,
                background: 'var(--bg-raised)',
                borderRadius: 6,
              }}
            />
          )}
        </div>

        {/* Right: stats */}
        <div className={styles.statsCard}>
          {/* Signals by type */}
          <div className={styles.subCard}>
            <div className={styles.subCardTitle}>Signals by Type</div>
            <div className={styles.signalRows}>
              {stats
                ? Object.entries(stats.signals_by_type).map(([key, count]) => {
                    const pct = totalSignals ? (count / totalSignals) * 100 : 0;
                    return (
                      <div key={key} className={styles.signalRow}>
                        <div className={styles.signalRowHeader}>
                          <span className={styles.signalLabel}>{key}</span>
                          <span className={styles.signalCount}>
                            {count} ({pct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{
                              width: `${pct}%`,
                              background: SIGNAL_COLORS[key] ?? 'var(--indigo)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </div>

          {/* Top zones */}
          <div className={styles.subCard}>
            <div className={styles.subCardTitle}>Top Hottest Zones</div>
            <div className={styles.zoneList}>
              {stats?.top_zones.map((z, i) => (
                <div key={z.zone} className={styles.zoneRow}>
                  <span className={styles.zoneRank}>#{i + 1}</span>
                  <span className={styles.zoneName}>{z.zone}</span>
                  <div className={styles.zoneBar}>
                    <div
                      className={styles.zoneBarFill}
                      style={{ width: `${z.value * 100}%` }}
                    />
                  </div>
                  <span className={styles.zoneVal}>{z.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signal timeline */}
          <div className={styles.subCard}>
            <div className={styles.subCardTitle}>Signal Timeline</div>
            {stats && (
              <>
                <div className={styles.timeline}>
                  {stats.timeline.map((t) => (
                    <div
                      key={t.minute}
                      className={styles.timelineBar}
                      style={{ height: `${(t.count / maxTimeline) * 100}%` }}
                      title={`Minute ${t.minute}: ${t.count} signals`}
                    />
                  ))}
                </div>
                <div className={styles.timelineLabels}>
                  {stats.timeline.map((t) => (
                    <span key={t.minute} className={styles.timelineLabel}>
                      {t.minute}m
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
