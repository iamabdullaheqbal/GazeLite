'use client';

import { useState, useEffect } from 'react';
import { fetchModels } from '@/lib/api';
import type { ModelMetrics } from '@/types';
import styles from './page.module.css';

const MODEL_COLORS: Record<string, string> = {
  GBR: '#6366f1',
  RF: '#8b5cf6',
  Linear: '#a78bfa',
  'Center Bias': '#3d4466',
  Random: '#2a2f45',
};

const METRICS: { key: keyof ModelMetrics; label: string; higherIsBetter: boolean }[] = [
  { key: 'auc_judd', label: 'AUC-Judd', higherIsBetter: true },
  { key: 'nss', label: 'NSS', higherIsBetter: true },
  { key: 'cc', label: 'CC', higherIsBetter: true },
  { key: 'kld', label: 'KLD', higherIsBetter: false },
];

const EXPLANATIONS = [
  {
    metric: 'AUC-Judd',
    text: 'Area Under the ROC Curve, computed over fixation locations. Measures how well the model separates fixated from non-fixated regions. Values above 0.72 indicate strong saliency prediction.',
  },
  {
    metric: 'NSS',
    text: 'Normalized Scanpath Saliency. The average normalized saliency value at human fixation locations. A score of 0 means chance; higher values (>2) indicate strong alignment with human gaze.',
  },
  {
    metric: 'CC',
    text: 'Pearson Correlation Coefficient between predicted and ground-truth saliency maps. Ranges from -1 to 1; values above 0.6 are considered good. Sensitive to overall map shape.',
  },
  {
    metric: 'KLD',
    text: 'Kullback-Leibler Divergence between predicted and ground-truth distributions. Lower is better. Penalizes maps that assign low probability to highly fixated regions.',
  },
];

function getBest(models: ModelMetrics[], key: keyof ModelMetrics, higherIsBetter: boolean) {
  return models.reduce((best, m) => {
    const bv = best[key] as number;
    const mv = m[key] as number;
    return higherIsBetter ? (mv > bv ? m : best) : (mv < bv ? m : best);
  }, models[0]);
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelMetrics[]>([]);

  useEffect(() => {
    fetchModels().then(setModels);
  }, []);

  const sorted = [...models].sort((a, b) => b.auc_judd - a.auc_judd);
  const overallBest = sorted[0];

  function isBestForMetric(m: ModelMetrics, metric: typeof METRICS[number]) {
    if (!models.length) return false;
    const best = getBest(models, metric.key, metric.higherIsBetter);
    return best?.name === m.name;
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Model Comparison</h1>
        <span className={styles.pageSubtitle}>
          5 models · 4 evaluation metrics · best highlighted per column
        </span>
      </div>

      {/* Full comparison table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>All Models</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Model</th>
              <th className={styles.th}>AUC-Judd ↑</th>
              <th className={styles.th}>NSS ↑</th>
              <th className={styles.th}>CC ↑</th>
              <th className={styles.th}>KLD ↓</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((m) => (
              <tr key={m.name} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.modelName}>
                    {m.name === overallBest?.name && (
                      <span className={styles.star}>★</span>
                    )}
                    {m.name}
                  </div>
                </td>
                {METRICS.map((metric) => {
                  const val = m[metric.key] as number;
                  const best = isBestForMetric(m, metric);
                  return (
                    <td
                      key={metric.key}
                      className={`${styles.td} ${best ? styles.bestCell : ''}`}
                    >
                      {val.toFixed(3)}
                      {best && ' ★'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar charts per metric */}
      <div className={styles.chartsGrid}>
        {METRICS.map((metric) => {
          const values = sorted.map((m) => m[metric.key] as number);
          const maxVal = metric.higherIsBetter
            ? Math.max(...values)
            : Math.max(...values);
          const best = models.length ? getBest(models, metric.key, metric.higherIsBetter) : null;

          return (
            <div key={metric.key} className={styles.chartCard}>
              <div className={styles.chartTitle}>
                {metric.label}
                <span className={styles.chartBadge}>
                  {metric.higherIsBetter ? '↑ higher' : '↓ lower'}
                </span>
              </div>
              <div className={styles.chartRows}>
                {sorted.map((m) => {
                  const val = m[metric.key] as number;
                  const pct = maxVal ? (val / maxVal) * 100 : 0;
                  const isBest = best?.name === m.name;
                  return (
                    <div key={m.name} className={styles.chartRow}>
                      <div className={styles.chartRowHeader}>
                        <span className={styles.chartLabel}>{m.name}</span>
                        <span className={`${styles.chartValue} ${isBest ? styles.best : ''}`}>
                          {val.toFixed(3)}
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.bar}
                          style={{
                            width: `${pct}%`,
                            background: MODEL_COLORS[m.name] ?? '#6366f1',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanations */}
      <div className={styles.explanations}>
        <div className={styles.explanationHeader}>Metric Explanations</div>
        <div className={styles.expGrid}>
          {EXPLANATIONS.map((exp) => (
            <div key={exp.metric} className={styles.expItem}>
              <div className={styles.expMetric}>{exp.metric}</div>
              <p className={styles.expText}>{exp.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
