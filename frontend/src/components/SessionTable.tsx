import type { Session } from '@/types';
import styles from './SessionTable.module.css';

interface Props {
  sessions: Session[];
  onRowClick?: (sessionId: string) => void;
}

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function aucClass(val: number) {
  if (val > 0.72) return styles.aucGreen;
  if (val > 0.65) return styles.aucAmber;
  return '';
}

export default function SessionTable({ sessions, onRowClick }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Recent Sessions</span>
        <span className={styles.count}>{sessions.length} sessions</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Session ID</th>
            <th className={styles.th}>Page</th>
            <th className={styles.th}>Signals</th>
            <th className={styles.th}>Idle Fix</th>
            <th className={styles.th}>Duration</th>
            <th className={styles.th}>AUC-Judd</th>
            <th className={styles.th}>Top Zone</th>
            <th className={styles.th}>When</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr
              key={s.session_id}
              className={`${styles.tr} ${i === 0 ? styles.latest : ''}`}
              onClick={() => onRowClick?.(s.session_id)}
            >
              <td className={`${styles.td} ${styles.sessionId}`}>
                {s.session_id.replace('sess_', '').slice(0, 10)}…
              </td>
              <td className={`${styles.td} ${styles.url}`}>{s.page_url}</td>
              <td className={styles.td}>{s.signal_count.toLocaleString()}</td>
              <td className={styles.td}>{s.idle_fixations}</td>
              <td className={`${styles.td} ${styles.duration}`}>{fmtDuration(s.duration)}</td>
              <td className={`${styles.td} ${aucClass(s.auc_judd)}`}>
                {s.auc_judd.toFixed(3)}
              </td>
              <td className={styles.td}>{s.top_zone}</td>
              <td className={styles.td}>{fmtTime(s.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
