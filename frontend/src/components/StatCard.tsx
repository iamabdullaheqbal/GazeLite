import type { AccentColor } from '@/types';
import styles from './StatCard.module.css';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: AccentColor;
  mono?: boolean;
}

export default function StatCard({ label, value, sub, accent = 'indigo', mono = false }: Props) {
  return (
    <div className={`${styles.card} ${styles[accent]}`}>
      <div className={styles.glow} />
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${mono ? styles.mono : ''}`}>{value}</span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
