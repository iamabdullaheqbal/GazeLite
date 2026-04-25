'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSessions } from '@/lib/api';
import type { Session } from '@/types';
import styles from './page.module.css';

const PAGE_SIZE = 10;

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchSessions().then(setSessions);
  }, []);

  const filtered = useMemo(
    () =>
      sessions.filter(
        (s) =>
          s.page_url.toLowerCase().includes(query.toLowerCase()) ||
          s.session_id.toLowerCase().includes(query.toLowerCase())
      ),
    [sessions, query]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function aucClass(val: number) {
    if (val > 0.72) return styles.aucGreen;
    if (val > 0.65) return styles.aucAmber;
    return '';
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.titles}>
          <h1 className={styles.pageTitle}>Sessions</h1>
          <span className={styles.pageSubtitle}>{sessions.length} total sessions</span>
        </div>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.searchInput}
            placeholder="Filter by URL or session ID…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>All Sessions</span>
          <span className={styles.count}>{filtered.length} results</span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Session ID</th>
              <th className={styles.th}>Page URL</th>
              <th className={styles.th}>Signals</th>
              <th className={styles.th}>Idle Fix</th>
              <th className={styles.th}>Duration</th>
              <th className={styles.th}>AUC-Judd</th>
              <th className={styles.th}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr
                key={s.session_id}
                className={styles.tr}
                onClick={() => router.push(`/sessions/${s.session_id}`)}
              >
                <td className={`${styles.td} ${styles.sessionId}`}>
                  {s.session_id.replace('sess_', '').slice(0, 10)}…
                </td>
                <td className={`${styles.td} ${styles.url}`}>{s.page_url}</td>
                <td className={styles.td}>{s.signal_count.toLocaleString()}</td>
                <td className={styles.td}>{s.idle_fixations}</td>
                <td className={styles.td}>{fmtDuration(s.duration)}</td>
                <td className={`${styles.td} ${aucClass(s.auc_judd)}`}>
                  {s.auc_judd.toFixed(3)}
                </td>
                <td className={styles.td}>{fmtTime(s.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td className={styles.td} colSpan={7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: '32px' }}>
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              ← Prev
            </button>
            <span className={styles.pageInfo}>
              {page + 1} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
