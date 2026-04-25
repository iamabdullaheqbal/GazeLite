'use client';

import { useRef, useEffect } from 'react';
import styles from './HeatmapGrid.module.css';

interface Props {
  grid: number[][];
  width?: number;
  height?: number;
}

export default function HeatmapGrid({ grid, width = 260, height = 260 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = grid.length;
    const cols = grid[0].length;
    const cellW = width / cols;
    const cellH = height / rows;

    // Background
    ctx.fillStyle = '#0d0f18';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1c1f2e';
    ctx.lineWidth = 0.3;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, height);
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(width, r * cellH);
      ctx.stroke();
    }

    // Find max cell
    let maxVal = 0;
    let maxR = 0;
    let maxC = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] > maxVal) {
          maxVal = grid[r][c];
          maxR = r;
          maxC = c;
        }
      }
    }

    // Draw blobs
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = grid[r][c];
        if (val < 0.04) continue;

        const cx = c * cellW + cellW / 2;
        const cy = r * cellH + cellH / 2;
        const radius = Math.max(cellW, cellH) * 0.9;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

        if (val > 0.7) {
          grad.addColorStop(0, `rgba(244,63,94,${val})`);
          grad.addColorStop(0.35, `rgba(249,115,22,${val * 0.8})`);
          grad.addColorStop(0.65, `rgba(245,158,11,${val * 0.4})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        } else if (val > 0.4) {
          grad.addColorStop(0, `rgba(249,115,22,${val})`);
          grad.addColorStop(0.4, `rgba(245,158,11,${val * 0.6})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        } else {
          grad.addColorStop(0, `rgba(99,102,241,${val * 1.2})`);
          grad.addColorStop(0.45, `rgba(34,211,165,${val * 0.5})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(
          c * cellW - cellW * 0.1,
          r * cellH - cellH * 0.1,
          cellW * 1.2,
          cellH * 1.2
        );
      }
    }

    // Highlight max cell
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      maxC * cellW + 1,
      maxR * cellH + 1,
      cellW - 2,
      cellH - 2
    );
  }, [grid, width, height]);

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={styles.canvas}
      />
      <div className={styles.legend}>
        <span className={styles.legendLabel}>Low</span>
        <div className={styles.legendBar} />
        <span className={styles.legendLabel}>High</span>
      </div>
    </div>
  );
}
