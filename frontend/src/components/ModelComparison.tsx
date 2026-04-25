import type { ModelMetrics } from '@/types';
import styles from './ModelComparison.module.css';

interface Props {
  models: ModelMetrics[];
}

const MODEL_COLORS: Record<string, string> = {
  GBR: '#6366f1',
  RF: '#8b5cf6',
  Linear: '#a78bfa',
  'Center Bias': '#3d4466',
  Random: '#2a2f45',
};

export default function ModelComparison({ models }: Props) {
  const sorted = [...models].sort((a, b) => b.auc_judd - a.auc_judd);
  const best = sorted[0];
  const maxScore = sorted[0]?.auc_judd ?? 1;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Model Comparison</span>
        <span className={styles.badge}>AUC-Judd</span>
      </div>

      <div className={styles.rows}>
        {sorted.map((model) => {
          const isBest = model.name === best?.name;
          const pct = ((model.auc_judd / maxScore) * 100).toFixed(1);
          const color = MODEL_COLORS[model.name] ?? '#6366f1';
          return (
            <div key={model.name} className={styles.row}>
              <div className={styles.rowHeader}>
                <span className={styles.modelName}>
                  {isBest && <span className={styles.star}>★</span>}
                  {model.name}
                </span>
                <span className={styles.score}>{model.auc_judd.toFixed(3)}</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {best && (
        <div className={styles.footer}>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>NSS</span>
            <span className={styles.footerValue}>{best.nss.toFixed(2)}</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>CC</span>
            <span className={styles.footerValue}>{best.cc.toFixed(2)}</span>
          </div>
          <div className={styles.footerStat}>
            <span className={styles.footerLabel}>KLD</span>
            <span className={styles.footerValue}>{best.kld.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
